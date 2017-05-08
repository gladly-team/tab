import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import BackgroundSettings from './BackgroundSettingsComponent';

export default createFragmentContainer(BackgroundSettings, {
  user: graphql`
    fragment BackgroundSettingsContainer_user on User {
      id
      ...BackgroundImagePickerContainer_user
    }
  `,
  app: graphql`
    fragment BackgroundSettingsContainer_app on App {
      ...BackgroundImagePickerContainer_app
    }
  `,
});
