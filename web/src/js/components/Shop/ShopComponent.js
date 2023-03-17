import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { goTo } from 'js/navigation/navigation'
import SwitchToV4 from 'js/components/Donate/SwitchToV4Container'
import catImage from 'js/assets/cats.png'
import seasImage from 'js/assets/seas1.svg'
import treesImage from 'js/assets/trees.png'
import blackEquityImage from 'js/assets/blackEquity.png'
import globalHealthImage from 'js/assets/globalHealth.png'
import ukraineImage from 'js/assets/ukraine.png'
import endingHungerImage from 'js/assets/endingHunger.png'
import reproductiveHealthImage from 'js/assets/reproductiveHealth.png'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_REDIRECT_URI } from 'js/constants'
import {
  STORAGE_CATS_CAUSE_ID,
  STORAGE_SEAS_CAUSE_ID,
  STORAGE_BLACK_EQUITY_CAUSE_ID,
  STORAGE_TREES_CAUSE_ID,
  STORAGE_GLOBAL_HEALTH_CAUSE_ID,
  STORAGE_ENDING_HUNGER_CAUSE_ID,
  STORAGE_UKRAINE_CAUSE_ID,
  STORAGE_REPRODUCTIVE_HEALTH_CAUSE_ID,
} from 'js/constants'

const spacingPx = 6

const styles = theme => ({
  container: {
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginLeft: '85px',
  },
  messageText: {
    color: theme.palette.action.active,
  },
  charitiesContainer: {
    padding: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  messageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    marginTop: '20px',
    marginBottom: 2 * spacingPx,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const ShopComponent = ({ user, classes }) => {
  // See if we have a cause id. If we have no cause id then
  // we need to redirect to a cause select page.
  if (user.causeId !== '' && user.causeId !== 'no-cause') {
    // If auth.redirect.uri in localStorage is set, use that as the url we redirect to.
    const uri = localStorageMgr.getItem(STORAGE_REDIRECT_URI)
    if (uri) {
      localStorageMgr.removeItem(STORAGE_REDIRECT_URI)
      goTo(uri + (user.userId ? `?uuid=${user.userId}` : ''))
      return null
    } else {
      goTo('/newtab')
      return null
    }
  }

  return (
    <div className={classes.container}>
      <Paper elevation={1} className={classes.messageContainer}>
        <Typography variant={'h5'} className={classes.messageText}>
          Which cause would you like to support?
        </Typography>
      </Paper>

      <div className={classes.charitiesContainer}>
        <SwitchToV4
          user={user}
          prefix=""
          redirect={window.location.href}
          title="Support Reproductive Health"
          causeId={STORAGE_REPRODUCTIVE_HEALTH_CAUSE_ID}
          causeName="Shop for Reproductive Health"
          causeShortDesc="Protect and provide access to reproductive health care."
          imgSrc={reproductiveHealthImage}
        />
        <SwitchToV4
          user={user}
          prefix=""
          redirect={window.location.href}
          title="Support Ukraine (Beta)"
          causeId={STORAGE_UKRAINE_CAUSE_ID}
          causeName="Shop for Ukraine"
          causeShortDesc="Open new tabs, raise money to support Ukrainian families."
          imgSrc={ukraineImage}
        />
        <SwitchToV4
          user={user}
          prefix=""
          redirect={window.location.href}
          title="Support Global Health (Beta)"
          causeId={STORAGE_GLOBAL_HEALTH_CAUSE_ID}
          causeName="Shop for Global Health"
          causeShortDesc="Open tabs, give quality health care to those who need it most."
          imgSrc={globalHealthImage}
        />
        <SwitchToV4
          user={user}
          prefix=""
          redirect={window.location.href}
          title="Fight Climate Change (Beta)"
          causeId={STORAGE_TREES_CAUSE_ID}
          causeName="Shop for Trees"
          causeShortDesc="Open tabs, plant trees!"
          imgSrc={treesImage}
        />
        <SwitchToV4
          user={user}
          prefix=""
          redirect={window.location.href}
          title="Support Black Equity (Beta)"
          causeId={STORAGE_BLACK_EQUITY_CAUSE_ID}
          causeName="Shop for Black Equity"
          causeShortDesc="Support Black empowerment and systemic reform."
          imgSrc={blackEquityImage}
        />
        <SwitchToV4
          user={user}
          prefix=""
          redirect={window.location.href}
          title="Help Shelter Cats (Beta)"
          causeId={STORAGE_CATS_CAUSE_ID}
          causeName="Shop for Cats"
          causeShortDesc="Turn your tabs into helping shelter cats get adopted!"
          imgSrc={catImage}
        />
        <SwitchToV4
          user={user}
          prefix=""
          redirect={window.location.href}
          title="Join #TeamSeas (Beta)"
          causeId={STORAGE_SEAS_CAUSE_ID}
          causeName="Shop for #TeamSeas"
          causeShortDesc="Open tabs, remove trash from our seas!"
          imgSrc={seasImage}
        />
        <SwitchToV4
          user={user}
          prefix=""
          redirect={window.location.href}
          title="Help End Hunger (Beta)"
          causeId={STORAGE_ENDING_HUNGER_CAUSE_ID}
          causeName="Shop for Ending Hunger"
          causeShortDesc="Help people facing severe hunger."
          imgSrc={endingHungerImage}
        />
      </div>
    </div>
  )
}

export default withStyles(styles)(ShopComponent)
