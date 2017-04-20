/* eslint-disable no-unused-vars, no-use-before-define */

const staticRoot = process.env.S3_ENDPOINT;

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

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
} from 'graphql-relay';

import {
  Feature,
  addFeature,
  getFeature,
  getFeatures
} from '../database/features/feature';

import {
  User,
  getUser,
  updateUserVc,
  setUserBackgroundImage
} from '../database/users/user';

import {
  Charity,
  getCharity,
  getCharities
} from '../database/charities/charity';

import {
  donateVc
} from '../database/donations/donation';

import {
  BackgroundImage,
  getBackgroundImage,
  getBackgroundImages
} from '../database/backgroundImages/backgroundImage';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Feature') {
      return getFeature(id);
    } else if (type === 'Charity') {
      return getCharity(id);
    } else if (type === 'BackgroundImage') {
      return getBackgroundImage(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Feature) {
      return featureType;
    } else if (obj instanceof Charity) {
      return charityType;
    } else if (obj instanceof BackgroundImage) {
      return backgroundImageType;
    }
    return null;
  }
);

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
      description: 'the background image name',
    },
    fileName: {
      type: GraphQLString,
      description: 'The image file name'
    },
    url: {
      type: GraphQLString,
      resolve: (image) => {
        return staticRoot + '/' + image.fileName;
      }
    }
  }),
  interfaces: [nodeInterface],
});

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
        return staticRoot + '/' + image.fileName;
      }
    }
  })
});

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    features: {
      type: featureConnection,
      description: 'Features that I have',
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(getFeatures(), args)
    },
    charities: {
      type: charityConnection,
      description: 'All the charities',
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(getCharities(), args)
    },
    backgroundImages: {
      type: backgroundImageConnection,
      description: 'All the background Images',
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(getBackgroundImages(), args)
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
    }
  }),
  interfaces: [nodeInterface]
});

const featureType = new GraphQLObjectType({
  name: 'Feature',
  description: 'Feature integrated in our starter kit',
  fields: () => ({
    id: globalIdField('Feature'),
    name: {
      type: GraphQLString,
      description: 'Name of the feature'
    },
    description: {
      type: GraphQLString,
      description: 'Description of the feature'
    },
    url: {
      type: GraphQLString,
      description: 'Url of the feature'
    }
  }),
  interfaces: [nodeInterface]
});

const charityType = new GraphQLObjectType({
  name: 'Charity',
  description: 'A charitable charity',
  fields: () => ({
    id: globalIdField('Charity'),
    name: {
      type: GraphQLString,
      description: 'the charity name',
    },
    category: {
      type: GraphQLString,
      description: 'the charity category',
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
const { connectionType: featureConnection, edgeType: featureEdge } = connectionDefinitions({ name: 'Feature', nodeType: featureType });
const { connectionType: charityConnection, edgeType: charityEdge } = connectionDefinitions({ name: 'Charity', nodeType: charityType });
const { connectionType: backgroundImageConnection, edgeType: backgroundImageEdge } = connectionDefinitions({ name: 'BackgroundImage', nodeType: backgroundImageType });

/**
 * Updated the user vc.
 */
const updateVcMutation = mutationWithClientMutationId({
  name: 'UpdateVc',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId}) => {
    const { type, id } = fromGlobalId(userId);
    return updateUserVc(id, 1);
  }
});

/**
 * Donate to a charity.
 */
const donateVcMutation = mutationWithClientMutationId({
  name: 'DonateVc',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    charityId: { type: new GraphQLNonNull(GraphQLString) },
    vc: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId, charityId, vc}) => {
    const userGlobalObj = fromGlobalId(userId);
    const charityGlobalObj = fromGlobalId(charityId);
    return donateVc(userGlobalObj.id, charityGlobalObj.id, vc);
  }
});

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
    viewer: {
      type: userType,
      resolve: user => user
    }
  },
  mutateAndGetPayload: ({userId, imageId}) => {
    const userGlobalObj = fromGlobalId(userId);
    const bckImageGlobalObj = fromGlobalId(imageId);
    return setUserBackgroundImage(userGlobalObj.id, bckImageGlobalObj.id);
  }
});

const addFeatureMutation = mutationWithClientMutationId({
  name: 'AddFeature',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    url: { type: new GraphQLNonNull(GraphQLString) },
  },

  outputFields: {
    featureEdge: {
      type: featureEdge,
      resolve: (obj) => {
        return Promise.resolve(getFeatures())
        .then(features => {
            // This code it's what we should actually do in here 

            // const cursorId = cursorForObjectInConnection(features, obj);
            // return { node: features[offset], cursor: cursorId};

            // The previous code doesn't work because the cursorForObjectInConnection 
            // uses indexOf(compare using memory reference) to get the position of object 
            // obj in features check cursorForObjectInConnection
            // definition at https://github.com/graphql/graphql-relay-js/blob/master/src/connection/arrayconnection.js
            // The following code it's a workaround to the previous one. 
            // It searches for the obj by id in the list of features, then
            // encode the index and return the edge object.

            var offset = -1;
            for(var i = 0, len = features.length; i < len; i++) {
                if (features[i].id === obj.id) {
                    offset = i;
                    break;
                }
            }

            // offsetToCursor creates a hash using the position of the object.
            if (offset >= 0) {
              return { node: features[offset], cursor: offsetToCursor(offset)};
            }
        })
        .catch(
          err => console.error("Unable get the features:", JSON.stringify(err, null, 2))
        );
      }
    },
    viewer: {
      type: userType,
      resolve: () => getUser("45bbefbf-63d1-4d36-931e-212fbe2bc3d9")
    }
  },

  mutateAndGetPayload: ({ name, description, url }) => addFeature(name, description, url)
});


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getUser("45bbefbf-63d1-4d36-931e-212fbe2bc3d9")
    }
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addFeature: addFeatureMutation,
    updateVc: updateVcMutation,
    donateVc: donateVcMutation,
    setUserBkgImage: setUserBkgImageMutation
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
