export default new GraphQLObjectType({
  name: VIDEO_AD_LOG,
  description: 'Video Ad Log type',
  fields: () => ({
    id: globalIdField(VIDEO_AD_LOG),
  }),
  interfaces: [nodeInterface],
});