export default new GraphQLInputObjectType({
  name: 'EncodedRevenueValue',
  description: 'An object representing a single revenue value',
  fields: {
    encodingType: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: 'EncodedRevenueValueTypeEnum',
          description:
            'The type of transformation we should use to resolve the object into a revenue value',
          values: {
            AMAZON_CPM: { value: 'AMAZON_CPM' },
          },
        })
      ),
    },
    encodedValue: {
      description:
        'A string that we can decode to a revenue value (float) using the "encodingType" method',
      type: new GraphQLNonNull(GraphQLString),
    },
    adSize: { type: GraphQLString },
  },
});