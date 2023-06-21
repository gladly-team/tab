export default new GraphQLObjectType({
  name: USER_RECRUITS,
  description: 'Info about a user recruited by a referring user',
  fields: () => ({
    // Ideally, we should build the global ID using the composite value of
    // "referringUser" and "userID", which is guaranteed to be unique and can
    // resolve back to one object via the nodeInterface. However, for privacy
    // concerns, we should then also encrypt the userID because we don't want
    // a referrer to know all the IDs of their recruits. For simplicity, we'll
    // just use a compound value of "referringUser" and "recruitedAt", which is
    // almost certainly unique, and just not implement nodeInterface now.
    // https://github.com/graphql/graphql-relay-js/blob/4fdadd3bbf3d5aaf66f1799be3e4eb010c115a4a/src/node/node.js#L138
    id: globalIdField(
      USER_RECRUITS,
      (recruit) => `${recruit.referringUser}::${recruit.recruitedAt}`
    ),
    recruitedAt: {
      type: GraphQLString,
      description: 'ISO datetime string of when the recruited user joined',
    },
  }),
  // We haven't implemented nodeInterface here because a refetch is unlikely. See above.
  // interfaces: [nodeInterface]
});