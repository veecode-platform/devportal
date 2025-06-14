/* eslint-disable @backstage/no-undeclared-imports */
import React from 'react';

import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  createScaffolderLayout,
  LayoutTemplate,
} from '@backstage/plugin-scaffolder-react';

import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '100%',
    maxWidth: '1100px',
    padding: theme.spacing(2),
    margin: 'auto',
  },
  content: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  field: {
    width: '100%',
  },
}));

const CustomComponent: LayoutTemplate = ({
  properties,
  description,
  title,
}) => {
  const { wrapper, content, field } = useStyles();

  return (
    <div className={wrapper}>
      <h1>{title}</h1>
      <h2>{description}</h2>
      <Grid container className={content}>
        {properties.map(prop => (
          <Grid item key={prop.content.key} className={field}>
            {prop.content}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export const LayoutCustom = scaffolderPlugin.provide(
  createScaffolderLayout({
    name: 'LayoutCustom',
    component: CustomComponent,
  }),
);
