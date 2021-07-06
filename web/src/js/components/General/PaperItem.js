import React from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const PaperItem = props => (
  <Paper
    elevation={1}
    style={{
      padding: 24,
      backgroundColor: '#FFF',
    }}
  >
    <span
      style={{
        fontSize: 20,
        fontWeight: 500,
      }}
    >
      {props.title}
    </span>
    <Typography variant={'body2'} style={{ paddingTop: 24, paddingBottom: 24 }}>
      {props.text}
    </Typography>
    <span
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 4,
      }}
    >
      {' '}
      {props.buttonText ? (
        <Button
          data-test-id={'enter-email-form-button'}
          color={'primary'}
          variant={'contained'}
          onClick={props.buttonHandler}
          style={{ minWidth: 96 }}
        >
          {props.buttonText}
        </Button>
      ) : null}
      {props.secondaryButtonText ? (
        <Button
          data-test-id={'enter-email-form-button'}
          color={'primary'}
          variant={'contained'}
          onClick={props.secondaryButtonHandler}
          style={{ marginLeft: 6, minWidth: 96 }}
        >
          {props.secondaryButtonText}
        </Button>
      ) : null}
    </span>
  </Paper>
)

PaperItem.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  buttonHandler: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  secondaryButtonHandler: PropTypes.func,
}

export default PaperItem
