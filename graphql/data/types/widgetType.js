export default new GraphQLObjectType({
  name: WIDGET,
  description: 'App widget',
  fields: () => ({
    id: globalIdField(WIDGET),
    name: {
      type: GraphQLString,
      description: 'Widget display name',
    },
    type: {
      type: GraphQLString,
      description: 'Widget type',
    },
    icon: {
      type: GraphQLString,
      description: 'Widget icon',
    },
    enabled: {
      type: GraphQLBoolean,
      description: 'The Widget enabled state',
    },
    visible: {
      type: GraphQLBoolean,
      description: 'The Widget visible state',
    },
    data: {
      type: GraphQLString,
      description: 'Widget data.',
    },
    config: {
      type: GraphQLString,
      description: 'Widget user specific configuration.',
    },
    settings: {
      type: GraphQLString,
      description: 'Widget general configuration.',
    },
  }),
  interfaces: [nodeInterface],
});