export default new GraphQLObjectType({
  name: FEATURE,
  description: 'Feature name and variation value pair applicable to a user.',
  fields: () => ({
    featureName: {
      type: new GraphQLNonNull(GraphQLString),
      description: `Name of the Feature`,
    },
    variation: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the value of the variation for this specific user',
    },
  }),
});