export default new GraphQLObjectType({
  name: SEARCH_ENGINE,
  description: 'all important data for a search engine.',
  fields: () => ({
    ...searchEngineSharedFields,
    id: globalIdField(SEARCH_ENGINE),
    searchUrl: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'A search destination URL, with a {searchTerms} placeholder for the client to replace. Use `user.searchEngine` if the user is authenticated.',
    },
  }),
  interfaces: [nodeInterface],
});