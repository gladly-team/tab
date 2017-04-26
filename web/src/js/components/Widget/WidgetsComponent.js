import React from 'react';
import Widget from './Widget';
import AddBookmarkMutation from 'mutations/AddBookmarkMutation';

class Widgets extends React.Component {

  addBookmark(widget, name, link) {
    AddBookmarkMutation.commit(
      this.props.relay.environment,
      this.props.user,
      widget,
      name,
      link
    );
  }
  
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
        {user.widgets.edges.map((edge, index) => {
            return (<Widget 
                      key={index} 
                      widget={edge.node}
                      addBookmark={this.addBookmark.bind(this)}/>)
        })}
      </div>
    );
  }
}

Widgets.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default Widgets;
