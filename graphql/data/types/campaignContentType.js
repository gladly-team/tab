export default new GraphQLObjectType({
  name: 'CampaignContent',
  description: 'Text content for campaigns',
  fields: () => ({
    titleMarkdown: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The campaign title, using markdown',
    },
    descriptionMarkdown: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The primary campaign text content (paragraphs, links, etc.), using markdown',
    },
    descriptionMarkdownTwo: {
      type: GraphQLString,
      description:
        'Additional campaign text content (paragraphs, links, etc.), using markdown',
    },
  }),
});