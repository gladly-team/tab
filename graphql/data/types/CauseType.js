export default new GraphQLObjectType({
  name: CAUSE,
  description: 'all cause specific data and ui content',
  fields: () => ({
    id: globalIdField(CAUSE),
    about: {
      type: new GraphQLNonNull(GraphQLString),
      description: `Markdown - content that populates an "About the Cause" page`,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: `String used to describe cause in account page`,
    },
    nameForShop: {
      type: new GraphQLNonNull(GraphQLString),
      description: `String used to describe cause in the shop extension`,
    },
    isAvailableToSelect: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'boolean if cause is available to select in ui',
    },
    causeId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Cause's id",
      resolve: (cause) => cause.id,
    },
    icon: {
      type: new GraphQLNonNull(GraphQLString),
      description: `Name of an icon, mapping to an icon component on the frontend`,
    },
    landingPagePath: {
      type: new GraphQLNonNull(GraphQLString),
      description: `URL path for the landing page belonging to this cause`,
    },
    landingPagePhrase: {
      type: new GraphQLNonNull(GraphQLString),
      description: `Phrase for the landing page belonging to this cause`,
      resolve: (cause, _, context) => getLandingPagePhrase(context.user, cause),
    },
    individualImpactEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: `Whether or not the current cause supports individual impact`,
      deprecationReason: 'Replaced by "impactType" field.',
    },
    impactType: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: 'causeImpactType',
          description:
            "The type of charitable impact that's enabled for this cause",
          values: {
            none: { value: CAUSE_IMPACT_TYPES.none },
            individual: { value: CAUSE_IMPACT_TYPES.individual },
            group: { value: CAUSE_IMPACT_TYPES.group },
            individual_and_group: {
              value: CAUSE_IMPACT_TYPES.individual_and_group,
            },
          },
        })
      ),
      description: `Whether or not the current cause supports individual impact`,
    },
    impactVisits: {
      type: GraphQLInt,
      description: `number of visits required for each impact unit (e.g. 14 for cat charity)`,
    },
    impact: {
      type: CauseImpactCopy,
      description: 'the impact object on cause model',
      resolve: (cause) => cause.impact,
    },
    theme: {
      type: new GraphQLNonNull(CauseThemeType),
      description: 'the theme object on cause model',
      resolve: (cause) => cause.theme,
    },
    sharing: {
      type: new GraphQLNonNull(CauseSharingCopyType),
      description: 'the sharing object on cause model',
      resolve: (cause) => cause.sharing,
    },
    onboarding: {
      type: new GraphQLNonNull(CauseOnboardingCopyType),
      resolve: (cause) => cause.onboarding,
      description: 'the onboarding object on cause model',
    },
    groupImpactMetric: {
      type: groupImpactMetricType,
      description:
        'the group impact metric currently associated with this cause',
      resolve: (cause, _args, context) =>
        getGroupImpactMetricForCause(context.user, cause.id),
    },
    groupImpactMetricCount: {
      type: GraphQLInt,
      description:
        'how many times this particular group impact metric has been completed for this cause',
      resolve: (cause, _args, context) =>
        getCauseImpactMetricCount(context.user, cause.id),
    },
    charity: {
      type: charityType,
      description: 'Charity that this cause is currently generating impact for',
      resolve: (cause, _, context) =>
        CharityModel.get(context.user, cause.charityId),
    },
    charities: {
      type: new GraphQLList(charityType),
      description: 'Charity that this cause is currently generating impact for',
      resolve: (cause, _, context) =>
        getCharitiesForCause(context.user, cause.charityIds, cause.charityId),
    },
  }),
  interfaces: [nodeInterface],
});