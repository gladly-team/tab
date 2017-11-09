/* eslint-disable no-unused-vars, no-use-before-define */

import config from '../config'
import {
  WIDGET,
  CHARITY,
  USER,
  BACKGROUND_IMAGE
} from '../database/constants'

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInputObjectType
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection,
  connectionFromPromisedArray,
  offsetToCursor
} from 'graphql-relay'

import Widget from '../database/widgets/Widget'
import getWidget from '../database/widgets/getWidget'
import getWidgets from '../database/widgets/getWidgets'
import getAllBaseWidgets from '../database/widgets/baseWidget/getAllBaseWidgets'
import {
  updateWidgetData,
  updateWidgetVisibility,
  updateWidgetEnabled,
  updateWidgetConfig
} from '../database/widgets/updateWidget'

import UserModel from '../database/users/UserModel'
import createUser from '../database/users/createUser'
import logTab from '../database/users/logTab'
import setActiveWidget from '../database/users/setActiveWidget'
import setBackgroundImage from '../database/users/setBackgroundImage'
import setBackgroundImageFromCustomURL from '../database/users/setBackgroundImageFromCustomURL'
import setBackgroundColor from '../database/users/setBackgroundColor'
import setBackgroundImageDaily from '../database/users/setBackgroundImageDaily'

import CharityModel from '../database/charities/CharityModel'

import donateVc from '../database/donations/donateVc'

import BackgroundImageModel from '../database/backgroundImages/BackgroundImageModel'

import {
  Globals,
  getMoneyRaised,
  getReferralVcReward,
  getDollarsPerDayRate
} from '../database/globals/globals'

class App {
  constructor (id) {
    this.id = id
  }

  static getApp (id) {
    return new App(id)
  }
}
/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
// https://stackoverflow.com/a/33411416
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'App') {
      return App.getApp(id)
    } else if (type === USER) {
      return UserModel.get(context.user, id)
    } else if (type === WIDGET) {
      return getWidget(context.user, id)
    } else if (type === CHARITY) {
      return CharityModel.get(context.user, id)
    } else if (type === BACKGROUND_IMAGE) {
      return BackgroundImageModel.get(context.user, id)
    }
    return null
  },
  (obj) => {
    if (obj instanceof App) {
      return appType
    } else if (obj instanceof UserModel) {
      return userType
    } else if (obj instanceof Widget) {
      return widgetType
    } else if (obj instanceof CharityModel) {
      return charityType
    } else if (obj instanceof BackgroundImageModel) {
      return backgroundImageType
    }
    return null
  }
)

/**
 * Define your own types here
 */

const backgroundImageType = new GraphQLObjectType({
  name: BACKGROUND_IMAGE,
  description: 'A background image',
  fields: () => ({
    id: globalIdField(BACKGROUND_IMAGE),
    name: {
      type: GraphQLString,
      description: 'the background image name'
    },
    image: {
      type: GraphQLString,
      description: 'The image filename'
    },
    imageURL: {
      type: GraphQLString,
      description: 'The image file URL'
    },
    thumbnail: {
      type: GraphQLString,
      description: 'The image thumbnail filename'
    },
    thumbnailURL: {
      type: GraphQLString,
      description: 'The image thumbnail URL'
    }
  }),
  interfaces: [nodeInterface]
})

const imageType = new GraphQLObjectType({
  name: 'Image',
  description: 'An image object',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'The image id'
    },
    imageURL: {
      type: GraphQLString,
      description: 'The image file URL'
    }
  })
})

const maxTabsDayType = new GraphQLObjectType({
  name: 'MaxTabsDay',
  description: 'Info about the user\'s day of most opened tabs',
  fields: () => ({
    date: {
      type: GraphQLString,
      description: 'The day the most tabs were opened'
    },
    numTabs: {
      type: GraphQLInt,
      description: 'The number of tabs opened on that day'
    }
  })
})

