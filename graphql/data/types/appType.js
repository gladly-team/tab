export default new GraphQLObjectType({
  name: 'App',
  description: 'Global app fields',
  fields: () => ({
    id: globalIdField('App'),
    moneyRaised: {
      type: GraphQLFloat,
      resolve: () => getMoneyRaised(),
    },
    dollarsPerDayRate: {
      type: GraphQLFloat,
      resolve: () => getDollarsPerDayRate(),
    },
    referralVcReward: {
      type: GraphQLInt,
      resolve: () => getReferralVcReward(),
    },
    widgets: {
      type: widgetConnection,
      description: 'All the widgets',
      args: connectionArgs,
      resolve: (_, args, context) =>
        connectionFromPromisedArray(getAllBaseWidgets(context.user), args),
    },
    charity: {
      type: charityType,
      description: 'One of the charities',
      args: {
        charityId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { charityId }, context) =>
        CharityModel.get(context.user, charityId),
    },
    charities: {
      type: charityConnection,
      description: 'All the charities',
      args: {
        ...connectionArgs,
        filters: {
          type: new GraphQLInputObjectType({
            name: 'CharitiesFilters',
            description: 'Fields on which to filter the list of charities.',
            fields: {
              isPermanentPartner: { type: GraphQLBoolean },
            },
          }),
        },
      },
      resolve: (_, args, context) => {
        const { filters } = args
        return connectionFromPromisedArray(
          getCharities(context.user, filters),
          args
        )
      },
    },
    causes: {
      type: causeConnection,
      description: 'All the causes',
      args: {
        ...connectionArgs,
        filters: {
          type: new GraphQLInputObjectType({
            name: 'CausesFilters',
            description: 'Fields on which to filter the list of causes.',
            fields: {
              isAvailableToSelect: { type: GraphQLBoolean },
            },
          }),
        },
      },
      resolve: (_, args, context) => {
        const { filters } = args
        return connectionFromPromisedArray(
          getCauses(context.user, filters),
          args
        )
      },
    },
    backgroundImages: {
      type: backgroundImageConnection,
      description: 'Get all the "legacy" (uncategorized) background Images',
      args: connectionArgs,
      resolve: (_, args, context) =>
        connectionFromPromisedArray(getBackgroundImages(context.user), args),
    },
    campaign: {
      type: campaignType,
      description: 'Campaigns (or "charity spotlights") shown to users.',
      resolve: (_, args, context) => getCampaign(context.user),
    },
    searchEngines: {
      type: searchEngineConnection,
      description: 'All the search engines',
      resolve: (_, args) => connectionFromArray(searchEngines, args),
    },
  }),
  interfaces: [nodeInterface],
});