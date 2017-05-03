import React from 'react';

import WidgetsSettingsView from './Widgets/WidgetsSettingsView';

class Settings extends React.Component {
  
  render() {
    const { user } = this.props; 

    return (
      <WidgetsSettingsView />
    );
  }
}

Settings.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default Settings;
