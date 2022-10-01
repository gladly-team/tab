import environment from 'js/relay-env'
import commitMutation from 'relay-commit-mutation-promise'

jest.mock('js/relay-env')
jest.mock('relay-commit-mutation-promise')

afterEach(() => {
  jest.clearAllMocks()
})

const userId = 'some-user-id'
const accepted = true
const browser = 'chrome'

describe('CreateSfacExtensionPromptResponseMutation', () => {
  it('calls commitMutation with the expected arguments', async () => {
    expect.assertions(1)
    const CreateSfacExtensionPromptResponseMutation = require('../CreateSfacExtensionPromptResponseMutation')
      .default
    await CreateSfacExtensionPromptResponseMutation(userId, browser, accepted)
    expect(commitMutation).toHaveBeenCalledWith(environment, {
      mutation: expect.any(Function),
      variables: {
        input: {
          userId,
          accepted,
          browser,
        },
      },
    })
  })

  it('returns the commitMutation response', async () => {
    expect.assertions(1)
    const CreateSfacExtensionPromptResponseMutation = require('../CreateSfacExtensionPromptResponseMutation')
      .default
    commitMutation.mockResolvedValue({
      user: {
        showSfacExtensionPrompt: false,
      },
    })
    const response = await CreateSfacExtensionPromptResponseMutation(
      userId,
      browser,
      accepted
    )
    expect(response).toEqual({
      user: {
        showSfacExtensionPrompt: false,
      },
    })
  })
})
