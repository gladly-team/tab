import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import App from 'js/components/App/App'
import SearchView from 'js/components/Search/SearchView'

export default props => (
  // TODO: Show 404 page from Redirect
  <Switch>
    <Route path="/newtab" component={App} />
    <Route path="/search" component={SearchView} />
    <Redirect from="*" to="/newtab" />
  </Switch>
)
