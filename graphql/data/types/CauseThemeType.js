export default new GraphQLObjectType({
  name: 'CauseTheming',
  description: 'css properties for a specific cause',
  fields: () => ({
    primaryColor: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the primary color hex value',
    },
    secondaryColor: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the secondary color hex value',
    },
  }),
});