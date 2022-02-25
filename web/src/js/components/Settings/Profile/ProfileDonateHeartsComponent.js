import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { withStyles } from '@material-ui/core/styles'
import Charity from 'js/components/Donate/CharityContainer'
import SwitchToV4 from 'js/components/Donate/SwitchToV4Container'
import Paper from '@material-ui/core/Paper'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import Typography from '@material-ui/core/Typography'
import catImage from 'js/assets/cats.png'
import seasImage from 'js/assets/seas1.svg'
import treesImage from 'js/assets/trees.png'
import blackEquityImage from 'js/assets/blackEquity.png'
import globalHealthImage from 'js/assets/globalHealth.png'
import ukraineImage from 'js/assets/ukraine.png'
import endingHungerImage from 'js/assets/endingHunger.png'
import {
  STORAGE_CATS_CAUSE_ID,
  STORAGE_SEAS_CAUSE_ID,
  STORAGE_BLACK_EQUITY_CAUSE_ID,
  STORAGE_TREES_CAUSE_ID,
  STORAGE_GLOBAL_HEALTH_CAUSE_ID,
  STORAGE_ENDING_HUNGER_CAUSE_ID,
  STORAGE_UKRAINE_CAUSE_ID,
} from 'js/constants'

const SHOW_ENDING_HUNGER = false

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
        <Helmet>
          <title>Donate Hearts</title>
        </Helmet>
        <Paper elevation={1} className={classes.messageContainer}>
          <InfoIcon className={classes.infoIcon} />
          <Typography variant={'body2'} className={classes.messageText}>
            When you donate Hearts, you're telling us to give more of the money
            we raise to that charity.
          </Typography>
        </Paper>
        <span className={classes.charitiesContainer}>
          <SwitchToV4
            user={user}
            title="Support Ukraine (Beta)"
            causeId={STORAGE_UKRAINE_CAUSE_ID}
            causeName="Tab for Ukraine"
            causeShortDesc="Open new tabs, raise money to support Ukrainian families."
            imgSrc={ukraineImage}
          />
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
          <SwitchToV4
            user={user}
            title="Support Global Health (Beta)"
            causeId={STORAGE_GLOBAL_HEALTH_CAUSE_ID}
            causeName="Tab for Global Health"
            causeShortDesc="Open tabs, give quality health care to those who need it most."
            imgSrc={globalHealthImage}
          />
          <SwitchToV4
            user={user}
            title="Fight Climate Change (Beta)"
            causeId={STORAGE_TREES_CAUSE_ID}
            causeName="Tab for Trees"
            causeShortDesc="Open tabs, plant trees!"
            imgSrc={treesImage}
          />
          <SwitchToV4
            user={user}
            title="Support Black Equity (Beta)"
            causeId={STORAGE_BLACK_EQUITY_CAUSE_ID}
            causeName="Tab for Black Equity"
            causeShortDesc="Support Black empowerment and systemic reform."
            imgSrc={blackEquityImage}
          />
          <SwitchToV4
            user={user}
            title="Help Shelter Cats (Beta)"
            causeId={STORAGE_CATS_CAUSE_ID}
            causeName="Tab for Cats"
            causeShortDesc="Turn your tabs into helping shelter cats get adopted!"
            imgSrc={catImage}
          />
          <SwitchToV4
            user={user}
            title="Join #TeamSeas (Beta)"
            causeId={STORAGE_SEAS_CAUSE_ID}
            causeName="Tab for #TeamSeas"
            causeShortDesc="Open tabs, remove trash from our seas!"
            imgSrc={seasImage}
          />
          {SHOW_ENDING_HUNGER && (
            <SwitchToV4
              user={user}
              title="Help End Hunger (Beta)"
              causeId={STORAGE_ENDING_HUNGER_CAUSE_ID}
              causeName="Tab for Ending Hunger"
              causeShortDesc="Help people facing severe hunger."
              imgSrc={endingHungerImage}
            />
          )}
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
