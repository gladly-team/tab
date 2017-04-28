import React from 'react';
import Widget from './WidgetContainer';

class Widgets extends React.Component {
  
  render() {
    const { user } = this.props; 

    const widgetsContainer = {
      position: 'absolute',
      top: 20,
      left: 20,
      display: 'flex',
      justifyContent: 'flex-start',
      width: '100vw',
    }

    return (
      <div style={widgetsContainer}>
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
  user: React.PropTypes.object.isRequired
};

export default Widgets;
