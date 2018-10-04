import React from 'react'
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group'

class ActiveWidgetAnimation extends React.Component {
  render () {
    const animationDurationMs = 220
    return (
      <TransitionGroup>
        {
          React.Children.map(this.props.children, (item, i) => {
            return item
              ? (
                <CSSTransition
                  key={i}
                  classNames='active-widget'
                  appear={false}
                  timeout={{
                    enter: animationDurationMs,
                    exit: animationDurationMs
                  }}>
                  {item}
                </CSSTransition>
              )
              : null
          })
        }
      </TransitionGroup>
    )
  }
}

export default ActiveWidgetAnimation
