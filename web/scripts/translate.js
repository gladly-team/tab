/* eslint-disable */
var fs = require('fs');
var globSync = require('glob').sync;
var mkdirpSync = require('mkdirp').sync;

var filePattern = './build/messages/**/*.json';
var outputLanguageDataDir = './build/locales/';

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
var defaultMessages = globSync(filePattern)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }
      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

mkdirpSync(outputLanguageDataDir);

fs.writeFileSync(outputLanguageDataDir + 'data.json', `{ "en": ${JSON.stringify(defaultMessages, null, 2)} }`);