const userType = new GraphQLObjectType({
  name: USER,
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField(USER),
    userId: {
      type: GraphQLString,
      description: 'Users\'s username',
      resolve: (user, _) => user.id
    },
    backgroundImage: {
      type: imageType,
      description: 'Users\'s background image'
    },
    username: {
      type: GraphQLString,
      description: 'Users\'s username'
    },
    email: {
      type: GraphQLString,
      description: 'User\'s email'
    },
    joined: {
      type: GraphQLString,
      description: 'ISO datetime string of when the user joined'
    },
    vcCurrent: {
      type: GraphQLInt,
      description: 'User\'s current VC'
    },
    vcAllTime: {
      type: GraphQLInt,
      description: 'User\'s all time VC'
    },
    tabs: {
      type: GraphQLInt,
      description: 'User\'s all time tab count'
    },
    maxTabsDay: {
      type: maxTabsDayType,
      description: 'Info about the user\'s day of most opened tabs',
      resolve: (user, _) => user.maxTabsDay.maxDay
    },
    level: {
      type: GraphQLInt,
      description: 'User\'s vc'
    },
    // TODO: change to heartsForNextLevel to be able to get progress
    heartsUntilNextLevel: {
      type: GraphQLInt,
      description: 'Remaing hearts until next level.'
    },
    vcDonatedAllTime: {
      type: GraphQLInt,
      description: 'User\'s total vc donated'
    },
    numUsersRecruited: {
      type: GraphQLInt,
      description: 'The number of users this user has recruited'
    },
    widgets: {
      type: widgetConnection,
      description: 'User widgets',
      args: {
        ...connectionArgs,
        enabled: { type: GraphQLBoolean }
      },
      resolve: (user, args, context) => connectionFromPromisedArray(
        getWidgets(context.user, user.id, args.enabled), args)
    },
    activeWidget: {
      type: GraphQLString,
      description: 'User\'s active widget id'
    },
    backgroundOption: {
      type: GraphQLString,
      description: 'User\'s background option'
    },
    customImage: {
      type: GraphQLString,
      description: 'User\'s background custom image'
    },
    backgroundColor: {
      type: GraphQLString,
      description: 'User\'s background color'
    }
  }),
  interfaces: [nodeInterface]
})

const widgetType = new GraphQLObjectType({
  name: WIDGET,
  description: 'App widget',
  fields: () => ({
    id: globalIdField(WIDGET),
    name: {
      type: GraphQLString,
      description: 'Widget display name'
    },
    type: {
      type: GraphQLString,
      description: 'Widget type'
    },
    icon: {
      type: GraphQLString,
      description: 'Widget icon'
    },
    enabled: {
      type: GraphQLBoolean,
      description: 'The Widget enabled state'
    },
    visible: {
      type: GraphQLBoolean,
      description: 'The Widget visible state'
    },
    data: {
      type: GraphQLString,
      description: 'Widget data.'
    },
    config: {
      type: GraphQLString,
      description: 'Widget user specific configuration.'
    },
    settings: {
      type: GraphQLString,
      description: 'Widget general configuration.'
    }
  }),
  interfaces: [nodeInterface]
})

const charityType = new GraphQLObjectType({
  name: CHARITY,
  description: 'A charitable charity',
  fields: () => ({
    id: globalIdField(CHARITY),
    name: {
      type: GraphQLString,
      description: 'the charity name'
    },
    category: {
      type: GraphQLString,
      description: 'the charity category'
    },
    website: {
      type: GraphQLString,
      description: 'the charity website'
    },
    description: {
      type: GraphQLString,
      description: 'the charity description'
    },
    impact: {
      type: GraphQLString,
      description: 'the charity impact message'
    },
    logo: {
      type: GraphQLString,
      description: 'the charity logo image URI'
    },
    image: {
      type: GraphQLString,
      description: 'the charity post-donation image URI'
    }
  }),
  interfaces: [nodeInterface]
})

const appType = new GraphQLObjectType({
  name: 'App',
  description: 'Global app fields',
  fields: () => ({
    id: globalIdField('App'),
    moneyRaised: {
      type: GraphQLFloat,
      resolve: () => {
        return getMoneyRaised()
      }
    },
    dollarsPerDayRate: {
      type: GraphQLFloat,
      resolve: () => {
        return getDollarsPerDayRate()
      }
    },
    referralVcReward: {
      type: GraphQLInt,
      resolve: () => {
        return getReferralVcReward()
      }
    },
    widgets: {
      type: widgetConnection,
      description: 'All the widgets',
      args: connectionArgs,
      resolve: (_, args, context) => connectionFromPromisedArray(
        getAllBaseWidgets(context.user), args)
    },
    charities: {
      type: charityConnection,
      description: 'All the charities',
      args: connectionArgs,
      resolve: (_, args, context) => connectionFromPromisedArray(CharityModel.getAll(context.user), args)
    },
    backgroundImages: {
      type: backgroundImageConnection,
      description: 'All the background Images',
      args: connectionArgs,
      resolve: (_, args, context) => connectionFromPromisedArray(BackgroundImageModel.getAll(context.user), args)
    }
  }),
  interfaces: [nodeInterface]
})

/**
 * Define your own connection types here
 */
const { connectionType: widgetConnection, edgeType: widgetEdge } = connectionDefinitions({ name: WIDGET, nodeType: widgetType })
const { connectionType: charityConnection, edgeType: charityEdge } = connectionDefinitions({ name: CHARITY, nodeType: charityType })
const { connectionType: backgroundImageConnection, edgeType: backgroundImageEdge } = connectionDefinitions({ name: BACKGROUND_IMAGE, nodeType: backgroundImageType })

/**
 * Updated the user vc.
 */
const logTabMutation = mutationWithClientMutationId({
  name: 'LogTab',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId}, context) => {
    const { type, id } = fromGlobalId(userId)
    return logTab(context.user, id)
  }
})

/**
 * Donate to a charity.
 */
