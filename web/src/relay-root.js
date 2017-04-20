/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {QueryRenderer} from 'react-relay/compat';
import RelayClassic from 'react-relay/classic'
import AppContainer from './js/components/App/AppContainer';
import environment from './relay-env';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepPurple500} from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';

import DashboardContainer from './js/components/Dashboard/DashboardContainer';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepPurple500,
  },
});

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();

class RelayRoot extends React.Component { 
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query relay_rootQuery($userId: String!) {
              app {
                ...DashboardContainer_app
              }
              user(userId: $userId) {
                ...DashboardContainer_user
              }
            }
          `}
          variables={{userId: "45bbefbf-63d1-4d36-931e-212fbe2bc3d9"}}
          render={({error, props}) => {
            if (props) {
              return (
                <AppContainer viewer={props.viewer}>
                  <DashboardContainer app={props.app} user={props.user}/>
                </AppContainer>)
            } else {
              return null;
            }
          }}/>
      </MuiThemeProvider>
    );
  }
}

export default RelayRoot;