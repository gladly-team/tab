import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'

class Notification extends React.Component {
  render () {
    const { style, title, message, buttonText, buttonURL } = this.props
    return (
      <div style={Object.assign({}, style, {
        width: 340
      })}>
        <Paper
          style={{
            padding: '6px 14px'
          }}
        >
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <Typography
              style={{
                fontWeight: 'bold',
                marginBottom: 8,
                marginTop: 8
              }}
              variant={'body2'}
            >
              {title}
            </Typography>
            <Typography
              variant={'body2'}
            >
              {message}
            </Typography>
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-end',
                marginTop: 10
              }}
            >
              <Button
                color={'default'}
                onClick={() => {
                  // TODO: dismiss
                }}
              >
                Dismiss
              </Button>
              {
                (buttonText && buttonURL)
                  ? (
                    <Link
                      to={buttonURL}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{
                        textDecoration: 'none'
                      }}
                    >
                      <Button
                        color={'primary'}
                      >
                        {buttonText}
                      </Button>
                    </Link>
                  )
                  : null
              }
            </div>
          </span>
        </Paper>
      </div>
    )
  }
}

Notification.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  buttonURL: PropTypes.string
}

Notification.default = {
  style: {}
}

export default Notification
