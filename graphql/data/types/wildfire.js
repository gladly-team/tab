import { GraphQLObjectType, GraphQLString } from 'graphql'
import { WILDFIRE } from '../../database/constants'

// Wildfire is our partner for the shop for a cause browser extension.
// They need to make API calls to our GraphQL server that do not use
// our authentication system. We put a "wildfire" object in the root
// of our GraphQL schema that they can use to make these calls.
// For the most part we are just returning a cause object but only
// including the fields that are used by Wildfire.
// https://www.wildfire-corp.com
const wildfireType = new GraphQLObjectType({
  name: WILDFIRE,
  description: 'The Wildfire object',
  fields: () => ({
    causeName: {
      type: GraphQLString,
      resolve: (cause) => cause.nameForShop,
    },
  }),
})

export default wildfireType
