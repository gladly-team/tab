import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'

class EditWidgetChipAnimation extends React.Component {
  render () {
    return (
      <CSSTransitionGroup
        transitionName='edit-widget-chip'
        transitionAppear={false}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={100}
      >
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}

export default EditWidgetChipAnimation
