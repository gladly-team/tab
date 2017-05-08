import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import BackgroundImagePicker from '../../BackgroundImage/BackgroundImagePickerContainer';

class BackgroundSettings extends React.Component {
  
  constructor(props) {
      super(props);

      this.defaultSelection = 'select';

      this.state = {
        selected: this.defaultSelection,
      }
  }

  onChange(event, value) {
    if(!value)
      return;

    this.setState({
      selected: value,
    });
  }

  render() {
    const { app, user } = this.props;

    const main = {
      width: '100%',
      marginLeft: 256,
      marginRight: 'auto',
      padding: 20,
    };

    const optionContainer = {
      padding: 10,
    }

    const divider = {
      marginTop: 10,
      marginBottom: 10,
    }

    const radioBtn = {
      marginBottom: 10,
    }

    const cardBody = {
      padding: 10,
    }

    var selectedOption;
    switch(this.state.selected) {
      case 'daily':
        break;
      case 'custom':
        break;
      case 'color':
        break;
      case 'select':
        selectedOption = (<BackgroundImagePicker app={app} user={user}/>);
        break;
      default:
        break;
    }

    return (
      <div style={main}>
        <Card 
          style={optionContainer}>
          <CardHeader
            title={'Background'}
            subtitle={'Select a beautiful photo'}
            actAsExpander={false}
            showExpandableButton={false}>
          </CardHeader>
          <div style={cardBody}>
            <RadioButtonGroup 
              onChange={this.onChange.bind(this)}
              name="photoModes" 
              defaultSelected={this.defaultSelection}>
              <RadioButton
                style={radioBtn}
                value="daily"
                label="New photo daily"/>
              <RadioButton
                style={radioBtn}
                value="custom"
                label="Custom photo"/>
              <RadioButton
                style={radioBtn}
                value="color"
                label="Use a color"/>
              <RadioButton
                style={radioBtn}
                value="select"
                label="Selected photo"/>
            </RadioButtonGroup>
            <Divider style={divider}/>
            {selectedOption}
          </div>
        </Card>
      </div>
    );
  }
}

BackgroundSettings.propTypes = {
  app: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

export default BackgroundSettings;


