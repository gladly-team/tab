export default new GraphQLObjectType({
  name: 'OnboardingUICopy',
  description: 'cause specific UI content around onboarding',
  fields: () => ({
    steps: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLObjectType({
            name: 'onboardingUIStep',
            description: 'ui content for each onboarding step',
            fields: () => ({
              title: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'markdown title for onboarding step',
              },
              subtitle: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'markdown subtitle for onboarding step',
              },
              imgName: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'name of image to show',
              },
            }),
          })
        )
      ),
      description: 'the steps array in onboarding',
      resolve: (onboarding) => onboarding.steps,
    },
    firstTabIntroDescription: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (onboarding) => onboarding.firstTabIntroDescription,
      description:
        'markdown string shown when prompting the user to open their first tab, currently info about cat treats',
    },
  }),
});