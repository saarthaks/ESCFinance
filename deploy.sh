#!/bin/bash

echo "Building new version..."
npm install --production
meteor build --directory ../build_tmp/ --architecture os.linux.x86_64
echo "New version built"

NOW=$(date +"%H-%M-%S_%m-%d-%y")
FILE="build-$NOW"
cd ~/Projects/builds
mkdir $FILE

echo "Moving current build to builds/$FILE..." 
cp -rf ~/Projects/build/* ~/Projects/builds/$FILE
echo "Finished moving current build"

echo "Deleting current build files from /build/bundle..."
cd ~/Projects/build/bundle
rm -f README
rm -f main.js
rm -rf programs
rm -rf server
rm -f star.json
echo "Finished deleting current build files"

cd ~/Projects
echo "Copying new build files from /build_tmp/bundle to /build/bundle..."
cp build_tmp/bundle/README build/bundle/README
cp build_tmp/bundle/main.js build/bundle/main.js
cp -rf build_tmp/bundle/programs build/bundle/programs
cp -rf build_tmp/bundle/server build/bundle/server
cp build_tmp/bundle/star.json build/bundle/star.json
echo "Finished copying build files"

echo "Deploying..."
cd ~/Projects/build/bundle
eb deploy

echo "Finished deploying, cleaning up..."
cd ~/Projects
# rm -rf build_tmp
cd ~/Projects/ESCFinance
rm package-lock.json

