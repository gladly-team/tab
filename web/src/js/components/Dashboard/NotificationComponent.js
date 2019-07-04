import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'
import { setNotificationDismissTime } from 'js/utils/local-user-data-mgr'

class Notification extends React.Component {
  render() {
    const {
      style,
      title,
      message,
      buttonText,
      buttonURL,
      onClick,
      onDismiss,
      useGlobalDismissalTime,
    } = this.props
    return (
      <div style={Object.assign({ width: 340 }, style)}>
        <Paper
          style={{
            padding: '6px 14px',
          }}
        >
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              style={{
                fontWeight: 'bold',
                marginBottom: 8,
                marginTop: 8,
              }}
              variant={'body2'}
            >
              {title}
            </Typography>
            {typeof message === 'string' ? (
              <Typography
                data-test-id={'notification-message'}
                variant={'body2'}
              >
                {message}
              </Typography>
            ) : (
              <div data-test-id={'notification-message'}>{message}</div>
            )}
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-end',
                marginTop: 10,
              }}
            >
              <Button
                color={'default'}
                onClick={() => {
                  // If useGlobalDismissalTime is true, dismissing this notification
                  // will hide future global notifications for ~10 days.
                  if (useGlobalDismissalTime) {
                    setNotificationDismissTime()
                  }
                  if (onDismiss) {
                    onDismiss()
                  }
                }}
              >
                Dismiss
              </Button>
              {buttonText && buttonURL ? (
                <Link
                  to={buttonURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <Button color={'primary'}>{buttonText}</Button>
                </Link>
              ) : buttonText && onClick ? (
                <Button onClick={onClick} color={'primary'}>
                  {buttonText}
                </Button>
              ) : null}
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
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  buttonText: PropTypes.string,
  buttonURL: PropTypes.string,
  onDismiss: PropTypes.func,
  onClick: PropTypes.func,
  useGlobalDismissalTime: PropTypes.bool.isRequired,
}

Notification.defaultProps = {
  style: {},
  onDismiss: () => {},
  useGlobalDismissalTime: false,
}

export default Notification
