import React from 'react';

import {
  InfoCard as BSInfoCard,
  CopyTextButton,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import buildMetadata from '../../build-metadata.json';
import { BuildInfo } from '../../types/types';

export const InfoCard = () => {
  const config = useApi(configApiRef);
  const buildInfo: BuildInfo | undefined = config.getOptional('buildInfo');

  const [showBuildInformation, setShowBuildInformation] =
    React.useState<boolean>(
      () =>
        localStorage.getItem('rhdh-infocard-show-build-information') === 'true',
    );

  const toggleBuildInformation = () => {
    setShowBuildInformation(!showBuildInformation);
    try {
      if (showBuildInformation) {
        localStorage.removeItem('rhdh-infocard-show-build-information');
      } else {
        localStorage.setItem('rhdh-infocard-show-build-information', 'true');
      }
    } catch (e) {
      // ignore
    }
  };

  const title = buildInfo?.title ?? buildMetadata.title;

  let clipboardText = title;
  const buildDetails = Object.entries(
    buildInfo?.full === false // append build versions to the object only when buildInfo.full === false
      ? { ...buildInfo?.card, ...buildMetadata?.card }
      : (buildInfo?.card ?? buildMetadata?.card),
  ).map(([key, value]) => `${key}: ${value}`);
  if (buildDetails?.length) {
    clipboardText += '\n\n';
    buildDetails.forEach(text => {
      clipboardText += `${text}\n`;
    });
  }

  const filteredContent = () => {
    if (buildInfo?.card) {
      return buildDetails.slice(0, 2);
    }
    return buildDetails.filter(
      text =>
        text.startsWith('RHDH Version') || text.startsWith('Backstage Version'),
    );
  };

  const filteredCards = showBuildInformation ? buildDetails : filteredContent();
  // Ensure that we show always some information
  const versionInfo =
    filteredCards.length > 0 ? filteredCards.join('\n') : buildDetails[0];

  /**
   * Show all build information and automatically select them
   * when the user selects the version with the mouse.
   */
  const onMouseUp = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (!showBuildInformation) {
      setShowBuildInformation(true);
      window.getSelection()?.selectAllChildren(event.target as Node);
    }
  };

  /**
   * Show all build information and automatically select them
   * when the user selects the version with the keyboard (tab)
   * and presses the space key or the Ctrl+C key combination.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (
      event.key === ' ' ||
      (event.key === 'c' && event.ctrlKey) ||
      (event.key === 'C' && event.ctrlKey)
    ) {
      setShowBuildInformation(true);
      window.getSelection()?.selectAllChildren(event.target as Node);
    }
  };

  return (
    <BSInfoCard
      title={title}
      action={
        // This is a workaround to ensure that the buttons doesn't increase the header size.
        <div style={{ position: 'relative' }}>
          <div
            style={{ position: 'absolute', top: -2, right: 0, display: 'flex' }}
          >
            <CopyTextButton
              text={clipboardText}
              tooltipText="Metadata copied to clipboard"
              arial-label="Copy metadata to your clipboard"
            />
            <IconButton
              title={showBuildInformation ? 'Show less' : 'Show more'}
              onClick={toggleBuildInformation}
              style={{ width: 48 }}
            >
              {showBuildInformation ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            </IconButton>
          </div>
        </div>
      }
    >
      <Typography
        variant="subtitle1"
        // Allow the user to select the text with the keyboard.
        tabIndex={0}
        onMouseUp={onMouseUp}
        onKeyDown={onKeyDown}
        style={{
          whiteSpace: 'pre-line',
          wordWrap: 'break-word',
          lineHeight: '2.1rem',
        }}
      >
        {versionInfo}
      </Typography>
    </BSInfoCard>
  );
};
