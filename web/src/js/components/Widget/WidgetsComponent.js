import React from 'react';
import Widget from './WidgetContainer';
import PropTypes from 'prop-types';

class Widgets extends React.Component {
  
  render() {
    const { user } = this.props; 

    const widgetsContainer = {
      position: 'absolute',
      top: 20,
      display: 'flex',
      justifyContent: 'flex-start',
    }

    const separator = {
      width: 20,
    }

    return (
      <div style={widgetsContainer}>
        <div style={separator}></div>
        {user.widgets.edges.map((edge, index) => {
            return (<Widget 
                      key={index}
                      user={user}
                      widget={edge.node}/>)
        })}
      </div>
    );
  }
}

Widgets.propTypes = {
  user: PropTypes.object.isRequired
};

export default Widgets;
