export default new GraphQLObjectType({
  name: 'CampaignGoal',
  description:
    'Information on progress toward a target impact goal for the campaign',
  fields: () => ({
    targetNumber: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The goal number of whatever impact units the campaign is hoping to achieve',
    },
    currentNumber: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The current number of whatever impact units the campaign is hoping to achieve',
    },
    impactUnitSingular: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The English word for the impact unit, singular (e.g. Heart, dollar, puppy)',
    },
    impactUnitPlural: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The English word for the impact unit, plural (e.g. Hearts, dollars, puppies)',
    },
    impactVerbPastParticiple: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The past-tense participle English verb that describes achieving the impact unit (e.g. given, raised, adopted)',
    },
    impactVerbPastTense: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The simple past-tense English verb that describes achieving the impact unit (e.g. gave, raised, adopted)',
    },
    limitProgressToTargetMax: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'If true, do not display a currentNumber greater than the targetNumber. Instead, limit goal progress to 100% of the target.',
    },
    showProgressBarLabel: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether the progress bar should have labels of the current number and goal number',
    },
    showProgressBarEndText: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether the progress bar should have an end-of-campaign summary text of the progress',
    },
  }),
});