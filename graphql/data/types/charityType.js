export default new GraphQLObjectType({
  name: CHARITY,
  description: 'A charitable charity',
  fields: () => ({
    id: globalIdField(CHARITY),
    name: {
      type: GraphQLString,
      description: 'the charity name',
    },
    category: {
      type: GraphQLString,
      description: 'the charity category',
    },
    website: {
      type: GraphQLString,
      description: 'the charity website',
    },
    description: {
      type: GraphQLString,
      description: 'the charity description',
    },
    impact: {
      type: GraphQLString,
      description: 'the charity impact message',
    },
    logo: {
      type: GraphQLString,
      description: 'the charity logo image URI',
    },
    image: {
      type: GraphQLString,
      description: 'the charity post-donation image URI',
    },
    imageCaption: {
      type: GraphQLString,
      description: 'An optional caption for the post-donation image',
    },
    vcReceived: {
      type: GraphQLInt,
      description:
        'The number of VC the charity has received in a given time period.',
      args: {
        startTime: { type: GraphQLString },
        endTime: { type: GraphQLString },
      },
      resolve: (charity, args, context) =>
        getCharityVcReceived(
          context.user,
          charity.id,
          args.startTime,
          args.endTime
        ),
    },
    impactMetrics: {
      type: new GraphQLList(impactMetricType),
      description: 'Impact Metrics that belong to this Charity',
      resolve: (charity) => getImpactMetricsByCharityId(charity.id),
    },
    longformDescription: {
      type: GraphQLString,
      description: 'the longform charity impact message',
    },
  }),
  interfaces: [nodeInterface],
});