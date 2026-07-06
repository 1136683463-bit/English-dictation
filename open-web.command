#!/bin/bash
set -e

cd "$(dirname "$0")"

URL="http://127.0.0.1:1420/"
LOG_FILE=".open-web.log"

if lsof -iTCP:1420 -sTCP:LISTEN >/dev/null 2>&1; then
  open "$URL"
  exit 0
fi

nohup npm run dev -- --host 127.0.0.1 > "$LOG_FILE" 2>&1 &

for _ in {1..30}; do
  if curl -sSf "$URL" >/dev/null 2>&1; then
    open "$URL"
    exit 0
  fi
  sleep 1
done

open "$URL"
