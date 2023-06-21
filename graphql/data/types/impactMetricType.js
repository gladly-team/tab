export default new GraphQLObjectType({
  name: IMPACT_METRIC,
  description: 'An instance of ImpactMetric',
  fields: () => ({
    id: globalIdField(IMPACT_METRIC),
    charity: {
      type: charityType,
      description: 'Charity ID that this impact metric belongs to',
      resolve: (gim, _args, context) =>
        CharityModel.get(context.user, gim.charityId),
    },
    dollarAmount: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'Dollar amount (in micro USDs) required to achieve an instance of this ImpactMetric',
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Markdown description of this ImpactMetric',
    },
    whyValuableDescription: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'Markdown. A shorter version of the description that answers "why this impact matters".',
    },
    metricTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'Metric title. Should be placeable in a sentence. Example: "1 home visit"',
    },
    impactTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'Impact action title. Should be a longer title with a verb as well as a noun. Example: "Provide 1 visit from a community health worker"',
    },
    active: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not this GroupImpactMetric is still active',
    },
    impactCountPerMetric: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'How many instances of the impact are provided per completion of a GroupImpactMetric run.',
    },
  }),
  interfaces: [nodeInterface],
});