import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'

const styles = {
  typography: {
    color: 'white',
  },
}
const MaxHeartsDropdownMessageComponent = props => {
  const { anchorElement, classes } = props
  return (
    <DashboardPopover open={props.open} anchorEl={anchorElement}>
      <div style={{ padding: 10, width: 210, textAlign: 'center' }}>
        <Typography className={classes.typography} variant={'body2'}>
          You've earned the maximum Hearts from opening tabs today! You'll be
          able to earn more Hearts in a few hours.
        </Typography>
      </div>
    </DashboardPopover>
  )
}

MaxHeartsDropdownMessageComponent.displayName =
  'MaxHeartsDropdownMessageComponent'

MaxHeartsDropdownMessageComponent.propTypes = {
  anchorElement: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
}

MaxHeartsDropdownMessageComponent.defaultProps = {
  classes: {},
  open: false,
}

export default withStyles(styles)(MaxHeartsDropdownMessageComponent)
