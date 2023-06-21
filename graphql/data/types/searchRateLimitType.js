export default new GraphQLObjectType({
  name: 'SearchRateLimit',
  description: 'Info about any rate-limiting for VC earned from search queries',
  fields: () => ({
    limitReached: {
      type: GraphQLBoolean,
      description:
        "Whether we are currently rate-limiting the user's VC earned from searches",
    },
    reason: {
      type: new GraphQLEnumType({
        name: 'SearchRateLimitReason',
        description:
          "Why we are rate-limiting the user's VC earned from searches",
        values: {
          NONE: { value: 'NONE' },
          ONE_MINUTE_MAX: { value: 'ONE_MINUTE_MAX' },
          FIVE_MINUTE_MAX: { value: 'FIVE_MINUTE_MAX' },
          DAILY_MAX: { value: 'DAILY_MAX' },
        },
      }),
    },
    checkIfHuman: {
      type: GraphQLBoolean,
      description: 'Whether we should present the user with a CAPTCHA',
    },
  }),
});