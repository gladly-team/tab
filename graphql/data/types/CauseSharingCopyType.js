export default new GraphQLObjectType({
  name: 'SharingUICopy',
  description: 'cause specific UI content around sharing',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'markdown for modal title',
    },
    subtitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'markdown for modal subtitle',
    },
    imgCategory: {
      type: new GraphQLNonNull(GraphQLString),
      description: `value to use for img switch statement on frontend, probably ‘cats’ or ‘seas’`,
    },
    shareImage: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Image to use in email invite dialog',
    },
    sentImage: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Image shown after email invite sent',
    },
    redditButtonTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for reddit button',
    },
    facebookButtonTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for facebook button',
    },
    twitterButtonTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for twitter button',
    },
    tumblrTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for tumblr button',
    },
    tumblrCaption: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for tumblr caption',
    },
  }),
});