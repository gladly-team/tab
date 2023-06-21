export default new GraphQLObjectType({
  name: 'MaxTabsDay',
  description: "Info about the user's day of most opened tabs",
  fields: () => ({
    date: {
      type: GraphQLString,
      description: 'The day the most tabs were opened',
    },
    numTabs: {
      type: GraphQLInt,
      description: 'The number of tabs opened on that day',
    },
  }),
});