import React from 'react';
import CharityDisplay from './CharityDisplay';

class Charities extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  render() {

    const { viewer } = this.props; 

    const sawasdee = {
      fontSize: '2.5em',
      fontWeight: 'normal',
    };

    return (
      <ul>
        {viewer.charities.edges.map((edge) => {
            return (<CharityDisplay key={edge.node.id} charity={edge.node}/>)
        })}
      </ul>
    );
  }
}

export default Charities;