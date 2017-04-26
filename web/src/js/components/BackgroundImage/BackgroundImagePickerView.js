import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';

import BackgroundImagePicker from './BackgroundImagePickerContainer';

class BackgroundImagePickerView extends React.Component { 
  render() {
    return (
        <QueryRenderer
          environment={environment}
          query={graphql`
            query BackgroundImagePickerViewQuery($userId: String!) {
              app {
                ...BackgroundImagePickerContainer_app
              }
              user(userId: $userId) {
                ...BackgroundImagePickerContainer_user
              }
            }
          `}
          variables={{userId: "45bbefbf-63d1-4d36-931e-212fbe2bc3d9"}}
          render={({error, props}) => {
            if (props) {
              return (
                  <BackgroundImagePicker
                    app={props.app} 
                    user={props.user}
                    onImageSelected={this.props.onImageSelected}/>
              )
            } else {
              return null;
            }
          }}/>
    );
  }
}

export default BackgroundImagePickerView;
