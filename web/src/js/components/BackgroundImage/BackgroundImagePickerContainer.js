import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import BackgroundImagePicker from './BackgroundImagePickerComponent';

export default createFragmentContainer(BackgroundImagePicker, {
  app: graphql`
    fragment BackgroundImagePickerContainer_app on App {
      backgroundImages(first: 20) {
        edges {
          node {
            id
            name
            url
          }
        }
      }
    }
  `,
  user: graphql`
    fragment BackgroundImagePickerContainer_user on User {
      id
    }
  `
});
