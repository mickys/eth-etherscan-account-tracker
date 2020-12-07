#!/bin/bash

echo "--------------------------------------------------------------------"
TESTPATHS="";

if [[ "$1" = "all" ]]; then
    TESTPATHS="test/*/*.ts"
else
  if [[ "$1" = "unit" || "$1" = "integration" ]]; then
    TESTPATHS="test/$1/*.ts"
  else
    TESTPATHS="$3"
  fi
fi

echo " Running tests in path \"$TESTPATHS\""
echo "--------------------------------------------------------------------"

./node_modules/.bin/ts-mocha --require source-map-support/register \
  --full-trace \
  --colors \
  --paths ./ $TESTPATHS \
  --timeout 10000

echo "--------------------------------------------------------------------"
