export default new GraphQLObjectType({
  name: SEARCH_ENGINE_PERSONALIZED,
  description:
    'SearchEngineType extended with fields potentially personalized to the user',
  fields: () => ({
    ...searchEngineSharedFields,
    searchUrlPersonalized: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        "Use this for the user's search behavior. A search destination URL, with a {searchTerms} placeholder for the client to replace. The URL might be personalized based on the user.",
    },
    id: globalIdField(SEARCH_ENGINE_PERSONALIZED),
  }),
  interfaces: [nodeInterface],
});