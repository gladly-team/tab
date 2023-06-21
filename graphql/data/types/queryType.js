export default new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    app: {
      type: appType,
      resolve: () => App.getApp(1),
    },
    user: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args, context) => UserModel.get(context.user, args.userId),
    },
    wildfire: {
      type: wildfireType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => getCauseForWildfire(args.userId),
    },
    userImpact: {
      type: userImpactType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        charityId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args, context) => {
        const { userId, charityId } = args
        return (
          await UserImpactModel.getOrCreate(context.user, {
            userId,
            charityId,
          })
        ).item
      },
    },
  }),
});