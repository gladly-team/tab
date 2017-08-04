/* eslint-disable no-unused-vars, no-use-before-define */

import config from '../config'
import {
  CHARITY
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

import {
  Widget,
  getWidget
} from '../database/widgets/widget/baseWidget'

import {
  getUserWidgets,
  updateUserWidgetData,
  updateUserWidgetVisibility,
  updateUserWidgetEnabled,
  updateUserWidgetConfig,
  getAllWidgets
} from '../database/widgets/widgets'

import {
  updateBookmarkPosition,
  addBookmark,
  deleteBookmark
} from '../database/widgets/widgetTypes/bookmarkWidget'

import UserModel from '../database/users/UserModel'
import incrementVc from '../database/users/incrementVc'
import setActiveWidget from '../database/users/setActiveWidget'

import CharityModel from '../database/charities/CharityModel'

import {
  donateVc
} from '../database/donations/donation'

import {
  BackgroundImage,
  getBackgroundImage,
  getBackgroundImages
} from '../database/backgroundImages/backgroundImage'

import {
  Globals,
  getMoneyRaised,
  getDollarsPerDayRate
} from '../database/globals/globals'

const staticRoot = config.S3_ENDPOINT

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
    } else if (type === 'User') {
      return UserModel.get(context.user, id)
    } else if (type === 'Widget') {
      return getWidget(id)
    } else if (type === CHARITY) {
      return CharityModel.get(context.user, id)
    } else if (type === 'BackgroundImage') {
      return getBackgroundImage(id)
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
    } else if (obj instanceof BackgroundImage) {
      return backgroundImageType
    }
    return null
  }
)

/**
 * Define your own types here
 */

const backgroundImageType = new GraphQLObjectType({
  name: 'BackgroundImage',
  description: 'A background image',
  fields: () => ({
    id: globalIdField('BackgroundImage'),
    name: {
      type: GraphQLString,
      description: 'the background image name'
    },
    fileName: {
      type: GraphQLString,
      description: 'The image file name'
    },
    url: {
      type: GraphQLString,
      resolve: (image) => {
        return staticRoot + '/' + image.fileName
      }
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
    name: {
      type: GraphQLString,
      description: 'The image name'
    },
    fileName: {
      type: GraphQLString,
      description: 'The image file name'
    },
    url: {
      type: GraphQLString,
      resolve: (image) => {
        return staticRoot + '/' + image.fileName
      }
    }
  })
})

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
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
    vcCurrent: {
      type: GraphQLInt,
      description: 'User\'s current vc'
    },
    vcAllTime: {
      type: GraphQLInt,
      description: 'User\'s vc of all time'
    },
    level: {
      type: GraphQLInt,
      description: 'User\'s vc'
    },
    heartsUntilNextLevel: {
      type: GraphQLInt,
      description: 'Remaing hearts until next level.'
    },
    widgets: {
      type: widgetConnection,
      description: 'User widgets',
      args: {
        ...connectionArgs,
        enabled: { type: GraphQLBoolean }
      },
      resolve: (user, args) => connectionFromPromisedArray(getUserWidgets(user.id, args.enabled), args)
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
  name: 'Widget',
  description: 'App widget',
  fields: () => ({
    id: globalIdField('Widget'),
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
      resolve: (charity) => {
        return staticRoot + '/charities/charity-logos/' + charity.logo
      }
    },
    image: {
      type: GraphQLString,
      resolve: (charity) => {
        return staticRoot + '/charities/charity-post-donation-images/' + charity.image
      }
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
    widgets: {
      type: widgetConnection,
      description: 'All the widgets',
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(getAllWidgets(), args)
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
      resolve: (_, args) => connectionFromPromisedArray(getBackgroundImages(), args)
    }
  }),
  interfaces: [nodeInterface]
})

/**
 * Define your own connection types here
 */
const { connectionType: widgetConnection, edgeType: widgetEdge } = connectionDefinitions({ name: 'Widget', nodeType: widgetType })
const { connectionType: charityConnection, edgeType: charityEdge } = connectionDefinitions({ name: CHARITY, nodeType: charityType })
const { connectionType: backgroundImageConnection, edgeType: backgroundImageEdge } = connectionDefinitions({ name: 'BackgroundImage', nodeType: backgroundImageType })

/**
 * Updated the user vc.
 */
const updateVcMutation = mutationWithClientMutationId({
  name: 'UpdateVc',
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
    return incrementVc(context.user, id)
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
    return UserModel.setBackgroundImage(
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
    return UserModel.setBackgroundColor(context.user, userGlobalObj.id, color)
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
    return UserModel.setBackgroundImageFromCustomURL(
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
    return UserModel.setBackgroundImageDaily(context.user, userGlobalObj.id)
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
 * Add a new bookmark.
 */
const addBookmarkMutation = mutationWithClientMutationId({
  name: 'AddBookmark',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    link: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: (userWidget) => {
        userWidget.id = userWidget.widgetId
        userWidget.data = JSON.stringify(userWidget.data)
        return userWidget
      }
    }
  },
  mutateAndGetPayload: ({userId, widgetId, name, link}) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return addBookmark(userGlobalObj.id, widgetGlobalObj.id, name, link)
  }
})

/**
 * Remove a bookmark.
 */
const removeBookmarkMutation = mutationWithClientMutationId({
  name: 'RemoveBookmark',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    position: { type: new GraphQLNonNull(GraphQLInt) }
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: (userWidget) => {
        userWidget.id = userWidget.widgetId
        userWidget.data = JSON.stringify(userWidget.data)
        return userWidget
      }
    }
  },
  mutateAndGetPayload: ({userId, widgetId, position}) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return deleteBookmark(userGlobalObj.id, widgetGlobalObj.id, position)
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
  mutateAndGetPayload: ({userId, widgetId, data}) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateUserWidgetData(userGlobalObj.id, widgetGlobalObj.id, data)
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
  mutateAndGetPayload: ({userId, widgetId, visible}) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateUserWidgetVisibility(userGlobalObj.id, widgetGlobalObj.id, visible)
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
  mutateAndGetPayload: ({userId, widgetId, enabled}) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateUserWidgetEnabled(userGlobalObj.id, widgetGlobalObj.id, enabled)
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
  mutateAndGetPayload: ({userId, widgetId, config}) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateUserWidgetConfig(userGlobalObj.id, widgetGlobalObj.id, config)
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
    return UserModel.createUser(context.user, userId, username,
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
    updateVc: updateVcMutation,
    donateVc: donateVcMutation,

    setUserBkgImage: setUserBkgImageMutation,
    setUserBkgColor: setUserBkgColorMutation,
    setUserBkgCustomImage: setUserBkgCustomImageMutation,
    setUserBkgDailyImage: setUserBkgDailyImageMutation,

    updateWidgetData: updateWidgetDataMutation,
    updateWidgetVisibility: updateWidgetVisibilityMutation,
    updateWidgetEnabled: updateWidgetEnabledMutation,
    updateWidgetConfig: updateWidgetConfigMutation,

    addBookmark: addBookmarkMutation,
    removeBookmark: removeBookmarkMutation,
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
