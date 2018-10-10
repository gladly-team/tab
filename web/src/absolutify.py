#!/usr/bin/env python3
import fileinput
import glob
import os
import re
import sys

# Replaces all relative Node module imports with absolute paths
# relative to the directory in which the script runs.
# E.g.: require('../thing') becomes require('js/stuff/thing')
# Useful to convert an existing project to use
# babel-plugin-module-resolver
# (https://github.com/tleunen/babel-plugin-module-resolver)
# or NODE_PATH.

# Regex to find all Node requires and imports, capturing
# the beginning of the relative path.
# https://regex101.com/r/ckl02w/3
pattern = re.compile(r'(from |require\(|jest.mock\()\'(\.{1,2}\/(\.\.\/)*)')

# Change relative import regex matches to absolute imports
# relative to the directory in which the script is running.
def regex_match_rewrite(match, file_path):
  absolute_import_path = os.path.normpath(
    os.path.join(os.path.dirname(file_path), match.group(2)))
  new_import = '{0}\'{1}/'.format(match.group(1), absolute_import_path)
  return new_import

# Iterate through every line in every JS file, replacing every
# relative import string with an absolute one.
for filename in glob.iglob('js/**/*.js', recursive=True):
  with fileinput.FileInput(filename, inplace=True) as file:
    for line in file:
      sys.stdout.write(
        pattern.sub(
          lambda match: regex_match_rewrite(match, filename),
          line
        )
      )
