import React from 'react'
import withUser from 'js/components/General/withUser'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import logger from 'js/utils/logger'
import ShopContainer from 'js/components/Shop/ShopContainer'
import { parseUrlSearchString } from 'js/utils/utils'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_REDIRECT_URI } from 'js/constants'
import { goTo } from 'js/navigation/navigation'

const ShopView = ({ authUser }) => {
  // If the user is not logged in, redirect to the shop install landing page.
  if (!authUser) {
    // If a "uri" was passed in the URL, store it in localStorage.
    // After the auth is complete we redirect to this URI.
    // This was first introduced for working with our shop for a cause extension.
    const urlParams = parseUrlSearchString(window.location.search)
    if (typeof urlParams.uri !== 'undefined') {
      localStorageMgr.setItem(STORAGE_REDIRECT_URI, urlParams.uri)
    }
    goTo('/newtab/auth')
    return
  }

  return (
    <QueryRendererWithUser
      query={graphql`
        query ShopViewQuery($userId: String!) {
          user(userId: $userId) {
            ...ShopContainer_user
          }
        }
      `}
      variables={{
        userId: authUser.id,
      }}
      render={({ error, props, retry }) => {
        if (error) {
          logger.error(error)
        }

        const dataLoaded = !!props
        return dataLoaded ? <ShopContainer user={props.user} /> : null
      }}
    />
  )
}

export default withUser()(ShopView)
