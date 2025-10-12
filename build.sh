#!/usr/bin/env bash
set -o errexit

# --- ADD THESE TWO LINES TO FORCE PYTHON 3.11.8 ---
pyenv install 3.11.8 -s
pyenv global 3.11.8
# --------------------------------------------------

apt-get update
apt-get install -y tesseract-ocr tesseract-ocr-ben poppler-utils ffmpeg

pip install --upgrade pip
pip install -r requirements.txt

mkdir -p uploads
