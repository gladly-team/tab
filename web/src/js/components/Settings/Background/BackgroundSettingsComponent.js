import React from 'react';
import PropTypes from 'prop-types';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import BackgroundImagePicker from '../../Background/BackgroundImagePickerContainer';
import BackgroundColorPicker from '../../Background/BackgroundColorPickerContainer';
import BackgroundCustomImagePicker from '../../Background/BackgroundCustomImagePickerContainer';
import BackgroundDailyImage from '../../Background/BackgroundDailyImageContainer';

class BackgroundSettings extends React.Component {
  
  constructor(props) {
      super(props);

      this.defaultSelection = 'photo';

      this.state = {
        selected: this.defaultSelection,
      }
  }

  componentDidMount() {

    const { user } = this.props;

    this.setState({
      selected: user.backgroundOption || this.defaultSelection,
    });
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
    var dividerCmp = (<Divider style={divider}/>);
    switch(this.state.selected) {
      case 'daily':
        dividerCmp = null;
        selectedOption = (<BackgroundDailyImage 
                            user={user}
                            updateOnMount={user.backgroundOption != 'daily'}/>)
        break;
      case 'custom':
        selectedOption = (<BackgroundCustomImagePicker user={user}/>)
        break;
      case 'color':
        selectedOption = (<BackgroundColorPicker user={user}/>)
        break;
      case 'photo':
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
            subtitle={'Set your background options'}
            actAsExpander={false}
            showExpandableButton={false}>
          </CardHeader>
          <div style={cardBody}>
            <RadioButtonGroup 
              onChange={this.onChange.bind(this)}
              name="photoModes" 
              valueSelected={this.state.selected}>
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
                value="photo"
                label="Selected photo"/>
            </RadioButtonGroup>
            {dividerCmp}
            {selectedOption}
          </div>
        </Card>
      </div>
    );
  }
}

BackgroundSettings.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default BackgroundSettings;


