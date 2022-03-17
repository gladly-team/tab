import {
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
} from './experimentConstants'

const features = {
  'test-feature': {
    defaultValue: false,
    rules: [
      {
        condition: {
          isTabTeamMember: true,
          env: 'local',
        },
        force: true,
      },
    ],
  },
}

features[YAHOO_SEARCH_EXISTING_USERS] = {
  defaultValue: false,
  rules: [
    {
      condition: {
        isTabTeamMember: true,
        env: 'local',
      },
      force: true,
    },
  ],
}

features[YAHOO_SEARCH_NEW_USERS] = {
  defaultValue: 'Google',
  rules: [
    {
      condition: {
        isTabTeamMember: true,
        env: 'local',
      },
      force: 'SearchForACause',
    },
  ],
}

export default features
