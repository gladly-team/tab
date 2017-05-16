import React from 'react';
import UpdateVcMutation from 'mutations/UpdateVcMutation';
import PropTypes from 'prop-types';

class App extends React.Component {

  componentDidMount() {
    UpdateVcMutation.commit(
      this.props.relay.environment,
      this.props.user
    );
  }

  render() {

    const root = {
      height: '100vh',
    };

    return (
      <div style={root}>
        {this.props.children}
      </div>
    );
  }
}


App.propTypes = {
  user: PropTypes.object.isRequired
};

export default App;

