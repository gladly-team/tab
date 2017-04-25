import React from 'react';
import Widget from './Widget';

class Widgets extends React.Component {
  
  render() {
    const { user } = this.props; 

    const widgetsContainer = {
      position: 'absolute',
      top: 10,
      left: 20,
      display: 'flex',
      width: 100,
      justifyContent: 'space-around'
    }

    return (
      <div style={widgetsContainer}>
        {user.widgets.edges.map((edge) => {
            return (<Widget 
                      key={edge.node.id} 
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
