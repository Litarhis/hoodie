#!/bin/bash
HOODIE_FOLDER=$(pwd)
TEMP_ROOT=$(mktemp -d)
pushd $TEMP_ROOT
trap "{ CODE=$?; popd; rm -rf $TEMP_ROOT; exit $CODE; }" EXIT

## docs/guides/quickstart.rst:41

npm init -y

## docs/guides/quickstart.rst:47

npm install $HOODIE_FOLDER --save

## docs/guides/quickstart.rst:72

npm start & HOODIE_PROCESS=$!

## Give the process a generous sixty seconds to start

RETRIES=60
while [ "$RETRIES" -gt 0 ] ; do
  sleep 1
  kill -0 $HOODIE_PROCESS 2&>1 > /dev/null || { echo "Hoodie exited prematurely"; wait $HOODIE_PROCESS ; exit $? ; }
  curl -I http://localhost:8080/hoodie/client.js > /dev/null && break
  let RETRIES=RETRIES-1
done

kill $HOODIE_PROCESS

[ $RETRIES -le 0 ] && { echo "Timed out waiting for hoodie to start"; exit 1 ; }

exit 0;
