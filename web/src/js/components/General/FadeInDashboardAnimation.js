import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

class FadeInDashboardAnimation extends React.Component {
  render () {
    return (
      <CSSTransitionGroup
        transitionName='fade-dashboard'
        transitionAppear
        transitionAppearTimeout={600}
        transitionEnterTimeout={600}
        transitionLeaveTimeout={600}>
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}

FadeInDashboardAnimation.propTypes = {
  children: PropTypes.object.isRequired
}

export default FadeInDashboardAnimation
