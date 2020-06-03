#!/bin/bash
set -e
set -o pipefail

yarn
yarn run compile
node lib/entrypoint.js
cd vuepress-output
../node_modules/.bin/vuepress build
cd .vuepress/dist
git config --global user.email "fbenoit@redhat.com"
git config --global user.name "Florent Benoit"
git init .
git checkout --orphan gh-pages
git add *
git commit -m "Stats"
git push -f "https://$GITHUB_ACTOR:$GITHUB_TOKEN@github.com/benoitf/che-trend.git" gh-pages
