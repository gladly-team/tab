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

class RelayRoot extends React.Component { 
  render() {
    return (<QueryRenderer
        environment={environment}
        query={graphql`
          query relay_rootQuery {
            viewer {
              ...AppContainer_viewer
            }
          }
        `}
        variables={{status: null}}
        render={({error, props}) => {
          if (props) {
            return <AppContainer viewer={props.viewer} />
          } else {
            return <div>Loading</div>;
          }
        }}/>
    );
  }
}

export default RelayRoot;