import React from 'react'
import PropTypes from 'prop-types'
import Timeout from 'js/components/General/Timeout'
import Logo from 'js/components/Logo/Logo'
import Typography from '@material-ui/core/Typography'
import { SEARCH_APP, TAB_APP } from 'js/constants'

const FullPageLoader = props => {
  const { app } = props
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
            <Logo
              brand={app}
              style={{ height: 40, minHeight: 40, minWidth: 40 }}
            />
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
  app: PropTypes.oneOf([TAB_APP, SEARCH_APP]).isRequired,
  delay: PropTypes.number.isRequired,
}

FullPageLoader.defaultProps = {
  app: TAB_APP,
}

export default FullPageLoader
