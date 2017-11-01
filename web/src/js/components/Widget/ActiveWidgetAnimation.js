import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

class ActiveWidgetAnimation extends React.Component {
  render () {
    return (
      <CSSTransitionGroup
        transitionName='zoom-opacity'
        transitionAppear={false}
        transitionAppearTimeout={300}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}

ActiveWidgetAnimation.propTypes = {
  children: PropTypes.object.isRequired
}

export default ActiveWidgetAnimation
