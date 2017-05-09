import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';
import FullScreenProgress from 'general/FullScreenProgress';

import AppContainer from './AppContainer';

class AppView extends React.Component { 
  render() {
    return (
        <QueryRenderer
          environment={environment}
          query={graphql`
            query AppViewQuery($userId: String!) {
              user(userId: $userId) {
                ...AppContainer_user
              }
            }
          `}
          variables={{userId: "45bbefbf-63d1-4d36-931e-212fbe2bc3d9"}}
          render={({error, props}) => {
            if (props) {
              return (
                  <AppContainer 
                    user={props.user}
                    {...this.props}>
                     {this.props.children}
                  </AppContainer>
              )
            } else {
              return (<FullScreenProgress />);
            }
          }}/>
    );
  }
}

export default AppView;
