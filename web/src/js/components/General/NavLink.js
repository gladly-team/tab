import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

// A link element that knows if it's active. If active,
// it sets an active class and passes an active={true}
// prop to children components.
// Note: this may not be relevant in react-router 4.0+.
// https://stackoverflow.com/q/34418254/1332513
class NavLink extends React.Component {
  render() {
    const isActive = this.context.router.isActive(this.props.to)
    const className = isActive ? 'active' : ''
    return (
      <Link to={this.props.to} className={className} style={this.props.style}>
        {this.props.children}
      </Link>
    )
  }
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  style: PropTypes.object,
}

NavLink.contextTypes = {
  router: PropTypes.object,
}

NavLink.defaultProps = {
  style: {},
}

export default NavLink
