export default new GraphQLObjectType({
  name: 'MaxSearchesDay',
  description: "Info about the user's day of most searches",
  fields: () => ({
    date: {
      type: GraphQLString,
      description: 'The day (datetime)the most searches occurred',
    },
    numSearches: {
      type: GraphQLInt,
      description: 'The number of searches made on that day',
    },
  }),
});