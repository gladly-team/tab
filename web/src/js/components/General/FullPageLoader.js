import React from 'react'
import PropTypes from 'prop-types'
import Timeout from 'js/components/General/Timeout'

const FullPageLoader = props => {
  return (
    // TODO: custom UI
    <Timeout ms={props.delay}>
      {timedOut => (timedOut ? <div>Loading...</div> : null)}
    </Timeout>
  )
}

FullPageLoader.propTypes = {
  delay: PropTypes.number.isRequired,
}

export default FullPageLoader
