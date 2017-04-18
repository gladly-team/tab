#!/bin/bash
set -x
set -e
BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}
cd ./lambda && npm test
