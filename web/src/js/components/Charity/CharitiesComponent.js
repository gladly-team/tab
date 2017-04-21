import React from 'react';
import CharityDisplay from './CharityDisplay';

class Charities extends React.Component {
  
  render() {
    const { app } = this.props; 

    const sawasdee = {
      fontSize: '2.5em',
      fontWeight: 'normal',
    };

    return (
      <ul>
        {app.charities.edges.map((edge) => {
            return (<CharityDisplay key={edge.node.id} charity={edge.node}/>)
        })}
      </ul>
    );
  }
}

Charities.propTypes = {
  app: React.PropTypes.object.isRequired
};

export default Charities;
