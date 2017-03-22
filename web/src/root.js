import React from 'react';
import Relay from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { browserHistory, applyRouterMiddleware, Router } from 'react-router';
import useRelay from 'react-router-relay';
import Routes from './js/routes/Route';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepPurple500} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
    palette: {
      accent1Color: deepPurple500,
    },
  });

const Root = () => (
	<MuiThemeProvider muiTheme={muiTheme}>
	  <Router
	    history={browserHistory} routes={Routes} render={applyRouterMiddleware(useRelay)}
	    environment={Relay.Store}
	  />
	</MuiThemeProvider>
);

export default Root;