const donateVcMutation = mutationWithClientMutationId({
  name: 'DonateVc',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    charityId: { type: new GraphQLNonNull(GraphQLString) },
    vc: { type: new GraphQLNonNull(GraphQLInt) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId, charityId, vc}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const charityGlobalObj = fromGlobalId(charityId)
    return donateVc(context.user, userGlobalObj.id, charityGlobalObj.id, vc)
  }
})

/**
 * Set user background image mutation.
 */
const setUserBkgImageMutation = mutationWithClientMutationId({
  name: 'SetUserBkgImage',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    imageId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({ userId, imageId }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const bckImageGlobalObj = fromGlobalId(imageId)
    return setBackgroundImage(
      context.user, userGlobalObj.id, bckImageGlobalObj.id)
  }
})

/**
 * Set user background color mutation.
 */
const setUserBkgColorMutation = mutationWithClientMutationId({
  name: 'SetUserBkgColor',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    color: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId, color}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setBackgroundColor(context.user, userGlobalObj.id, color)
  }
})

/**
 * Set user background custom image mutation.
 */
const setUserBkgCustomImageMutation = mutationWithClientMutationId({
  name: 'SetUserBkgCustomImage',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId, image}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setBackgroundImageFromCustomURL(
      context.user, userGlobalObj.id, image)
  }
})

/**
 * Set user background daily image.
 */
const setUserBkgDailyImageMutation = mutationWithClientMutationId({
  name: 'SetUserBkgDailyImage',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setBackgroundImageDaily(context.user, userGlobalObj.id)
  }
})

/**
 * Set user background daily image.
 */
const setUserActiveWidgetMutation = mutationWithClientMutationId({
  name: 'SetUserActiveWidget',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId, widgetId}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setActiveWidget(context.user, userGlobalObj.id, widgetId)
  }
})

/**
 * Update widget data.
 */
const updateWidgetDataMutation = mutationWithClientMutationId({
  name: 'UpdateWidgetData',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: (userWidget) => {
        return userWidget
      }
    }
  },
  mutateAndGetPayload: ({userId, widgetId, data}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateWidgetData(context.user, userGlobalObj.id, widgetGlobalObj.id, data)
  }
})

/**
 * Update widget visibility.
 */
const updateWidgetVisibilityMutation = mutationWithClientMutationId({
  name: 'UpdateWidgetVisibility',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    visible: { type: new GraphQLNonNull(GraphQLBoolean) }
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: (userWidget) => {
        return userWidget
      }
    }
  },
  mutateAndGetPayload: ({userId, widgetId, visible}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateWidgetVisibility(context.user, userGlobalObj.id, widgetGlobalObj.id, visible)
  }
})

/**
 * Update widget enable.
 */
const updateWidgetEnabledMutation = mutationWithClientMutationId({
  name: 'UpdateWidgetEnabled',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    enabled: { type: new GraphQLNonNull(GraphQLBoolean) }
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: (userWidget) => {
        return userWidget
      }
    }
  },
  mutateAndGetPayload: ({userId, widgetId, enabled}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateWidgetEnabled(context.user, userGlobalObj.id, widgetGlobalObj.id, enabled)
  }
})

/**
 * Update widget config.
 */
const updateWidgetConfigMutation = mutationWithClientMutationId({
  name: 'UpdateWidgetConfig',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    config: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: (userWidget) => {
        return userWidget
      }
    }
  },
  mutateAndGetPayload: ({userId, widgetId, config}, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateWidgetConfig(context.user, userGlobalObj.id, widgetGlobalObj.id, config)
  }
})

const ReferralDataInput = new GraphQLInputObjectType({
  name: 'ReferralData',
  fields: {
    referringUser: { type: new GraphQLNonNull(GraphQLString) }
  }
})

/**
 * Create a new user.
 */
const createNewUserMutation = mutationWithClientMutationId({
  name: 'CreateNewUser',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    referralData: { type: ReferralDataInput }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId, username, email, referralData}, context) => {
    return createUser(context.user, userId, username,
      email, referralData)
  }
})

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    app: {
      type: appType,
      resolve: () => App.getApp(1)
    },
    user: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, args, context) => UserModel.get(context.user, args.userId)
    }
  })
})

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    logTab: logTabMutation,
    donateVc: donateVcMutation,

    setUserBkgImage: setUserBkgImageMutation,
    setUserBkgColor: setUserBkgColorMutation,
    setUserBkgCustomImage: setUserBkgCustomImageMutation,
    setUserBkgDailyImage: setUserBkgDailyImageMutation,

    updateWidgetData: updateWidgetDataMutation,
    updateWidgetVisibility: updateWidgetVisibilityMutation,
    updateWidgetEnabled: updateWidgetEnabledMutation,
    updateWidgetConfig: updateWidgetConfigMutation,

    setUserActiveWidget: setUserActiveWidgetMutation,

    createNewUser: createNewUserMutation
  })
})

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
