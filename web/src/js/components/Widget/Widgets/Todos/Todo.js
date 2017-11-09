import React from 'react'
import PropTypes from 'prop-types'

import WidgetPieceWrapper from '../../WidgetPieceWrapper'
import Checkbox from 'material-ui/Checkbox'
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import SvgIcon from 'material-ui/SvgIcon'
import appTheme, {
  dashboardIconActiveColor,
  dashboardIconInactiveColor,
  dashboardTransparentBackground,
  widgetEditButtonInactive,
  widgetEditButtonHover
} from 'theme/default'

class Todo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showDeleteButton: false
    }
    this.hoverTimer = 0
  }

  componentWillUnmount () {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer)
    }
  }

  onMouseHoverChange (isHovering) {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer)
    }
    if (isHovering) {
      this.hoverTimer = setTimeout(() => {
        this.setState({
          showDeleteButton: true
        })
      }, 500)
    } else {
      this.setState({
        showDeleteButton: false
      })
    }
  }

  removeTodo () {
    const { index } = this.props
    this.props.remove(index)
  }

  onCompletedChange () {
    const { index, completed } = this.props
    this.props.onCompletedChange(index, !completed)
  }

  render () {
    const { todo, completed } = this.props

    const styles = {
      container: {
        display: 'flex',
        alignItems: 'center',
        overflowWrap: 'break-word',
        backgroundColor: dashboardTransparentBackground,
        borderRadius: 3,
        margin: '5px 5px',
        paddingLeft: 5
      },
      defaultTodoText: {
        flex: 1,
        fontSize: 14,
        fontFamily: appTheme.fontFamily
      },
      todo: {
        color: '#FFF'
      },
      completed: {
        color: dashboardIconInactiveColor,
        textDecoration: 'line-through'
      }
    }

    const checkedIcon = (
      <CheckCircle
        color='FFF'
        style={{color: '#FFF'}} />)

    const uncheckedIcon = (
      <SvgIcon color={'#FFF'}>
        <svg fill='#FFFFFF' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z' />
          <path d='M0 0h24v24H0z' fill='none' />
        </svg>
      </SvgIcon>
    )

    const todoTextStyle = Object.assign({},
      styles.defaultTodoText,
      completed ? styles.completed : styles.todo
    )

    const otherTransitions = 'fill 0.15s ease-in'
    const deleteIconStyle = {
      cursor: 'pointer',
      margin: '0px 4px',
      opacity: this.state.showDeleteButton ? 1 : 0,
      transition: this.state.showDeleteButton
        ? `opacity 0.2s ease-in 0.5s, ${otherTransitions}`
        : `opacity 0.1s ease-in, ${otherTransitions}`,
      pointerEvents: this.state.showDeleteButton ? 'all' : 'none',
      display: 'inline-block'
    }

    return (
      <WidgetPieceWrapper>
        <div
          style={styles.container}
          onMouseEnter={this.onMouseHoverChange.bind(this, true)}
          onMouseLeave={this.onMouseHoverChange.bind(this, false)}>
          <Checkbox
            style={{
              width: 'auto'
            }}
            onCheck={this.onCompletedChange.bind(this)}
            defaultChecked={completed}
            checkedIcon={checkedIcon}
            uncheckedIcon={uncheckedIcon}
            iconStyle={{
              fill: (
                completed
                ? dashboardIconInactiveColor
                : dashboardIconActiveColor
              ),
              marginRight: 10
            }}
          />
          <p
            style={todoTextStyle}>
            {todo.text}
          </p>
          <DeleteIcon
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={deleteIconStyle}
            onClick={this.removeTodo.bind(this)} />
        </div>
      </WidgetPieceWrapper>
    )
  }
}

Todo.propTypes = {
  todo: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  completed: PropTypes.bool,
  remove: PropTypes.func,
  onCompletedChange: PropTypes.func
}

Todo.defaultProps = {
  completed: false,
  remove: (index) => {},
  onCompletedChange: (index, completed) => {}
}

export default Todo
