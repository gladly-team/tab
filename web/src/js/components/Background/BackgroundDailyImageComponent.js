import React from 'react';
import SetBackgroundDailyImageMutation from 'mutations/SetBackgroundDailyImageMutation';

class BackgroundDailyImage extends React.Component {
  
  constructor(props) {
      super(props);
  }

  componentDidMount() {
    if(this.props.updateOnMount){
      SetBackgroundDailyImageMutation.commit(
        this.props.relay.environment,
        this.props.user
      );
    }
  }

  render() {
    return null;
  }
}

BackgroundDailyImage.propTypes = {
  user: React.PropTypes.object.isRequired,
  updateOnMount: React.PropTypes.bool,
};

BackgroundDailyImage.defaultProps = {
  updateOnMount: false,
};

export default BackgroundDailyImage;


