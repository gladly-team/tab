import React, {Component} from 'react';
import Relay from 'react-relay';
import UpdateVcMutation from 'mutations/UpdateVcMutation';
import LinearProgress from 'material-ui/LinearProgress';

class VcUser extends Component {

  componentDidMount() {
    const updateVcMutation = new UpdateVcMutation({ viewer: this.props.viewer });
    Relay.Store.commitUpdate(updateVcMutation);
  }

  render() {

    const { viewer } = this.props;
    const heartsToLevelUp = viewer.heartsUntilNextLevel;

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
              style={text}>Level {viewer.level} Tabber</div>
            <LinearProgress 
              style={progressBar}
              color={'orange'}
              mode={'determinate'}
              value={viewer.vcAllTime} 
              max={viewer.vcAllTime + viewer.heartsUntilNextLevel}/>
            <div style={text}>{heartsToLevelUp} Hearts to level-up</div>
          </div>
          <div style={currentStatsContainer}>
            <p 
              data-test-id={'current-hearts'}
              style={text}>{viewer.vcCurrent} Hearts</p>
          </div>
        </div>
      </div>
    );
  }
}

VcUser.propTypes = {
  viewer: React.PropTypes.object.isRequired
};

VcUser.defaultProps = {
  
}

export default VcUser;