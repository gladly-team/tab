import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';

import DonateVc from './DonateVcContainer';

class DonateVcView extends React.Component { 
  render() {
    return (
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
          variables={{userId: "45bbefbf-63d1-4d36-931e-212fbe2bc3d9"}}
          render={({error, props}) => {
            if (props) {
              return (
                  <DonateVc
                    app={props.app} 
                    user={props.user}/>
              )
            } else {
              return null;
            }
          }}/>
    );
  }
}

export default DonateVcView;
