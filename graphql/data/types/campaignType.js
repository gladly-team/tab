export default new GraphQLObjectType({
  name: 'Campaign',
  description: 'Campaigns (or "charity spotlights") shown to users.',
  fields: () => ({
    campaignId: {
      type: GraphQLString,
      description: 'The ID of the campaign',
    },
    charity: {
      type: charityType,
      description: 'The charity that this campaign features',
    },
    content: {
      type: new GraphQLNonNull(campaignContentType),
      description: 'The text content for the campaign',
    },
    // Deprecated.
    endContent: {
      type: campaignContentType,
      deprecationReason:
        'The content returned by the server will automatically change when the campaign ends.',
      description:
        'The text content for the campaign when it has finished (past the end time)',
    },
    isLive: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not the campaign should currently show to users',
    },
    goal: {
      type: campaignGoalType,
      description:
        'Information on progress toward a target impact goal for the campaign',
    },
    // Deprecated.
    numNewUsers: {
      type: GraphQLInt,
      deprecationReason: 'Replaced by the generalized "goal" data.',
      description: 'The number of new users who joined during this campaign.',
    },
    showCountdownTimer: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether to show a countdown timer for when the campaign will end',
    },
    showHeartsDonationButton: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether to show a button to donate hearts to the charity featured in the campaign -- which requires the "charity " field to be defined',
    },
    showProgressBar: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether to show a progress bar -- which requires the "goal" field to be defined',
    },
    showSocialSharing: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether to show social sharing buttons',
    },
    socialSharing: {
      type: campaignSocialSharingType,
      description: 'Social sharing buttons',
    },
    theme: {
      type: campaignThemeType,
      description: 'Theming/style for the campaign',
    },
    time: {
      type: new GraphQLNonNull(campaignTimeType),
      description:
        'The start and end times (in ISO timestamps) for the campaign',
    },
  }),
});