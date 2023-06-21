export default new GraphQLObjectType({
  name: 'ExperimentActionsOutput',
  description: 'The actions a user has taken in an experiment',
  fields: () => experimentActionsFields,
});