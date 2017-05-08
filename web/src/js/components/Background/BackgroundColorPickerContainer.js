import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import BackgroundColorPicker from './BackgroundColorPickerComponent';

export default createFragmentContainer(BackgroundColorPicker, {
  user: graphql`
    fragment BackgroundColorPickerContainer_user on User {
      id
      backgroundColor
    }
  `
});
