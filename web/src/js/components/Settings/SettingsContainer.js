import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import Settings from './SettingsComponent'

export default createFragmentContainer(Settings, {
  user: graphql`
    fragment SettingsContainer_user on User {
      id
    }
  `
})
