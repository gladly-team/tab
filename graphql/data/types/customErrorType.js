export default new GraphQLObjectType({
  name: 'CustomError',
  description: 'For expected errors, such as during form validation',
  fields: () => ({
    code: {
      type: GraphQLString,
      description: 'The error code',
    },
    message: {
      type: GraphQLString,
      description: 'The error message',
    },
  }),
});