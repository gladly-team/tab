import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'

class ActiveWidgetAnimation extends React.Component {
  render () {
    const animationDurationMs = 220
    return (
      <CSSTransitionGroup
        transitionName='active-widget'
        transitionAppear={false}
        transitionAppearTimeout={animationDurationMs}
        transitionEnterTimeout={animationDurationMs}
        transitionLeaveTimeout={animationDurationMs}>
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}

export default ActiveWidgetAnimation
