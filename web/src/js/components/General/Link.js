import React from 'react'
import PropTypes from 'prop-types'
import { Link as LinkReactRouter } from 'react-router-dom'
import { isURLForDifferentApp, isAbsoluteURL } from 'js/navigation/utils'

// To handle both internal and external links.
class Link extends React.Component {
  render() {
    const { children, to, style, className, ...otherProps } = this.props

    // If it's a link to another SPA or an absolute URL, treat
    // the link as external.
    const internal = !isURLForDifferentApp(to) && !isAbsoluteURL(to)
    const finalStyle = Object.assign({}, style, {
      textDecoration: 'none',
    })

    // Use gatsby-link for internal links, and <a> for others
    if (internal) {
      return (
        <LinkReactRouter
          to={to}
          style={finalStyle}
          className={className}
          {...otherProps}
        >
          {children}
        </LinkReactRouter>
      )
    }
    return (
      <a href={to} style={finalStyle} className={className} {...otherProps}>
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
