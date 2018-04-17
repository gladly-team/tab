import React from 'react'
import PropTypes from 'prop-types'

import WidgetPieceWrapper from '../../WidgetPieceWrapper'
import Chip from 'material-ui/Chip'
import AddCircle from 'material-ui/svg-icons/content/add-circle'
import appTheme from 'theme/default'

class NotesHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveringAdd: false
    }
  }

  addNote () {
    this.props.addNote()
  }

  onAddBtnMouseMove (enter) {
    this.setState({
      hoveringAdd: enter
    })
  }

  render () {
    const chip = {
      style: {
        margin: 5,
        borderRadius: 3
      },
      backgroundColor: appTheme.palette.primary1Color,
      labelColor: '#FFF',
      addIcon: {
        cursor: 'pointer',
        float: 'right',
        margin: '4px -4px 0px 4px',
        hoverColor: appTheme.fontIcon.color,
        color: 'rgba(255,255,255,.3)',
        display: 'inline-block'
      }
    }

    var addIconColor = (this.state.hoveringAdd)
      ? chip.addIcon.hoverColor : chip.addIcon.color

    return (
      <WidgetPieceWrapper>
        <Chip
          key={'node-header-key'}
          backgroundColor={chip.backgroundColor}
          labelColor={chip.labelColor}
          style={chip.style}>
            Notes
          <div style={{display: 'inline', marginLeft: 10}}>
            <AddCircle
              color={addIconColor}
              style={chip.addIcon}
              onClick={this.addNote.bind(this)}
              onMouseEnter={this.onAddBtnMouseMove.bind(this, true)}
              onMouseLeave={this.onAddBtnMouseMove.bind(this, false)} />
          </div>
        </Chip>
      </WidgetPieceWrapper>
    )
  }
}

NotesHeader.propTypes = {
  addNote: PropTypes.func.isRequired
}

NotesHeader.defaultProps = {
}

export default NotesHeader
