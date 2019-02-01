import React from 'react'
import PropTypes from 'prop-types'

class Timeout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timedOut: false,
    }
    this.timer = null
  }

  componentDidMount() {
    const { ms } = this.props
    this.timer = setTimeout(() => {
      this.setState({
        timedOut: true,
      })
    }, ms)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  render() {
    const { children } = this.props
    const { timedOut } = this.state
    return children(timedOut)
  }
}

Timeout.propTypes = {
  children: PropTypes.func.isRequired,
  ms: PropTypes.number.isRequired,
}

export default Timeout
