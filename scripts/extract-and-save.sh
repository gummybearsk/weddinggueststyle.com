#!/bin/bash
# Usage: This script reads /tmp/extracted-products.json and saves to the specified slug
SLUG=$1
if [ -z "$SLUG" ]; then
  echo "Usage: ./scripts/extract-and-save.sh <slug>"
  exit 1
fi

PRODUCTS=$(cat /tmp/extracted-products.json)
if [ -z "$PRODUCTS" ] || [ "$PRODUCTS" = "[]" ]; then
  echo "SKIP: No products extracted for $SLUG"
  exit 0
fi

node /Users/raymond/Desktop/weddinggueststyle.com/scripts/save-products.js "$SLUG" "$PRODUCTS"
