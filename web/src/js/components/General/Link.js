import React from 'react'
import PropTypes from 'prop-types'
import { Link as LinkReactRouter } from 'react-router-dom'

// To handle both internal and external links.
class Link extends React.Component {
  render() {
    const { children, to, style, className, ...otherProps } = this.props

    // This assumes that any internal link (intended for Gatsby) starts
    // with exactly one slash, and that anything else is external.
    const internal = /^\/(?!\/)/.test(to)

    // Use gatsby-link for internal links, and <a> for others
    if (internal) {
      return (
        <LinkReactRouter to={to} style={style} className={className}>
          {children}
        </LinkReactRouter>
      )
    }
    return (
      <a href={to} style={style} className={className} {...otherProps}>
        {children}
      </a>
    )
  }
}

Link.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  style: PropTypes.object,
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
}

Link.defaultProps = {
  style: {},
  className: '',
}

export default Link
