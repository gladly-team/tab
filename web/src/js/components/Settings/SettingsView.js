import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';

import Settigns from './SettingsContainer';

class SettingsView extends React.Component { 
  render() {
    return (
        <QueryRenderer
          environment={environment}
          query={graphql`
            query SettingsViewQuery($userId: String!) {
              user(userId: $userId) {
                ...SettingsContainer_user
              }
            }
          `}
          variables={{userId: "45bbefbf-63d1-4d36-931e-212fbe2bc3d9"}}
          render={({error, props}) => {
            if (props) {
              return (
                  <Settigns 
                    user={props.user}/>
              )
            } else {
              return (<h1>Loading Settings</h1>);
            }
          }}/>
    );
  }
}

export default SettingsView;
