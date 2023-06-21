export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    logTab: logTabMutation,
    updateImpact: updateImpactMutation,
    createInvitedUsers: createInvitedUsersMutation,
    createSquadInvites: createSquadInvitesMutation,
    logSearch: logSearchMutation,
    logUserRevenue: logUserRevenueMutation,
    logUserDataConsent: logUserDataConsentMutation,
    donateVc: donateVcMutation,
    mergeIntoExistingUser: mergeIntoExistingUserMutation,
    logEmailVerified: logEmailVerifiedMutation,
    logReferralLinkClick: logReferralLinkClickMutation,;