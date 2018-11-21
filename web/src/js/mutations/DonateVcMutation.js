import {
  graphql
} from 'react-relay'
import commitMutation from 'relay-commit-mutation-promise'
import environment from 'js/relay-env'

const mutation = graphql`
  mutation DonateVcMutation($input: DonateVcInput!) {
    donateVc(input: $input) {
      user {
        vcCurrent 
      }
    }
  }
`

// Relay tool for mutations with promises:
// https://github.com/relay-tools/relay-commit-mutation-promise
// A good reference for mutation design:
// https://medium.com/entria/wrangling-the-client-store-with-the-relay-modern-updater-function-5c32149a71ac
export default (input, otherVars = {}) => {
  const { userId, charityId, vc } = input
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          userId,
          charityId,
          vc
        }
      },
      updater: store => {
        // Update the charity's "vcReceived" field to include the
        // VC this user just donated.
        // There may also be a "vcReceived" field with startTime and
        // endTime arguments-- such as when a "Heart donation" campaign
        // live-- so update that field as well.
        const charityRecord = store.get(charityId)
        if (charityRecord) {
          const vcReceivedFieldName = 'vcReceived'
          // TODO: update the plain "vcReceived" field too.

          // TODO: use optional arguments passed to the mutation.
          // TODO: check if the current time is between the start and
          // end time of the campaign.
          const vcReceivedArgs = {
            startTime: '2018-11-09T19:00:00.000Z',
            endTime: '2018-11-30T19:00:00.000Z'
          }

          // TODO: don't set the value if the field value does not
          // exist, because it won't be accurate.
          const currentVcReceived = charityRecord
            .getValue(vcReceivedFieldName, vcReceivedArgs) || 0
          charityRecord.setValue(
            vc + currentVcReceived,
            vcReceivedFieldName,
            vcReceivedArgs
          )
        }
      }
    }
  )
}
