import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import ViewerQueries from './ViewerQueries';
import AppContainer from '../components/App/AppContainer';
import WidgetsContainer from '../components/Widgets/WidgetsContainer';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQueries}>
    <IndexRoute component={WidgetsContainer} queries={ViewerQueries}/>
    <Redirect from='*' to='/' />
  </Route>
);

