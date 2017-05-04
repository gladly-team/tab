import React from 'react';
import ReactDOM from 'react-dom';
import Toggle from 'material-ui/Toggle';
import WidgetConfig from './WidgetConfigComponent';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

class WidgetSettings extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      settings: [],
    }
  }

  componentDidMount() {
    const { widget, user } = this.props;

    const settings = this.getConfig(
      JSON.parse(widget.settings), 
      JSON.parse(widget.config));

    this.setState({
      settings: settings,
    });
  }

  getConfig(settings, config) {
    if(!settings.length)
      return [];

    for(var i = 0; i < settings.length; i++) {
      settings[i].value = config[settings[i].field];
    }
    return settings;
  }

  onWidgetEnableChange(event, checked) {
    // Call mutation to update widget enabled status.
    const { widget, user } = this.props;
    console.log(widget.name + ' enabled:', checked);
  }

  onWidgetConfigUpdated(field, value) {
    const { widget, user } = this.props;
    const widgetConfig = JSON.parse(widget.config);
    widgetConfig[field] = value;

    const strConfig = JSON.stringify(widgetConfig);
    // Call mutation to update widget config.
    console.log(widget.name + ' config:', strConfig);

  }

  render() {
    const { widget, user } = this.props;
    const settings = this.state.settings || [];

    const settingsContainer = {
      display: 'flex',
      flexDirection: 'column',
    };

    const card = {
      marginBottom: 10,
    };

    const enableToggle = {
      width: 'initial',
      float: 'right',
      top: 10,
    };

    var settingsComponent;
    if(settings && settings.length){
      settingsComponent = (
        <CardText>
          <div style={settingsContainer}>
            {settings.map((setting, index) => {
              return (<WidgetConfig 
                         key={index}
                         setting={setting}
                         onConfigUpdated={this.onWidgetConfigUpdated.bind(this)}/>)
            })}
          </div>
        </CardText>
      );
    }

    return (
      <Card style={card}>
        <CardHeader
          title={widget.name}
          subtitle={widget.name}
          actAsExpander={false}
          showExpandableButton={false}>
            <Toggle 
              style={enableToggle}
              defaultToggled={widget.enabled}
              onToggle={this.onWidgetEnableChange.bind(this)}/>
        </CardHeader>
        {settingsComponent}
      </Card>
    )
  }
}

WidgetSettings.propTypes = {
  widget: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default WidgetSettings;
