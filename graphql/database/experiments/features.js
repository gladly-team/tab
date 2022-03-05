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
  'yahoo-search': {
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

export default features
