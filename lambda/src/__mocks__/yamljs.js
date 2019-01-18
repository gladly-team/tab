/* global jest */
"use strict";

const YAMLMock = jest.genMockFromModule("yamljs");

let mockYAML = Object.create(null);

// Tests can use this function to add mock loaded YAML.
// newMockYAML should be an object containing file names
// for keys and objects or arrays reqpresenting the parsed
// YAML loaded from that file.
function __setMockYAML(newMockYAML) {
  mockYAML = newMockYAML;
}

function __getMockYAML() {
  return mockYAML;
}

// A custom version of YAML.load.
function load(filePath) {
  return mockYAML[filePath] || {};
}

YAMLMock.__setMockYAML = __setMockYAML;
YAMLMock.__getMockYAML = __getMockYAML;
YAMLMock.load = load;
module.exports = YAMLMock;
