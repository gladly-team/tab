import React from 'react';
import Relay from 'react-relay';
import Slider from 'material-ui/Slider';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import DonateVcMutation from 'mutations/DonateVcMutation';

class DonateVc extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = {
          donateSlider: 1,
          selectedCharity: null
      };
  }

  componentDidMount() {
    const { app } = this.props;
    this.setState({
      selectedCharity: app.charities.edges[0].node
    });
  }

  handleDonateSlider(event, value) {
    this.setState({donateSlider: value});
  }

  onCharitySelected(charity) {
    this.setState({
      selectedCharity: charity
    });
  }

  donateHearts() {
    DonateVcMutation.commit(
      this.props.relay.environment,
      this.props.user,
      this.state.selectedCharity.id,
      this.state.donateSlider
    );
  }

  render() {
    const { user, app } = this.props;
    if(user.vcCurrent < 1) {
      return (<p>Not enough hearts to donate. :(</p>)
    }
    
    const main = {
      width: '60%',
      marginRight: 'auto',
      marginLeft: 'auto',
      padding: 50,
    }

    var donateTo = '';
    if(this.state.selectedCharity) {
      donateTo = this.state.selectedCharity.name;
    }

    const style = {
      margin: 12,
    };

    const title = {
      fontSize: '2.5em',
      fontWeight: 'normal',
    };

    return (
      <div style={main}>
        <h1 style={title}>Donate to a Charity of your choice</h1>
        <List>
          {app.charities.edges.map((edge) => {
              return (<ListItem onClick={this.onCharitySelected.bind(this, edge.node)} key={edge.node.id} primaryText={edge.node.name} />)
          })}
        </List>
        <Divider />
        <p>Donate to: {donateTo}</p>
        <Divider />
        <Slider
          min={0}
          max={user.vcCurrent}
          step={1}
          defaultValue={1}
          value={this.state.donateSlider}
          onChange={this.handleDonateSlider.bind(this)}/>
        
        <RaisedButton 
          onClick={this.donateHearts.bind(this)}
          label={"Donate " + this.state.donateSlider + " Hearts"} 
          primary={true} 
          style={style} />

      </div>
    );
  }
}

DonateVc.propTypes = {
	app: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

export default DonateVc;


