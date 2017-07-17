import React from 'react'
import PropTypes from 'prop-types'

import RandomAppearAnimation from 'general/RandomAppearAnimation'
import Chip from 'material-ui/Chip'
import AddCircle from 'material-ui/svg-icons/content/add-circle'

class EmptyWidgetMsg extends React.Component {
  render () {
    const { widgetName } = this.props

    const chip = {
      style: {
        margin: 5,
        minWidth: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
      },
      labelStyle: {
        width: '100%',
        textAlign: 'center'
      },
      backgroundColor: 'rgba(0,0,0,.3)',
      labelColor: '#FFF',
      addIcon: {
        marginLeft: 5,
        marginRight: 5,
        position: 'relative',
        top: 6,
        color: '#FFF'
      }
    }

    const msg = (
      <Chip
        key={widgetName + '-chip-key'}
        backgroundColor={chip.backgroundColor}
        labelColor={chip.labelColor}
        labelStyle={chip.labelStyle}
        style={chip.style}>
          Use
          <div style={{ display: 'inline' }}>
            <AddCircle
              color={chip.addIcon.color}
              style={chip.addIcon} />
          </div>
          to add new <b>{widgetName}</b>
      </Chip>)

    return (
      <RandomAppearAnimation
        delayRange={300}>
        {msg}
      </RandomAppearAnimation>)
  }
}

EmptyWidgetMsg.propTypes = {
  widgetName: PropTypes.string.isRequired
}

export default EmptyWidgetMsg
