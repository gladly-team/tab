import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../../relay-env';

import WidgetsSettigns from './WidgetsSettingsContainer';
import FullScreenProgress from 'general/FullScreenProgress';

class WidgetsSettingsView extends React.Component { 
  render() {
    return (
        <QueryRenderer
          environment={environment}
          query={graphql`
            query WidgetsSettingsViewQuery($userId: String!) {
              user(userId: $userId) {
                ...WidgetsSettingsContainer_user
              }
            }
          `}
          variables={{userId: "45bbefbf-63d1-4d36-931e-212fbe2bc3d9"}}
          render={({error, props}) => {
            if (props) {
              return (
                  <WidgetsSettigns 
                    user={props.user}/>
              )
            } else {
              return (<FullScreenProgress />);
            }
          }}/>
    );
  }
}

export default WidgetsSettingsView;
