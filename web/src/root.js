import React from 'react';

import { browserHistory, Router } from 'react-router';
import Routes from './js/routes/Route';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepPurple500} from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';

const muiTheme = getMuiTheme({
    palette: {
      accent1Color: deepPurple500,
    },
  });

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();

const Root = () => (
	<MuiThemeProvider muiTheme={muiTheme}>
	  <Router
	    history={browserHistory} 
	    routes={Routes} />
	</MuiThemeProvider>
);

export default Root;
