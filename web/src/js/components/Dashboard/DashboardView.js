import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';
import FullScreenProgress from 'general/FullScreenProgress';
import AuthUserComponent from 'general/AuthUserComponent';

import DashboardContainer from './DashboardContainer';

class DashboardView extends React.Component { 
  render() {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query DashboardViewQuery($userId: String!) {
              user(userId: $userId) {
                ...DashboardContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (props) {
              return (
                  <DashboardContainer user={props.user}/>
              )
            } else {
              return null;
            }
          }}/>
      </AuthUserComponent>
    );
  }
}

export default DashboardView;
