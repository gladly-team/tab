import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = () => ({
  container: {
    // fontFamily: 'arial, sans-serif',
    // marginBottom: 26,
  },
})

const ComputationSearchResult = props => {
  const {
    classes,
    item: { expression, value },
  } = props
  // console.log('ComputationSearchResult props', props)

  // If any required props are missing, don't render anything.
  if (!(expression && value)) {
    return null
  }
  return (
    <Paper className={classes.container}>
      <Typography
        variant={'h5'}
        data-test-id={'search-result-computation-text'}
      >
        {expression} = {value}
      </Typography>
    </Paper>
  )
}

ComputationSearchResult.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    expression: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
}

ComputationSearchResult.defaultProps = {}

export default withStyles(styles)(ComputationSearchResult)
