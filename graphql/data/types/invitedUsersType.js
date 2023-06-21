export default new GraphQLObjectType({
  name: INVITED_USERS,
  description: `a record of a user email inviting someone`,
  fields: () => ({
    id: globalIdField(
      INVITED_USERS,
      (invitedUsers) =>
        `${invitedUsers.inviterId}::${invitedUsers.invitedEmail}`
    ),
    inviterId: { type: new GraphQLNonNull(GraphQLString) },
    invitedEmail: { type: new GraphQLNonNull(GraphQLString) },
    invitedId: {
      type: GraphQLString,
      description: 'invited users id once user has successfully signed up',
    },
  }),
});