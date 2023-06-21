export default new GraphQLObjectType({
  name: 'Mission',
  description: 'A goal that Tabbers complete with a group of friends',
  fields: () => ({
    missionId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Mission ID',
    },
    status: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: 'missionStatus',
          description:
            'whether a user has accepted rejected or is pending invitation',
          values: {
            pending: { value: 'pending' },
            started: { value: 'started' },
            completed: { value: 'completed' },
          },
        })
      ),
      description:
        'the current status of the current mission - pending, started, completed',
    },
    squadName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the name of the squad',
    },
    // sending these both down and calculating on the front end so we can see percent move
    tabGoal: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the number of tabs to complete mission',
    },
    tabCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "the sum of users' number of tabs towards mission",
    },
    acknowledgedMissionComplete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'if a user has acknowledged mission complete',
    },
    acknowledgedMissionStarted: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'if a user has acknowledged mission started',
    },
    squadMembers: {
      description: 'stats and state of each squad member',
      type: new GraphQLNonNull(new GraphQLList(SquadMemberInfo)),
    },
    endOfMissionAwards: {
      type: new GraphQLNonNull(new GraphQLList(EndOfMissionAward)),
      description:
        'the end of mission awards calculated when mission completes',
    },
    started: {
      type: GraphQLString,
      description: 'ISO datetime string of when the mission started',
    },
    completed: {
      type: GraphQLString,
      description: 'ISO datetime string of when the mission completed',
    },
  }),
});