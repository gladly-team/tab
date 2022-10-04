import React from 'react'
import clsx from 'clsx'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

const Notification = ({
  buttonOnClick,
  className,
  text,
  buttonText,
  includeButton,
  includeSecondaryButton,
  secondaryButtonText,
  secondaryButtonOnClick,
  open,
  onClose,
  includeClose,
  buttons,
  style,
  buttonsClassName,
}) => {
  const classes = {
    root: {
      position: 'relative',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    buttons: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
    },
    buttonsProvided: {
      flexDirection: 'row',
      width: '100%',
    },
    secondaryButton: {
      marginRight: '8px',
    },
  }

  return open ? (
    <Paper className={clsx(classes.root, className)} style={style}>
      {includeClose && (
        <IconButton
          onClick={onClose}
          style={{ position: 'absolute', right: '0px', top: '0px' }}
        >
          <CloseIcon />
        </IconButton>
      )}
      {text}
      {buttons ? (
        <div className={clsx(classes.buttonsProvided, buttonsClassName)}>
          {buttons}
        </div>
      ) : (
        <div className={classes.buttons}>
          {includeSecondaryButton ? (
            <Button
              className={classes.secondaryButton}
              size="small"
              variant="outlined"
              color="primary"
              onClick={secondaryButtonOnClick}
            >
              {secondaryButtonText}
            </Button>
          ) : null}
          {includeButton ? (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={buttonOnClick}
            >
              {buttonText}
            </Button>
          ) : null}
        </div>
      )}
    </Paper>
  ) : null
}

Notification.displayName = 'Notification'
Notification.propTypes = {
  /**
   * Deprecated, use "buttons" instead.
   * Callback function that fires when user clicks main CTA button
   */
  buttonOnClick: PropTypes.func,

  /**
   * Class name applied to the root element.
   */
  className: PropTypes.string,

  /**
   * HTML element centered in middle of notification responsible for body of
   * notification text.
   */
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

  /**
   * Deprecated, use "buttons" instead.
   * the label on main button
   */
  buttonText: PropTypes.string,

  /**
   * Deprecated, use "buttons" instead.
   * manually remove having any cta button
   */
  includeButton: PropTypes.bool,

  /**
   * Deprecated, use "buttons" instead.
   * second button left of main cta that uses secondary color
   */
  includeSecondaryButton: PropTypes.bool,

  /**
   * Deprecated, use "buttons" instead.
   * secondary button label
   */
  secondaryButtonText: PropTypes.string,

  /**
   * Deprecated, use "buttons" instead.
   * Callback function that fires when user clicks secondary button
   */
  secondaryButtonOnClick: PropTypes.func,

  /**
   * Buttons provided by client. Overrides button and secondaryButton
   */
  buttons: PropTypes.element,

  /**
   boolean that literally shows or hides notification.  State of notification being opened is primarily controlled by parent component but can be used in some cases
   */
  open: PropTypes.bool,

  /**
    including this adds a close button to the top right that invokes the onClose callback when clicked
  */
  includeClose: PropTypes.bool,

  /**
    the onClose callback invoked when close button is clicked
  */
  onClose: PropTypes.func,

  /**
   * Style applied to the root element.
   */
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,

  /**
   * Class name applied to the buttons.
   */
  buttonsClassName: PropTypes.string,
}
Notification.defaultProps = {
  buttonText: '', // deprecated, use "buttons"
  buttonOnClick: () => {}, // deprecated, use "buttons"
  buttons: null,
  className: '',
  includeButton: true, // deprecated, use "buttons"
  includeClose: false,
  includeSecondaryButton: false, // deprecated, use "buttons"
  secondaryButtonText: '', // deprecated, use "buttons"
  secondaryButtonOnClick: () => {}, // deprecated, use "buttons"
  onClose: () => {},
  open: true,
  style: {},
  buttonsClassName: '',
}

export default Notification
