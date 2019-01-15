import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import BackgroundColorPicker from 'js/components/Background/BackgroundColorPickerComponent'

export default createFragmentContainer(BackgroundColorPicker, {
  user: graphql`
    fragment BackgroundColorPickerContainer_user on User {
      backgroundColor
    }
  `,
})
