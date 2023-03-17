import React from 'react'
import withUser from 'js/components/General/withUser'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import logger from 'js/utils/logger'
import ShopContainer from 'js/components/Shop/ShopContainer'

const ShopView = ({ authUser }) => {
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
