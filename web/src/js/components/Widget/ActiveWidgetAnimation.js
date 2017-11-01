import React from 'react'
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

export default ActiveWidgetAnimation
