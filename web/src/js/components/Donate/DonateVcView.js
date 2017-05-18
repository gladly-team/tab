import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';

import FullScreenProgress from 'general/FullScreenProgress';
import AuthUserComponent from 'general/AuthUserComponent';

import DonateVc from './DonateVcContainer';

class DonateVcView extends React.Component { 
  render() {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query DonateVcViewQuery($userId: String!) {
              app {
                ...DonateVcContainer_app
              }
              user(userId: $userId) {
                ...DonateVcContainer_user
              }
            }
          `}
          render={({error, props}) => {
            if (props) {
              return (
                  <DonateVc
                    app={props.app} 
                    user={props.user}/>
              )
            } else {
              return (<FullScreenProgress />);
            }
          }}/>
      </AuthUserComponent>
    );
  }
}

export default DonateVcView;
