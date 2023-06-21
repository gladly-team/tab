export default new GraphQLObjectType({
  name: 'CampaignSocialSharing',
  description:
    'Information on progress toward a target impact goal for the campaign',
  fields: () => ({
    url: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The URL to share',
    },
    EmailShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingEmailProps',
        description: 'Props for the email social sharing button',
        fields: () => ({
          subject: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The email subject',
          },
          body: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The email body',
          },
        }),
      }),
      description: 'Props for the email social sharing button',
    },
    FacebookShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingFacebookProps',
        description: 'Props for the Facebook social sharing button',
        fields: () => ({
          quote: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The text to share to Facebook',
          },
        }),
      }),
      description: 'Props for the Facebook social sharing button',
    },
    RedditShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingRedditProps',
        description: 'Props for the Reddit social sharing button',
        fields: () => ({
          title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The text to share to Reddit',
          },
        }),
      }),
      description: 'Props for the Reddit social sharing button',
    },
    TumblrShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingTumblrProps',
        description: 'Props for the Tumblr social sharing button',
        fields: () => ({
          title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The Tumblr title',
          },
          caption: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The Tumblr caption',
          },
        }),
      }),
      description: 'Props for the Tumblr social sharing button',
    },
    TwitterShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingTwitterProps',
        description: 'Props for the Twitter social sharing button',
        fields: () => ({
          title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The text to share to Twitter',
          },
          related: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
            description: 'A list of Twitter handles that relate to the post',
          },
        }),
      }),
      description: 'Props for the Twitter social sharing button',
    },
  }),
});