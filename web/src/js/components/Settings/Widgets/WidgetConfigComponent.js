import React from 'react';
import ReactDOM from 'react-dom';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class WidgetConfig extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { setting } = this.props;
    switch(setting.type){
      case 'boolean':
        return (<BooleanWidgetConfig
                    setting={setting}
                    onConfigUpdated={this.props.onConfigUpdated}/>);
      case 'choices':
        return (<ChoicesWidgetConfig
                    setting={setting}
                    onConfigUpdated={this.props.onConfigUpdated}/>);
      default:
        return null;
    }
  }
}

WidgetConfig.propTypes = {
  setting: React.PropTypes.object.isRequired,
  onConfigUpdated: React.PropTypes.func.isRequired,
};

export default WidgetConfig;


class BooleanWidgetConfig extends React.Component {

  constructor(props) {
    super(props);
  }

  onToggle(event, checked) {
    const { setting } = this.props;
    this.props.onConfigUpdated(setting.field, checked);
  }

  render() {
    const { setting } = this.props;

    const toggleContainer = {
      width: '90%',
      margin: 'auto',
    };

    return (
        <div style={toggleContainer}>
          <Toggle
            label={setting.display}
            defaultToggled={setting.value}
            onToggle={this.onToggle.bind(this)}/>
        </div>
    )
  }
}

class ChoicesWidgetConfig extends React.Component {

  constructor(props) {
    super(props);
  }

  onChange(event, value) {
    const { setting } = this.props;
    this.props.onConfigUpdated(setting.field, value);
  }

  render() {
    const { setting } = this.props;

    const choicesContainer = {
      width: '90%',
      margin: 'auto',
      display: 'flex',
    };

    const btnGroupContainer = {
      width: '100%',
    };  

    const btnGroup = {
      display: 'flex',
      width: 'auto',
      float: 'right',
    };

    const radioBtn = {
      width: 'auto',
      marginRight: 10,
    };

    const settingDisplay = {
      width: '100%',
    };

    return (
        <div style={choicesContainer}>
          <span style={settingDisplay}>{setting.display}</span>
          <div style={btnGroupContainer}>
            <RadioButtonGroup 
              onChange={this.onChange.bind(this)}
              style={btnGroup}
              name={setting.field + '-choices'} 
              defaultSelected={setting.value}>
                {setting.choices.map((choice, index) => {
                  return (<RadioButton
                            key={index}
                            style={radioBtn}
                            value={choice}
                            label={choice}/>)
                })}
            </RadioButtonGroup>
          </div>
        </div>
    )
  }
}