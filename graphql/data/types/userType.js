export default new GraphQLObjectType({
  name: USER,
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField(USER),
    userId: {
      type: GraphQLString,
      description:
        "The users's Firebase ID (not Relay global ID, unlike the `id` field",
      resolve: (user) => user.id,
    },
    backgroundImage: {
      type: backgroundImageType,
      description: "Users's background image",
      resolve: (user, _args, context) => getBackgroundImage(context.user, user),
    },
    userImpact: {
      type: userImpactType,
      description:
        "A user's cause-specific impact for the cause they are currently supporting",
      resolve: async (user, _args, context) =>
        getUserImpact(context.user, user.id),
    },
    username: {
      type: GraphQLString,
      description: "Users's username",
    },
    email: {
      type: GraphQLString,
      description: "User's email",
    },
    truexId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'a unique user ID sent to video ad partner truex',
      resolve: (user, _args, context) => getOrCreateTruexId(context.user, user),
    },
    causeId: {
      type: GraphQLString,
      description:
        "The users's cause id. If empty the user does not have a cause.",
      resolve: (user) => user.causeId,
    },
    cause: {
      type: CauseType,
      description: 'cause type for the user',
      resolve: (user, _args, context) => getCauseByUser(context.user, user.id),
    },
    videoAdEligible: {
      type: GraphQLBoolean,
      description:
        'whether a user has completed 3 video ads in the last 24 hours',
      resolve: (user, _args, context) => isVideoAdEligible(context.user, user),
    },
    joined: {
      type: GraphQLString,
      description: 'ISO datetime string of when the user joined',
    },
    justCreated: {
      type: GraphQLBoolean,
      description:
        'Whether or not the user was created during this request. Helpful for a "get or create" mutation',
      resolve: (user) =>
        // The user will only have the 'justCreated' field when it's a
        // brand new user item
        !!user.justCreated,
    },
    vcCurrent: {
      type: GraphQLInt,
      description: "User's current VC",
    },
    vcAllTime: {
      type: GraphQLInt,
      description: "User's all time VC",
    },
    tabs: {
      type: GraphQLInt,
      description: "User's all time tab count",
    },
    tabsToday: {
      type: GraphQLInt,
      description: "User's tab count for today",
    },
    maxTabsDay: {
      type: maxTabsDayType,
      description: "Info about the user's day of most opened tabs",
      resolve: (user) => user.maxTabsDay.maxDay,
    },
    level: {
      type: GraphQLInt,
      description: "User's vc",
    },
    v4BetaEnabled: {
      type: GraphQLBoolean,
      description: 'If true, serve the new Tab V4 app.',
    },
    hasViewedIntroFlow: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'if true, user has viewed intro flow in v4',
    },
    // TODO: change to heartsForNextLevel to be able to get progress
    heartsUntilNextLevel: {
      type: GraphQLInt,
      description: 'Remaing hearts until next level.',
    },
    vcDonatedAllTime: {
      type: GraphQLInt,
      description: "User's total vc donated",
    },
    recruits: {
      type: userRecruitsConnection,
      description: 'People recruited by this user',
      args: {
        ...connectionArgs,
        startTime: { type: GraphQLString },
        endTime: { type: GraphQLString },
      },
      resolve: (user, args, context) =>
        connectionFromPromisedArray(
          getRecruits(context.user, user.id, args.startTime, args.endTime),
          args
        ),
    },
    numUsersRecruited: {
      type: GraphQLInt,
      description: 'The number of users this user has recruited',
    },
    widgets: {
      type: widgetConnection,
      description: 'User widgets',
      args: {
        ...connectionArgs,
        enabled: { type: GraphQLBoolean },
      },
      resolve: (user, args, context) =>
        connectionFromPromisedArray(
          getWidgets(context.user, user.id, args.enabled),
          args
        ),
    },
    activeWidget: {
      type: GraphQLString,
      description: "User's active widget id",
    },
    currentMission: {
      type: MissionType,
      description: 'the current active mission for a user',
      resolve: (user) => getCurrentUserMission(user),
    },
    pastMissions: {
      type: MissionsConnection,
      description: 'gets all the past missions for a user',
      args: connectionArgs,
      resolve: (user, args) => {
        return connectionFromPromisedArray(getPastUserMissions(user), args)
      },
    },
    backgroundOption: {
      type: GraphQLString,
      description: "User's background option",
    },
    customImage: {
      type: GraphQLString,
      description: "User's background custom image",
    },
    backgroundColor: {
      type: GraphQLString,
      description: "User's background color",
    },
    mergedIntoExistingUser: {
      type: GraphQLBoolean,
      description:
        'Whether this user was created by an existing user and then merged into the existing user',
    },
    searches: {
      type: GraphQLInt,
      description: "User's all time search count",
    },
    notifications: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLObjectType({
            name: 'notifications',
            description: 'user notifications to show on v4',
            fields: () => ({
              code: {
                type: GraphQLString,
                description: 'the kind of notification it is',
              },
              variation: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                  'the variation of the notification given to this user (e.g. for A/B testing)',
              },
            }),
          })
        )
      ),
      description: 'notifications for the v4 user to see',
      resolve: (user, args, context) =>
        getUserNotifications(context.user, user),
    },
    searchesToday: {
      type: GraphQLInt,
      description: "User's search count for today",
    },
    searchRateLimit: {
      type: searchRateLimitType,
      description: 'Info about any search query rate-limiting',
      resolve: (user, args, context) =>
        checkSearchRateLimit(context.user, user.id),
    },
    maxSearchesDay: {
      type: maxSearchesDayType,
      description: "Info about the user's day of most searches",
      resolve: (user) => user.maxSearchesDay.maxDay,
    },
    experimentActions: {
      type: ExperimentActionsOutputType,
      description: 'Actions the user has taken during experiments',
      resolve: (user) => constructExperimentActionsType(user),
    },
    pendingMissionInvites: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLObjectType({
            name: 'PendingMissionInvite',
            description: 'pending mission invites for user',
            fields: () => ({
              missionId: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'the mission id of the squad invite',
              },
              invitingUser: {
                type: new GraphQLObjectType({
                  name: 'InvitingUser',
                  description: 'inviting user',
                  fields: () => ({
                    name: {
                      type: new GraphQLNonNull(GraphQLString),
                      description: 'the name entered in invite',
                    },
                  }),
                }),
              },
            }),
          })
        )
      ),
    },
    hasSeenSquads: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'whether a v4 user has been introduced to squads in the ui',
    },
    features: {
      type: new GraphQLNonNull(new GraphQLList(featureType)),
      description: 'feature values for this specific user',
      resolve: (user, args, context) => getUserFeatures(context.user, user),
    },
    searchEngine: {
      type: SearchEnginePersonalizedType,
      description: 'the User’s search engine',
      resolve: (user, args, context) => getUserSearchEngine(context.user, user),
    },
    showYahooPrompt: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'whether to show the yahoo search prompt',
      resolve: (user, _, context) =>
        getShouldShowYahooPrompt(context.user, user),
    },
    showSfacExtensionPrompt: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'whether to show the SFAC extension prompt',
      resolve: (user, _, context) =>
        getShouldShowSfacExtensionPrompt(context.user, user),
    },
    showSfacIcon: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'whether to show the SFAC icon (and activity ui element)',
      resolve: (user, _, context) => getShouldShowSfacIcon(context.user, user),
    },
    sfacActivityState: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: 'sfacActivityState',
          description: 'what mode in which to show SFAC searches UI',
          values: {
            new: { value: 'new' },
            active: { value: 'active' },
            inactive: { value: 'inactive' },
          },
        })
      ),
      resolve: (user, _, context) => getSfacActivityState(context.user, user),
    },
    yahooPaidSearchRewardOptIn: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'whether or not the user has opted into searching for extra impact',
    },
    userGroupImpactMetric: {
      type: userGroupImpactMetricType,
      description: 'Current UserGroupImpactMetric',
      resolve: (user, _, context) =>
        UserGroupImpactMetricModel.getOrNull(
          context,
          user.userGroupImpactMetricId
        ),
    },
    leaderboard: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'leaderboardEntry',
          description: 'content for each leaderboard',
          fields: () => ({
            position: {
              type: new GraphQLNonNull(GraphQLInt),
            },
            userGroupImpactMetric: {
              type: userGroupImpactMetricType,
              description: 'UserGroupImpactMetric entity',
            },
            user: {
              type: userType,
              description: 'User associated with this leaderboard entry',
            },
          }),
        })
      ),
      description: 'Current UserGroupImpactMetrics leaderboard',
      resolve: (user) =>
        user.userGroupImpactMetricId &&
        GroupImpactLeaderboard.getLeaderboardForUser(
          user.userGroupImpactMetricId,
          user.id
        ),
    },
  }),
  interfaces: [nodeInterface],
});