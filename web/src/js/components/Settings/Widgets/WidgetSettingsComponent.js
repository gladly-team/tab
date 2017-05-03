import React from 'react';
import ReactDOM from 'react-dom';

class WidgetSettings extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { widget, user } = this.props; 

    return (
        <div>
          <h2>{widget.name}</h2>
          <h2>{user.id}</h2>
        </div>);
  }
}

WidgetSettings.propTypes = {
  widget: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default WidgetSettings;
