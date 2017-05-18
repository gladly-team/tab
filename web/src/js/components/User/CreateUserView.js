import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';

import { goToDashboard, goToLogin } from 'navigation/navigation';
import { getCurrentUser } from '../../utils/cognito-auth';

import CreateNewUserMutation from 'mutations/CreateNewUserMutation';

class CreateUserView extends React.Component { 

  componentDidMount() {
    getCurrentUser((user) => {
      if (user == null) {
        goToLogin();
      }

      const sub = user.sub;
      const email = user.email;

      CreateNewUserMutation.commit(
        environment,
        sub,
        email,
        (response) => {
          goToDashboard();
        },
        (err) => {
          console.error(err);
        }
      );
    });
  }

  render() {
    return null;
  }
}

export default CreateUserView;
