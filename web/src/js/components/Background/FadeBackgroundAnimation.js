import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

class FadeBackgroundAnimation extends React.Component {
  render () {
    return (
      <CSSTransitionGroup
        transitionName='fade-background'
        transitionAppear
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={3500}>
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}

FadeBackgroundAnimation.propTypes = {
  children: PropTypes.element
}

FadeBackgroundAnimation.defaultProps = {
}

export default FadeBackgroundAnimation
