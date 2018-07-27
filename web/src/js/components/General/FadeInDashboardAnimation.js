import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

class FadeInDashboardAnimation extends React.Component {
  render () {
    return (
      <CSSTransitionGroup
        transitionName='fade-dashboard'
        transitionAppear={this.props.transitionAppear}
        transitionAppearTimeout={800}
        transitionEnterTimeout={800}
        transitionLeaveTimeout={800}>
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}

FadeInDashboardAnimation.propTypes = {
  children: PropTypes.element,
  transitionAppear: PropTypes.bool
}

FadeInDashboardAnimation.defaultProps = {
  transitionAppear: true
}

export default FadeInDashboardAnimation
