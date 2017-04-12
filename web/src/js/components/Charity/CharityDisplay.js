import React from 'react';

class CharityDisplay extends React.Component {

  static propTypes = {
    charity: React.PropTypes.object.isRequired
  };

  render() {
    const { charity } = this.props; 
    
    return (
      <li>{charity.name}({charity.category})</li>
    );
  }
}

export default CharityDisplay;