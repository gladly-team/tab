import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../../relay-env';

import BackgroundSettigns from './BackgroundSettingsContainer';
import FullScreenProgress from 'general/FullScreenProgress';

class BackgroundSettingsView extends React.Component { 
  render() {
    return (
        <QueryRenderer
          environment={environment}
          query={graphql`
            query BackgroundSettingsViewQuery($userId: String!) {
              app {
                ...BackgroundSettingsContainer_app
              }
              user(userId: $userId) {
                ...BackgroundSettingsContainer_user
              }
            }
          `}
          variables={{userId: "45bbefbf-63d1-4d36-931e-212fbe2bc3d9"}}
          render={({error, props}) => {
            if (props) {
              return (
                  <BackgroundSettigns 
                    app={props.app}
                    user={props.user}/>
              )
            } else {
              return (<FullScreenProgress />);
            }
          }}/>
    );
  }
}

export default BackgroundSettingsView;
