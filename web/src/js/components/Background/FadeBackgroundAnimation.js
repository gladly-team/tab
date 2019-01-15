import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

class FadeBackgroundAnimation extends React.Component {
  render() {
    return (
      <TransitionGroup>
        {React.Children.map(this.props.children, (item, i) => (
          <CSSTransition
            key={i}
            classNames="fade-background"
            appear
            timeout={{
              enter: 500,
              exit: 2200,
            }}
          >
            {item}
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }
}

FadeBackgroundAnimation.propTypes = {
  children: PropTypes.element,
}

FadeBackgroundAnimation.defaultProps = {}

export default FadeBackgroundAnimation
