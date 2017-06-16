import React from 'react';
import WidgetIcon from './WidgetIconContainer';
import Widget from './WidgetContainer';
import PropTypes from 'prop-types';

import UpdateWidgetVisibilityMutation from 'mutations/UpdateWidgetVisibilityMutation';
import SetUserActiveWidgetMutation from 'mutations/SetUserActiveWidgetMutation';

class Widgets extends React.Component {

  constructor(props) {
    super(props);
  }

  onWidgetIconClicked(widget) {
    const { user } = this.props;

    if(user.activeWidget == widget.id) {
      widget = {
        id: "no-active-widget",
      }
    }
    
    SetUserActiveWidgetMutation.commit(
      this.props.relay.environment,
      user,
      widget
    );

    // UpdateWidgetVisibilityMutation.commit(
    //   this.props.relay.environment,
    //   user,
    //   widget,
    //   false
    // );
  }
  
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
      <div>
        <div style={widgetsContainer}>
          <div style={separator}></div>
            {user.widgets.edges.map((edge, index) => {
                return (<WidgetIcon
                          key={index}
                          widget={edge.node}
                          onWidgetIconClicked={this.onWidgetIconClicked.bind(this)}/>)
            })}
        </div>
        {user.widgets.edges.map((edge, index) => {
            if((user.activeWidget && 
                edge.node.id == user.activeWidget) || 
                edge.node.type == 'clock' || 
                edge.node.type == 'search') {
              return (
                <Widget
                    key={index}
                    user={user}
                    widget={edge.node}/>
              )
            }
        })}
      </div>
    );
  }
}

Widgets.propTypes = {
  user: PropTypes.object.isRequired
};

export default Widgets;
