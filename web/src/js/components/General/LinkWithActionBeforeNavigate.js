import React from 'react'
import PropTypes from 'prop-types'
import { goTo } from 'js/navigation/navigation'

// To complete some async function before navigating; e.g.,
// to log the click event.
class LinkWithActionBeforeNavigate extends React.Component {
  async onClick(e) {
    e.preventDefault()
    const { beforeNavigate, to } = this.props
    if (beforeNavigate) {
      await beforeNavigate()
    }
    goTo(to)
  }

  render() {
    const { beforeNavigate, children, to, ...otherProps } = this.props
    return (
      <a href={to} {...otherProps} onClick={this.onClick.bind(this)}>
        {children}
      </a>
    )
  }
}

LinkWithActionBeforeNavigate.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  beforeNavigate: PropTypes.func,
  to: PropTypes.string.isRequired,
}

LinkWithActionBeforeNavigate.defaultProps = {}

export default LinkWithActionBeforeNavigate
