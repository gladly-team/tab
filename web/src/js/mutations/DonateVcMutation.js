import graphql from 'babel-plugin-relay/macro'
import commitMutation from 'relay-commit-mutation-promise'
import moment from 'moment'
import { isNil } from 'lodash/lang'
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
  const { vcReceivedArgs = {} } = otherVars
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        userId,
        charityId,
        vc,
      },
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

        // Update the plain "vcReceived" field if it exists.
        const currentVcReceived = charityRecord.getValue(vcReceivedFieldName)
        if (!isNil(currentVcReceived)) {
          charityRecord.setValue(vc + currentVcReceived, vcReceivedFieldName)
        }

        // Update the "vcReceived" field for a particular time period if
        // the current time is within the time period.
        if (
          vcReceivedArgs.startTime &&
          vcReceivedArgs.endTime &&
          moment() > moment(vcReceivedArgs.startTime) &&
          moment() < moment(vcReceivedArgs.endTime)
        ) {
          const args = {
            startTime: vcReceivedArgs.startTime,
            endTime: vcReceivedArgs.endTime,
          }
          const vcReceivedInTimePeriod = charityRecord.getValue(
            vcReceivedFieldName,
            args
          )
          if (!isNil(vcReceivedInTimePeriod)) {
            charityRecord.setValue(
              vc + vcReceivedInTimePeriod,
              vcReceivedFieldName,
              args
            )
          }
        }
      }
    },
  })
}
