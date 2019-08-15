import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    paddingTop: 50,
    paddingBottom: 50,
    minWidth: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mainContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stat: {
    textAlign: 'center',
    marginBottom: 6,
  },
  statText: {
    textAlign: 'center',
    maxWidth: '70%',
  },
  extraContent: {
    display: 'block',
    marginTop: 4,
    minHeight: 16,
    alignSelf: 'center',
    textAlign: 'center',
  },
})

const Stat = props => {
  const { classes, extraContent, stat, statText, style } = props
  return (
    <Paper
      className={classes.root}
      style={{
        ...style,
      }}
    >
      <span className={classes.mainContentContainer}>
        <Typography variant={'h2'} color={'secondary'} className={classes.stat}>
          {stat}
        </Typography>
        <Typography variant={'body2'} className={classes.statText}>
          {statText}
        </Typography>
      </span>
      <span className={classes.extraContent}>{extraContent}</span>
    </Paper>
  )
}

Stat.propTypes = {
  classes: PropTypes.object.isRequired,
  stat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  statText: PropTypes.string.isRequired,
  extraContent: PropTypes.element,
  style: PropTypes.object,
}

Stat.default = {
  style: {},
}

export default withStyles(styles)(Stat)
