import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import BackgroundColorPicker from 'js/components/Background/BackgroundColorPickerComponent'

export default createFragmentContainer(BackgroundColorPicker, {
  user: graphql`
    fragment BackgroundColorPickerContainer_user on User {
      backgroundColor
    }
  `
})
