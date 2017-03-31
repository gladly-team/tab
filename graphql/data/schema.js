/* eslint-disable no-unused-vars, no-use-before-define */
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
  getUser
} from '../database/users/user';


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
    }
    return null;
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Feature) {
      return featureType;
    }
    return null;
  }
);

/**
 * Define your own types here
 */

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
    username: {
      type: GraphQLString,
      description: 'Users\'s username'
    },
    website: {
      type: GraphQLString,
      description: 'User\'s website'
    }
    // charities: {
    //   type: charityConnection,
    //   description: 'The charities in the app',
    //   args: connectionArgs,
    //   resolve: (_, args) => connectionFromPromisedArray(getCharities(), args),
    // }
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

var charityType = new GraphQLObjectType({
  name: 'Charity',
  description: 'A charitable charity',
  fields: () => ({
    id: globalIdField('Charity'),
    name: {
      type: GraphQLString,
      description: 'the charity name',
    }
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
const { connectionType: featureConnection, edgeType: featureEdge } = connectionDefinitions({ name: 'Feature', nodeType: featureType });

/**
 * Create feature example
 */

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
      resolve: () => getUser(1)
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
      resolve: () => getUser(1)
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
    addFeature: addFeatureMutation
    // Add your own mutations here
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
