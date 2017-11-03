import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import appTheme, {
  widgetEditButtonInactive,
  widgetEditButtonHover
} from 'theme/default'
import EditWidgetChipAnimation from './EditWidgetChipAnimation'

// Holds the widget name and any "add" or "edit"
// buttons and menus.
class EditWidgetChip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  closeForm () {
    this.setState({
      expanded: false
    })
  }

  openForm () {
    this.setState({
      expanded: true
    })
  }

  render () {
    const animationDurationMs = 140

    const content = this.state.expanded
      ? (
        <span
          key={'hi'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            paddingTop: 20,
            boxSizing: 'border-box'
          }}
        >
          {this.props.widgetAddFormElem}
        </span>
      )
      : (
        <span
          key={'hello'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            paddingLeft: 12,
            paddingRight: 8
          }}
        >
          <span>{this.props.widgetName}</span>
        </span>
      )

    const iconContainerStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      position: 'absolute',
      top: 4,
      right: 4
    }
    const expandedIconStyle = {
      cursor: 'pointer',
      hoverColor: appTheme.fontIcon.color,
      color: 'rgba(255,255,255,.3)',
      display: 'inline-block'
    }
    const icons = this.state.expanded
      ? (
        <div
          key={'icons-expanded'}
          style={iconContainerStyle}
        >
          <DeleteIcon
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={expandedIconStyle}
            onClick={this.closeForm.bind(this)}
          />
          <CheckCircleIcon
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={expandedIconStyle}
            onClick={() => {
              this.closeForm()
              this.props.onWidgetAddIconClick()
            }}
          />
        </div>
      )
      : (
        <div
          key={'icons-closed'}
          style={iconContainerStyle}
        >
          <AddCircleIcon
            key={'widget-add-icon'}
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={{
              cursor: 'pointer',
              float: 'right',
              marginLeft: 4,
              hoverColor: appTheme.fontIcon.color,
              color: 'rgba(255,255,255,.3)',
              display: 'inline-block'
            }}
            onClick={this.openForm.bind(this)}
          />
        </div>
      )

    // TODO: need dynamic sizing.
    // Use this?
    // https://github.com/souporserious/react-measure
    // Or this?
    // https://www.npmjs.com/package/react-animate-height
    const closedWidth = 95
    const closedHeight = 32
    const expandedWidth = 290
    const expandedHeight = 102

    return (
      <span>
        <Paper
          zDepth={0}
          style={{
            width: this.state.expanded ? expandedWidth : closedWidth,
            height: this.state.expanded ? expandedHeight : closedHeight,
            position: 'relative',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'space-between',
            fontSize: 14,
            lineHeight: '32px',
            transition: `width ${animationDurationMs}ms ease-in-out, height ${animationDurationMs}ms ease-in-out`,
            margin: 5,
            background: appTheme.palette.primary1Color,
            color: '#FFF',
            userSelect: 'none'
          }}
        >
          <span
            key={'thing'}
            style={{
              position: 'absolute',
              width: '100%',
              boxSizing: 'border-box',
              height: 32,
              display: 'inline-flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <EditWidgetChipAnimation>
              {content}
            </EditWidgetChipAnimation>
          </span>
          <div
            style={{
              display: 'inline-flex',
              justifyContent: 'flex-end',
              position: 'absolute',
              width: '100%',
              left: 0,
              top: 0,
              boxSizing: 'border-box'
            }}
          >
            <EditWidgetChipAnimation>
              {icons}
            </EditWidgetChipAnimation>
          </div>
        </Paper>
      </span>
    )
  }
}

EditWidgetChip.propTypes = {
  widgetName: PropTypes.string.isRequired,
  onWidgetAddIconClick: PropTypes.func,
  widgetAddFormElem: PropTypes.element
}

EditWidgetChip.defaultProps = {
  onWidgetAddIconClick: () => {}
}

export default EditWidgetChip
