import React, {Component} from 'react';
import Relay from 'react-relay';
import UpdateVcMutation from 'mutations/UpdateVcMutation';
import LinearProgress from 'material-ui/LinearProgress';

class VcUser extends Component {

  componentDidMount() {
    const updateVcMutation = new UpdateVcMutation({ 
      userId: this.props.user.id,
      vcCurrent: this.props.user.vcCurrent,
      vcAllTime: this.props.user.vcAllTime 
    });

    Relay.Store.commitUpdate(updateVcMutation);
  }

  render() {

    const { user } = this.props;
    const heartsToLevelUp = user.heartsUntilNextLevel;

    const container = {
      position: 'fixed',
      bottom: 0,
      left: 0,
      background: 'black',
      width: '100vw',
      height: 90,
    };

    const text = {
      color: 'white',
      textAlign: 'center',
    }

    const userProgress = {
      display: 'flex',
      width: 250,
      justifyContent: 'center'
    }

    const progressContainer = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'left',
      padding: 10,
    }

    const currentStatsContainer = {
      padding: 10
    }

    const progressBar = {
      height: 8,
    }

    return (
      <div style={container}>
        <div style={userProgress}>
          <div style={progressContainer}>
            <div 
              data-test-id={'tabber-level'}
              style={text}>Level {user.level} Tabber</div>
            <LinearProgress 
              style={progressBar}
              color={'orange'}
              mode={'determinate'}
              value={user.vcAllTime} 
              max={user.vcAllTime + user.heartsUntilNextLevel}/>
            <div style={text}>{heartsToLevelUp} Hearts to level-up</div>
          </div>
          <div style={currentStatsContainer}>
            <p 
              data-test-id={'current-hearts'}
              style={text}>{user.vcCurrent} Hearts</p>
          </div>
        </div>
      </div>
    );
  }
}

VcUser.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default VcUser;