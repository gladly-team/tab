import React from 'react'
import PropTypes from 'prop-types'
import Charity from '../../Donate/CharityContainer'
import {GridList} from 'material-ui/GridList'
// import {Card, CardHeader} from 'material-ui/Card'
import SettingsChildWrapper from '../SettingsChildWrapperComponent'

class ProfileDonateHearts extends React.Component {
  render () {
    const { app, user } = this.props
    console.log(app)
    const containerStyle = {
      // width: '100%',
      // backgroundColor: '#F2F2F2'
    }
    const gridListStyle = {
      width: '100%',
      margin: 'auto',
      overflowY: 'auto'
    }

    return (
      <SettingsChildWrapper>
        <div
          key={'charities-container-key'}
          style={containerStyle}>
          <GridList
            cols={3}
            padding={30}
            style={gridListStyle}
            cellHeight={'auto'}
          >
            {app.charities.edges.map((edge) => {
              return (
                <Charity
                  key={edge.node.id}
                  charity={edge.node}
                  user={user}
                  showError={this.props.showError}
                  />)
            })}
          </GridList>
        </div>
      </SettingsChildWrapper>
    )
  }
}

ProfileDonateHearts.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.object.isRequired
}

export default ProfileDonateHearts
