import React from 'react'
import PropTypes from 'prop-types'
import Timeout from 'js/components/General/Timeout'
import Logo from 'js/components/Logo/Logo'
import Typography from '@material-ui/core/Typography'

const FullPageLoader = props => {
  // TODO: show a different logo depending on the "app" prop
  return (
    <Timeout ms={props.delay}>
      {timedOut =>
        timedOut ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              margin: 0,
              padding: '0px 0px 80px 0px',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            <Logo style={{ height: 40, minHeight: 40, minWidth: 40 }} />
            <Typography variant={'h5'} style={{ margin: 10 }}>
              Loading...
            </Typography>
          </div>
        ) : null
      }
    </Timeout>
  )
}

FullPageLoader.propTypes = {
  delay: PropTypes.number.isRequired,
}

export default FullPageLoader
