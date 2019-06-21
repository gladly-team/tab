import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CalculatorIcon from 'mdi-material-ui/Calculator'

const styles = () => ({
  container: {
    padding: 20,
    marginBottom: 26,
    display: 'flex',
    justifyContent: 'space-between',
  },
  calculatorIcon: {
    color: 'rgba(0, 0, 0, 0.46)',
  },
})

const ComputationSearchResult = props => {
  const {
    classes,
    item: { expression, value },
  } = props

  // If any required props are missing, don't render anything.
  if (!(expression && value)) {
    return null
  }
  return (
    <Paper className={classes.container} elevation={1}>
      <div>
        <Typography
          variant={'body2'}
          data-test-id={'search-result-computation-expression'}
          gutterBottom
        >
          {expression} =
        </Typography>
        <Typography
          variant={'h4'}
          data-test-id={'search-result-computation-value'}
        >
          {value}
        </Typography>
      </div>
      <CalculatorIcon className={classes.calculatorIcon} />
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
