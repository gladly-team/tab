import React from 'react';

import SetBackgroundColorMutation from 'mutations/SetBackgroundColorMutation';

import FontIcon from 'material-ui/FontIcon';
import { SketchPicker } from 'react-color';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

class BackgroundColorPicker extends React.Component {
  
  constructor(props) {
      super(props);

      this.state = {
        selectedColor: '#000',
      }
  }

  componentDidMount() {
    const { user } = this.props;
    const selectedColor = user.backgroundColor || this.state.selectedColor;
    this.onColorChanged({hex: selectedColor});
  }

  onColorChanged(color) {
    this.setState({
      selectedColor: color.hex,
    });

    SetBackgroundColorMutation.commit(
      this.props.relay.environment,
      this.props.user,
      color.hex
    );
  }

  render() {
    const { user } = this.props;

    const root = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    };

    const gridList = {
      display: 'flex',
      width: '100%'
    };

    const previewContainer = {
      width: '100%',
      padding: 10,
      paddingTop: 0,
    }

    const preview = {
      width: '100%',
      height: '60%',
      backgroundColor: this.state.selectedColor,
    }

    const header = {
      paddingLeft: 0,
    }

    const divider = {
      marginBottom: 10,
    }

    return (
      <div style={root}>
        <Subheader style={header}>Select your color</Subheader>
        <Divider style={divider}/>
        <div
          style={gridList}>
          <div>
              <SketchPicker
                color={this.state.selectedColor}
                disableAlpha={true}
                onChangeComplete={this.onColorChanged.bind(this)}
              />
          </div>
          <div style={previewContainer}>
            <Paper style={preview}/>
          </div>
        </div>
      </div>
    );
  }
}

BackgroundColorPicker.propTypes = {
  user: React.PropTypes.object.isRequired,
};

export default BackgroundColorPicker;


