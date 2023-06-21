export default new GraphQLObjectType({
  name: USER_GROUP_IMPACT_METRIC,
  description: 'A specific users contribution to a GroupImpactMetric',
  fields: () => ({
    groupImpactMetric: {
      type: groupImpactMetricType,
      description: 'Information about the GroupImpactMetric',
      resolve: (userGroupImpactMetric, _, context) =>
        GroupImpactMetricModel.get(
          context,
          userGroupImpactMetric.groupImpactMetricId
        ),
    },
    id: globalIdField(USER_GROUP_IMPACT_METRIC),
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The ID of the user which the UserGroupImpactMetric belongs to',
    },
    dollarContribution: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The micro USD amount raised for this instance of GroupImpactMetric so far by this user',
    },
    tabDollarContribution: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The micro USD amount raised for this instance of GroupImpactMetric so far by this user from tabs',
    },
    searchDollarContribution: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The micro USD amount raised for this instance of GroupImpactMetric so far by this user from search',
    },
    shopDollarContribution: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The micro USD amount raised for this instance of GroupImpactMetric so far by this user from shopping',
    },
  }),
  interfaces: [nodeInterface],
});