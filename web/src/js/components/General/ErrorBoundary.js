import React from 'react'
import PropTypes from 'prop-types'
import logger from 'js/utils/logger'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Logo from 'js/components/Logo/Logo'
import { externalContactUsURL } from 'js/navigation/navigation'
import { externalRedirect } from 'js/navigation/utils'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    logger.error(error)
  }

  render() {
    const { brand, ignoreErrors } = this.props
    if (this.state.hasError) {
      if (ignoreErrors) {
        return null
      }
      return (
        <div
          style={{
            margin: 0,
            padding: 0,
            height: '100vh',
          }}
        >
          <div
            style={{
              padding: '20px 40px',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <Logo brand={brand} includeText style={{ height: 40 }} />
          </div>
          <div
            style={{
              height: '100vh',
              display: 'flex',
              padding: '0px 0px 80px 0px',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                maxWidth: 400,
              }}
            >
              <Typography variant={'h6'} style={{ margin: 10 }}>
                Oops!
              </Typography>
              <Typography variant={'body1'} style={{ margin: 10 }}>
                There was an error on the page. Please try reloading, or contact
                us if the problem continues.
              </Typography>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 20,
                }}
              >
                <Button
                  color={'default'}
                  style={{ margin: 10 }}
                  onClick={() => {
                    externalRedirect(externalContactUsURL)
                  }}
                >
                  Contact us
                </Button>
                <Button
                  color={'primary'}
                  variant={'contained'}
                  style={{ margin: 10 }}
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  Reload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  brand: PropTypes.oneOf(['tab', 'search']),
  ignoreErrors: PropTypes.bool,
}

ErrorBoundary.defaultProps = {
  brand: 'tab',
  ignoreErrors: false,
}

export default ErrorBoundary
