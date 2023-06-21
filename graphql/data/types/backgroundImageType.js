export default new GraphQLObjectType({
  name: BACKGROUND_IMAGE,
  description: 'A background image',
  fields: () => ({
    id: globalIdField(BACKGROUND_IMAGE),
    name: {
      type: GraphQLString,
      description: 'the background image name',
    },
    image: {
      type: GraphQLString,
      description: 'The image filename',
    },
    imageURL: {
      type: GraphQLString,
      description: 'The image file URL',
    },
    category: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the category that the image falls into',
    },
    thumbnail: {
      type: GraphQLString,
      description: 'The image thumbnail filename',
    },
    thumbnailURL: {
      type: GraphQLString,
      description: 'The image thumbnail URL',
    },
    timestamp: {
      type: GraphQLString,
      description:
        'ISO datetime string of when the background image was last set',
    },
  }),
  interfaces: [nodeInterface],
});