#!/bin/bash

if [ -n "$PLATFORM_DEVPORTAL_THEME_URL" ]; then
    echo "Downloading custom theme file from $PLATFORM_DEVPORTAL_THEME_URL"
    curl -L -o /app/packages/app/dist/theme.json "$PLATFORM_DEVPORTAL_THEME_URL"
fi

exec "$@"