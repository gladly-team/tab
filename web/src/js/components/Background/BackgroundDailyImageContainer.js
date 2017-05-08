import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import BackgroundDailyImage from './BackgroundDailyImageComponent';

export default createFragmentContainer(BackgroundDailyImage, {
  user: graphql`
    fragment BackgroundDailyImageContainer_user on User {
      id
    }
  `
});
