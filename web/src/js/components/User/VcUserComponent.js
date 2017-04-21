import React, {Component} from 'react';
import Relay from 'react-relay';
import UpdateVcMutation from 'mutations/UpdateVcMutation';
import FontIcon from 'material-ui/FontIcon';

class VcUser extends Component {

  componentDidMount() {
    UpdateVcMutation.commit(
      this.props.relay.environment,
      this.props.user
    );
  }

  render() {

    const { user } = this.props;
    const heartsToLevelUp = user.heartsUntilNextLevel;

    const container = {
      textAlign: 'center'
    };

    const progressContainer = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    }

    const currentVc = {
      color: 'white',
      fontSize: '7em',
      fontWeight: 'normal',
      fontFamily: "'Helvetica Neue', Roboto, 'Segoe UI', Calibri, sans-serif",
      marginTop: 10,
      marginBottom: 10,
    }

    const text = {
      color: 'white',
      textAlign: 'center',
      fontSize: '2em',
      fontWeight: 'normal',
      fontFamily: "'Comic Sans MS', cursive, sans-serif"
    }


    return (
      <div style={container}>
        <div style={progressContainer}>
          <h1 style={currentVc}>{user.vcCurrent} <i className="fa fa-heart-o"/></h1>
          <div style={text}>Level {user.level} Tabber</div>
        </div>
      </div>
    );
  }
}

VcUser.propTypes = {
  user: React.PropTypes.object.isRequired
};

VcUser.defaultProps = {
  
}

export default VcUser;