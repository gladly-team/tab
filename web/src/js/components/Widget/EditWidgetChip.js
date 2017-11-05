import React from 'react'
import PropTypes from 'prop-types'
import Measure from 'react-measure'
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
      dimensions: {}
    }
  }

  render () {
    const animationDurationMs = 140

    const content = this.props.open
      ? (
        <span
          key={'widget-edit-chip-add-form'}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            paddingTop: 20,
            boxSizing: 'border-box'
          }}
        >
          {this.props.widgetAddItemForm}
        </span>
      )
      : (
        <span
          key={'widget-edit-chip-content'}
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

    // Measure the dimensions of the child content and add
    // the dimensions to state. Then, we'll set the width
    // and height of the parent container to fit the child
    // content. We do this so we can animate the container
    // expansion while still allowing dynamic child content.
    const measuredContent = (
      <Measure
        bounds
        onResize={(contentRect) => {
          if (contentRect.bounds) {
            this.setState({
              dimensions: contentRect.bounds
            })
          }
        }}
      >
        {({ measureRef }) => {
          return (
            <EditWidgetChipAnimation>
              {React.cloneElement(content, {
                ref: measureRef
              })}
            </EditWidgetChipAnimation>
          )
        }}
      </Measure>
    )

    // Icons
    const iconContainerStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      position: 'absolute',
      zIndex: 5,
      top: 4,
      right: 8
    }
    const expandedIconStyle = {
      cursor: 'pointer',
      hoverColor: appTheme.fontIcon.color,
      color: 'rgba(255,255,255,.3)',
      display: 'inline-block'
    }
    const icons = this.props.open
      ? (
        <div
          key={'icons-expanded'}
          style={iconContainerStyle}
        >
          <DeleteIcon
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={expandedIconStyle}
            onClick={() => {
              this.props.onCancelAddItemClick()
            }}
          />
          <CheckCircleIcon
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={expandedIconStyle}
            onClick={() => {
              this.props.onItemCreatedClick()
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
            onClick={() => {
              this.props.onAddItemClick()
            }}
          />
        </div>
      )

    // Sizing
    const titleHeight = 32
    const iconWidth = 36
    const expandedWidth = 290
    const width = (
      this.props.open
      ? expandedWidth
      : (this.state.dimensions.width
        ? this.state.dimensions.width + iconWidth
        : 'auto'
      )
    )
    const height = this.state.dimensions.height
      ? this.state.dimensions.height
      : 'auto'

    return (
      <span>
        <Paper
          zDepth={0}
          style={{
            width: width,
            height: height,
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'space-between',
            fontSize: 14,
            lineHeight: `${titleHeight}px`,
            transition: `width ${animationDurationMs}ms ease-in-out, height ${animationDurationMs}ms ease-in-out`,
            margin: 5,
            background: appTheme.palette.primary1Color,
            color: '#FFF',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              justifyContent: 'flex-end',
              position: 'absolute',
              zIndex: 3,
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
          {measuredContent}
        </Paper>
      </span>
    )
  }
}

EditWidgetChip.propTypes = {
  open: PropTypes.bool,
  widgetName: PropTypes.string.isRequired,
  // The form to fill when adding a new widget item.
  widgetAddItemForm: PropTypes.element,
  // Called when clicking to add a new item.
  onAddItemClick: PropTypes.func,
  // Called when exiting the form without creating a
  // new iem.
  onCancelAddItemClick: PropTypes.func,
  // Called when confirming creation from the
  // `widgetAddItemForm` view.
  onItemCreatedClick: PropTypes.func
}

EditWidgetChip.defaultProps = {
  open: false,
  onAddItemClick: () => {},
  onCancelAddItemClick: () => {},
  onItemCreatedClick: () => {}
}

export default EditWidgetChip
