#!/usr/bin/env bash
set -o errexit

apt-get update
apt-get install -y tesseract-ocr tesseract-ocr-ben poppler-utils ffmpeg

pip install --upgrade pip
pip install -r requirements.txt

mkdir -p uploads