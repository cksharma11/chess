#!/bin/bash

# Create sounds directory if it doesn't exist
mkdir -p public/sounds

# Download move sound
curl -L "https://github.com/lichess-org/lila/raw/master/public/sound/standard/Move.mp3" -o public/sounds/move.mp3

# Download capture sound
curl -L "https://github.com/lichess-org/lila/raw/master/public/sound/standard/Capture.mp3" -o public/sounds/capture.mp3 