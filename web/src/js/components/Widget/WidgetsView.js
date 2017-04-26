import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';

import Widgets from './WidgetsContainer';

class WidgetsView extends React.Component { 
  render() {
    return (
        <QueryRenderer
          environment={environment}
          query={graphql`
            query WidgetsViewQuery($userId: String!) {
              user(userId: $userId) {
                ...WidgetsContainer_user
              }
            }
          `}
          variables={{userId: "45bbefbf-63d1-4d36-931e-212fbe2bc3d9"}}
          render={({error, props}) => {
            if (props) {
              return (
                  <Widgets user={props.user}/>
              )
            } else {
              return null;
            }
          }}/>
    );
  }
}

export default WidgetsView;
