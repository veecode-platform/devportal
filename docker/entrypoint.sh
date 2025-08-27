#!/bin/bash

# old chart, will remove
if [ -n "$PLATFORM_DEVPORTAL_THEME_URL" ]; then
    echo "Getting custom theme file from $PLATFORM_DEVPORTAL_THEME_URL"
    curl -L -o /app/packages/app/dist/theme.json "$PLATFORM_DEVPORTAL_THEME_URL"
fi
# old chart, will remove
if [ -n "$PLATFORM_DEVPORTAL_FAVICON" ]; then
    echo "Getting favicon.ico from $PLATFORM_DEVPORTAL_FAVICON"
    curl -L -o /app/packages/app/dist/favicon.ico "$PLATFORM_DEVPORTAL_FAVICON"
fi

# new "next" chart
if [ -n "$THEME_DOWNLOAD_URL" ]; then
    echo "Getting custom theme file from $THEME_DOWNLOAD_URL"
    curl -L -o /opt/app-root/src/packages/app/dist/theme.json "$THEME_DOWNLOAD_URL"
elif [ -n "$THEME_CUSTOM_JSON" ]; then
    if [ "false" = "$THEME_MERGE_JSON" ]; then
        echo "Using custom theme JSON from THEME_CUSTOM_JSON"
        echo "$THEME_CUSTOM_JSON" > /opt/app-root/src/packages/app/dist/theme.json
    else
        echo "Merging custom theme JSON from THEME_CUSTOM_JSON"
        yq eval-all 'select(fileIndex == 0) * select(fileIndex == 1)' \
            <(echo "$THEME_CUSTOM_JSON") config.json -o=json /opt/app-root/src/packages/app/dist/theme.json
    fi
fi
# new "next" chart
if [ -n "$THEME_FAV_ICON" ]; then
    echo "Getting favicon.ico from $THEME_FAV_ICON"
    curl -L -o /opt/app-root/src/packages/app/dist/favicon.ico "$THEME_FAV_ICON"
fi


exec "$@"