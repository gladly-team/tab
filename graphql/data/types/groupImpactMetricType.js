export default new GraphQLObjectType({
  name: GROUP_IMPACT_METRIC,
  description: 'A specific instance of GroupImpactMetric',
  fields: () => ({
    id: globalIdField(GROUP_IMPACT_METRIC),
    cause: {
      type: CauseType,
      description: 'The cause ID this GroupImpactMetric belongs to',
      resolve: (groupImpactMetric, _args, context) =>
        getCause(context.user, groupImpactMetric.causeId),
    },
    impactMetric: {
      type: impactMetricType,
      description: 'Information about the ImpactMetric',
      resolve: (groupImpactMetric) =>
        getImpactMetricById(groupImpactMetric.impactMetricId),
    },
    dollarProgress: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The micro USD amount raised for this instance of GroupImpactMetric so far',
    },
    dollarGoal: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The micro USD amount raised for this instance of GroupImpactMetric so far',
    },
    dateStarted: {
      type: GraphQLString,
      description:
        'ISO datetime string of when this GroupImpactMetric was started',
    },
    dateCompleted: {
      type: GraphQLString,
      description:
        'ISO datetime string of when this GroupImpactMetric was ended',
    },
    dollarProgressFromTab: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The micro USD amount raised for this instance of GroupImpactMetric so far from tabs',
    },
    dollarProgressFromSearch: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The micro USD amount raised for this instance of GroupImpactMetric so far from search',
    },
  }),
  interfaces: [nodeInterface],
});