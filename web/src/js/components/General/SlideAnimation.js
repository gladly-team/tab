import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

class FadeInAnimation extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <CSSTransitionGroup
          transitionName="slide"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
              {this.props.children}
        </CSSTransitionGroup>
    );
  }
}

FadeInAnimation.propTypes = {
  children: PropTypes.object.isRequired,
};

FadeInAnimation.defaultProps = {
}

export default FadeInAnimation;
