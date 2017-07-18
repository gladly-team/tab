/* global graphql */

import React from 'react'
import {QueryRenderer} from 'react-relay/compat'
import environment from '../../../relay-env'

import MoneyRaised from './MoneyRaisedContainer'

class MoneyRaisedView extends React.Component {
  render () {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
            query MoneyRaisedViewQuery {
              app {
                ...MoneyRaisedContainer_app
              }
            }
          `}
        render={({error, props}) => {
          if (error) {
            console.error(error)
            return
          }
          const data = (props && props.app) || null
          return (<MoneyRaised
            app={data} />)
        }} />
    )
  }
}

export default MoneyRaisedView
