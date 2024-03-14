#!/bin/bash

if ! command -v inotifywait &> /dev/null; then
    echo "inotifywait is not installed. Installing..."
    sudo apt-get install inotify-tools -y
fi

while inotifywait -e modify chart/.frigate; do
  bash chart/generate-docs.sh
done