export default new GraphQLObjectType({
  name: 'CampaignTheme',
  description: 'Theming/styling for the campaign',
  fields: () => ({
    color: {
      type: new GraphQLObjectType({
        name: 'CampaignThemeColor',
        description: 'Color theming for the campaign',
        fields: () => ({
          main: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The primary color for the theme',
          },
          light: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The lighter color for the theme',
          },
        }),
      }),
      description:
        'The goal number of whatever impact units the campaign is hoping to achieve',
    },
  }),
});