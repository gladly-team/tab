import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

class FadeInAnimation extends React.Component {
  render() {
    return (
      <TransitionGroup>
        {React.Children.map(this.props.children, (item, i) => {
          return item ? (
            <CSSTransition
              key={i}
              classNames="fade"
              appear
              timeout={{
                enter: 300,
                exit: 300,
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

FadeInAnimation.propTypes = {
  children: PropTypes.object.isRequired,
}

export default FadeInAnimation
