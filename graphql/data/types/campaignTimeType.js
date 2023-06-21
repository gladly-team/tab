export default new GraphQLObjectType({
  name: 'CampaignTime',
  description: 'The start and end times (in ISO timestamps) for the campaign',
  fields: () => ({
    start: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The start time of the campaign as an ISO timestamp',
    },
    end: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The end time of the campaign as an ISO timestamp',
    },
  }),
});