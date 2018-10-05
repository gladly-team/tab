import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import BackgroundColorPicker from './BackgroundColorPickerComponent'

export default createFragmentContainer(BackgroundColorPicker, {
  user: graphql`
    fragment BackgroundColorPickerContainer_user on User {
      backgroundColor
    }
  `
})
