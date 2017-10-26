import React from 'react'
import PropTypes from 'prop-types'
import Charity from '../../Donate/CharityContainer'
import { Paper } from 'material-ui'
import {GridList} from 'material-ui/GridList'
import SettingsChildWrapper from '../SettingsChildWrapperComponent'
import InfoOutlineIcon from 'material-ui/svg-icons/action/info-outline'
import { lighterTextColor } from 'theme/default'

class ProfileDonateHearts extends React.Component {
  render () {
    const { app, user } = this.props
    const containerStyle = {
    }
    const gridListStyle = {
      width: '100%',
      margin: 'auto',
      overflowY: 'auto'
    }
    const infoStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
      marginRight: 10,
      color: lighterTextColor
    }

    return (
      <SettingsChildWrapper>
        <div
          key={'charities-container-key'}
          style={containerStyle}>
          <Paper style={infoStyle}>
            <InfoOutlineIcon style={{ marginRight: 8, color: lighterTextColor }} />
            <p>When you donate Hearts, you're telling us to distribute
             more of the money we raise to that charity.
            </p>
          </Paper>
          <GridList
            cols={3}
            padding={18}
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
