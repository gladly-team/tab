
import App from './js/components/App';
import AppHomeRoute from './js/routes/AppHomeRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay, {
  DefaultNetworkLayer,
} from 'react-relay';
import './schema-refresh';

Relay.injectNetworkLayer(
  new DefaultNetworkLayer('http://localhost:8080')
);

ReactDOM.render(
  <Relay.Renderer
    environment={Relay.Store}
    Container={App}
    queryConfig={new AppHomeRoute()}
  />,
  document.getElementById('root')
);
