import {
  commitMutation,
  graphql
} from 'react-relay/compat'

const mutation = graphql`
  mutation LogTabMutation($input: LogTabInput!) {
    logTab(input: $input) {
      user {
        id
      }
    }
  }
`

function commit (environment, user) {
  const userId = user.id

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: { userId }
      },
      updater: (store) => {
        // Add 1 to the user's VC.
        const rootField = store.getRootField('logTab')
        const user = rootField.getLinkedRecord('user')
        user.setValue(user.getValue('vcCurrent') + 1, 'vcCurrent')
      }
    }
  )
}

export default {commit}
