import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation CreateSfacExtensionPromptResponseMutation(
    $input: CreateSfacExtensionPromptResponseInput!
  ) {
    createSfacExtensionPromptResponse(input: $input) {
      user {
        showSfacExtensionPrompt
      }
    }
  }
`

const CreateSfacExtensionPromptResponseMutation = (userId, browser, accepted) =>
  commitMutation(environment, {
    mutation,
    variables: {
      input: {
        userId,
        browser,
        accepted,
      },
    },
  })
export default CreateSfacExtensionPromptResponseMutation
