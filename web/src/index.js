// //https://github.com/stylelint/stylelint/issues/1316
if (!global._babelPolyfill) {
   require('babel-polyfill');
}

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './root';

import Relay, {
  DefaultNetworkLayer,
} from 'react-relay';

Relay.injectNetworkLayer(
  new DefaultNetworkLayer('http://localhost:8080')
);

const rootNode = document.createElement('div');
document.body.appendChild(rootNode);

const render = (Component) => {
  ReactDOM.render(
    <AppContainer >
      <Component />
    </AppContainer>,
    rootNode
  );
};

render(Root);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./root', () => {
    render(root);
  });
}

