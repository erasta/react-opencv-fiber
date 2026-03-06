#!/bin/bash
cd "$(dirname "$0")"
for dir in */; do
  if [ -f "$dir/package.json" ]; then
    echo "Installing and building $dir..."
    (cd "$dir" && npm install && npm run build)
  fi
done
echo "Done. Open index.html in a browser."
