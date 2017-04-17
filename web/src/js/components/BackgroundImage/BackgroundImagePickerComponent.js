import React from 'react';
import Relay from 'react-relay';
import Slider from 'material-ui/Slider';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import SetBackgroundImageMutation from 'mutations/SetBackgroundImageMutation';

import { browserHistory } from 'react-router';


class BackgroundImagePicker extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = {
          selectedImage: null
      };
  }

  componentDidMount() {
    const { viewer } = this.props;
    this.setState({
      selectedImage: viewer.backgroundImages.edges[0].node
    });
  }


  onImageSelected(image) {
    this.setState({
      selectedImage: image
    });
  }

  updateImageBackground() {
    const setBckImageMutation = new SetBackgroundImageMutation({ 
      viewer: this.props.viewer,
      imageId: this.state.selectedImage.id});

    Relay.Store.commitUpdate(setBckImageMutation);

    browserHistory.push('/');
  }

  render() {
    const { viewer } = this.props;
    
    
    const main = {
      width: '60%',
      marginRight: 'auto',
      marginLeft: 'auto',
      padding: 50,
    }

    var selectedImage = '';
    if(this.state.selectedImage) {
      selectedImage = this.state.selectedImage.name;
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
        <h1 style={title}>Choose a cool background image</h1>
        <List>
          {viewer.backgroundImages.edges.map((edge) => {
              return (<ListItem onClick={this.onImageSelected.bind(this, edge.node)} key={edge.node.id} primaryText={edge.node.name} />)
          })}
        </List>
        <Divider />
        <p>Selected image: {selectedImage}</p>
        
        <RaisedButton 
          onClick={this.updateImageBackground.bind(this)}
          label={"Update"} 
          primary={true} 
          style={style} />
      </div>
    );
  }
}

BackgroundImagePicker.propTypes = {
  viewer: React.PropTypes.object.isRequired
};

export default BackgroundImagePicker;


