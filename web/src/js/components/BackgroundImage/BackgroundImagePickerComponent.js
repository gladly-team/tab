import React from 'react';
import SetBackgroundImageMutation from 'mutations/SetBackgroundImageMutation';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

class BackgroundImagePicker extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = {
          selectedImage: null
      };
  }

  componentDidMount() {
    const { app, user } = this.props;
    this.setState({
      selectedImage: user.backgroundImage
    });
  }

  onImageSelected(image) {
    this.setState({
      selectedImage: image
    });

    SetBackgroundImageMutation.commit(
      this.props.relay.environment,
      this.props.user,
      image
    );
  }

  render() {
    const { app } = this.props;
    const root = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    };

    const gridList = {
      width: '100%',
      overflowY: 'auto',
    };

    return (
      <div style={root}>
        <GridList
          cols={3}
          cellHeight={170}
          style={gridList}>
          {app.backgroundImages.edges.map((edge) => {
              const checked = this.state.selectedImage &&
                this.state.selectedImage.url === edge.node.url;

              return (
                  <GridTile
                    key={edge.node.url}
                    title={edge.node.name}
                    subtitle={<span>by <b>{'Gladly'}</b></span>}
                    actionIcon={
                      <IconButton
                          onClick={this.onImageSelected.bind(this, edge.node)}>
                        <FontIcon 
                          className={checked?"fa fa-check-circle":"fa fa-circle-o"}
                          color="white" />
                      </IconButton>}>
                    <img src={edge.node.url} />
                  </GridTile>)
          })}
        </GridList>
      </div>
    );
  }
}

BackgroundImagePicker.propTypes = {
  app: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

export default BackgroundImagePicker;


