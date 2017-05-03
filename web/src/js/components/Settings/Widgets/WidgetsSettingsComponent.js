import React from 'react';
import WidgetSettings from './WidgetSettingsContainer';

class WidgetsSettings extends React.Component {
  
  render() {
    const { user } = this.props; 

    return (
      <div>
        {user.widgets.edges.map((edge, index) => {
            return (<WidgetSettings 
                      key={index}
                      user={user}
                      widget={edge.node}/>)
        })}
      </div>
    );
  }
}

WidgetsSettings.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default WidgetsSettings;
