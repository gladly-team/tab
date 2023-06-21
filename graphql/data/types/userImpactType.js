export default new GraphQLObjectType({
  name: USER_IMPACT,
  description: `a user's charity specific impact`,
  fields: () => ({
    id: globalIdField(
      USER_IMPACT,
      (userImpact) => `${userImpact.userId}::${userImpact.charityId}`
    ),
    userId: { type: new GraphQLNonNull(GraphQLString) },
    charityId: { type: new GraphQLNonNull(GraphQLString) },
    userImpactMetric: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'a users impact for a specific charity',
    },
    pendingUserReferralImpact: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'a users pending impact based on referrals',
    },
    pendingUserReferralCount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'pending user referral count',
    },
    visitsUntilNextImpact: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'visits remaining until next recorded impact',
    },
    confirmedImpact: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'enables a user to start accruing impact',
    },
    hasClaimedLatestReward: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'flag that indicates if user has celebrated latest impact',
    },
  }),
});