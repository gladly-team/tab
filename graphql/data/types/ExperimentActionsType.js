export default new GraphQLInputObjectType({
  name: 'ExperimentActions',
  description: 'The actions a user may take in an experiment',
  fields: experimentActionsFields,
});