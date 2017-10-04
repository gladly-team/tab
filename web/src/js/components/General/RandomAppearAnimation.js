import React from 'react'
import PropTypes from 'prop-types'
// import { CSSTransitionGroup } from 'react-transition-group'

class FadeInDashboardAnimation extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      render: true
    }
    this.renderTimer = 0
  }

  // componentWillUnmount () {
  //   clearTimeout(this.renderTimer)
  // }

  // componentWillMount () {
  //   if (this.props.delayRange) {
  //     const delay = Math.floor(Math.random() * this.props.delayRange + 1)
  //     this.renderTimer = setTimeout(() => {
  //       this.setState({
  //         render: true
  //       })
  //     }, delay)
  //   } else {
  //     this.setState({
  //       render: true
  //     })
  //   }
  // }

  render () {
    // if (!this.state.render) {
    //   return (
    //     <span style={{visibility: 'hidden'}}>
    //       {this.props.children}
    //     </span>
    //   )
    // }

    return (
      <span>
        {this.props.children}
      </span>
    )
    // return (
    //   <CSSTransitionGroup
    //     transitionName='zoom-opacity'
    //     transitionAppear
    //     transitionAppearTimeout={300}
    //     transitionEnterTimeout={300}
    //     transitionLeaveTimeout={300}>
    //     {this.props.children}
    //   </CSSTransitionGroup>
    // )
  }
}

FadeInDashboardAnimation.propTypes = {
  children: PropTypes.object.isRequired
}

FadeInDashboardAnimation.defaultProps = {
  delayRange: 300
}

export default FadeInDashboardAnimation
