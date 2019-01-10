import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

class Notification extends React.Component {
  render () {
    const { style, title, message, buttonText, buttonAction } = this.props
    return (
      <div style={Object.assign({}, style, {
        width: 270
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
              variant={'h6'}
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
                style={{
                  // margin: 10
                }}
                onClick={() => {
                  // TODO: dismiss
                }}
              >
                Dismiss
              </Button>
              {
                (buttonText && buttonAction)
                  ? (
                    <Button
                      color={'primary'}
                      style={{
                        // margin: 10
                      }}
                      onClick={() => {
                        // TODO: do button action
                      }}
                    >
                      {buttonText}
                    </Button>
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
  buttonAction: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ])
}

Notification.default = {
  style: {}
}

export default Notification
