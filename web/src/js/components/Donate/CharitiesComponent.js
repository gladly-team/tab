import React from 'react'
import PropTypes from 'prop-types'

import FadeInAnimation from 'general/FadeInAnimation'

import Charity from './CharityContainer'
import {GridList} from 'material-ui/GridList'

class Charities extends React.Component {
  render () {
    const { app, user } = this.props

    const container = {
      width: '100%',
      backgroundColor: '#F2F2F2'
    }

    const gridList = {
      width: '100%',
      margin: 'auto',
      overflowY: 'auto'
    }

    return (
      <FadeInAnimation>
        <div
          key={'charities-container-key'}
          style={container}>
          <GridList
            cols={4}
            padding={30}
            style={gridList}
            cellHeight={'auto'}>
            {app.charities.edges.map((edge) => {
              return (
                <Charity
                  key={edge.node.id}
                  charity={edge.node}
                  user={user} />)
            })}
          </GridList>
        </div>
      </FadeInAnimation>
    )
  }
}

Charities.propTypes = {
  app: PropTypes.object.isRequired
}

export default Charities
