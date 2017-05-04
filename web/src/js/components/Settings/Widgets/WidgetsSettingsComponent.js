import React from 'react';
import WidgetSettings from './WidgetSettingsContainer';
import {List} from 'material-ui/List';

class WidgetsSettings extends React.Component {
  
  render() {
    const { user } = this.props; 
    
    const container = {
      width: '100%',
      marginLeft: 256,
      marginRight: 'auto',
      padding: 20,
    };

    return (
      <div style={container}>
        <List>
          {user.widgets.edges.map((edge, index) => {
              return (<WidgetSettings 
                        key={index}
                        user={user}
                        widget={edge.node}/>)
          })}
        </List>
      </div>
    );
  }
}

WidgetsSettings.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default WidgetsSettings;
