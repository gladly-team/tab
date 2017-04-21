import React from 'react';
import Relay from 'react-relay';
import Slider from 'material-ui/Slider';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import SetBackgroundImageMutation from 'mutations/SetBackgroundImageMutation';

class BackgroundImagePicker extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = {
          selectedImage: null
      };
  }

  componentDidMount() {
    const { app } = this.props;
    this.setState({
      selectedImage: app.backgroundImages.edges[0].node
    });
  }


  onImageSelected(image) {
    this.setState({
      selectedImage: image
    });
  }

  updateImageBackground() {
    SetBackgroundImageMutation.commit(
      this.props.relay.environment,
      this.props.user.id,
      this.state.selectedImage
    );

    this.props.onImageSelected(this.state.selectedImage);
  }

  render() {
    const { app } = this.props;
    
    
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
          {app.backgroundImages.edges.map((edge) => {
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
  app: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
  onImageSelected: React.PropTypes.func.isRequired
};

export default BackgroundImagePicker;


