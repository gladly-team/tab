import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Charity from 'js/components/Donate/CharityContainer'
import Paper from '@material-ui/core/Paper'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import Typography from '@material-ui/core/Typography'

const spacingPx = 6

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '14px 18px',
    marginBottom: 2 * spacingPx,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  messageText: {
    color: theme.palette.action.active,
  },
  infoIcon: {
    marginRight: 8,
    color: theme.palette.action.active,
    minHeight: 24,
    minWidth: 24,
  },
  charitiesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
})

class ProfileDonateHearts extends React.Component {
  render() {
    const { app, classes, user } = this.props
    return (
      <div className={classes.container}>
        <Paper className={classes.messageContainer}>
          <InfoIcon className={classes.infoIcon} />
          <Typography variant={'body2'} className={classes.messageText}>
            When you donate Hearts, you're telling us to give more of the money
            we raise to that charity.
          </Typography>
        </Paper>
        <span className={classes.charitiesContainer}>
          {app.charities.edges.map(edge => {
            return (
              <Charity
                key={edge.node.id}
                charity={edge.node}
                user={user}
                showError={this.props.showError}
                style={{
                  margin: spacingPx,
                }}
              />
            )
          })}
        </span>
      </div>
    )
  }
}

ProfileDonateHearts.propTypes = {
  app: PropTypes.shape({
    charities: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            // Passes field defined in CharityContainer
          }),
        })
      ),
    }).isRequired,
  }).isRequired,
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    // Passes field defined in CharityContainer
  }).isRequired,
  showError: PropTypes.func.isRequired,
}

ProfileDonateHearts.defaultProps = {}

export default withStyles(styles)(ProfileDonateHearts)
