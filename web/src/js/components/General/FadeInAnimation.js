import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

class FadeInAnimation extends React.Component {
  render () {
    return (
      <CSSTransitionGroup
        transitionName='fade'
        transitionAppear
        transitionAppearTimeout={300}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}

FadeInAnimation.propTypes = {
  children: PropTypes.object.isRequired
}

FadeInAnimation.defaultProps = {
}

export default FadeInAnimation
