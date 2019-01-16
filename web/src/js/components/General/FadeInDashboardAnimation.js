import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

class FadeInDashboardAnimation extends React.Component {
  render() {
    return (
      <TransitionGroup>
        {React.Children.map(this.props.children, (item, i) => {
          return item ? (
            <CSSTransition
              key={i}
              classNames="fade-dashboard"
              appear={this.props.transitionAppear}
              timeout={{
                enter: 800,
                exit: 800,
              }}
            >
              {item}
            </CSSTransition>
          ) : null
        })}
      </TransitionGroup>
    )
  }
}

FadeInDashboardAnimation.propTypes = {
  children: PropTypes.element,
  transitionAppear: PropTypes.bool,
}

FadeInDashboardAnimation.defaultProps = {
  transitionAppear: true,
}

export default FadeInDashboardAnimation
