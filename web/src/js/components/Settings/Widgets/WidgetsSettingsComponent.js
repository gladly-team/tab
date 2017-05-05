import React from 'react';
import WidgetSettings from './WidgetSettingsContainer';
import {List} from 'material-ui/List';
import FullScreenProgress from 'general/FullScreenProgress';

class WidgetsSettings extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      userWidgets: null,
    }
  }

  componentDidMount() {
    const { user, app } = this.props; 

    const defaultWidget = {
      enabled: false,
      config: {}
    };

    const userWidgets = {};
    var node;
    
    for(var index in user.widgets.edges) {
      node = user.widgets.edges[index].node;
      userWidgets[node.name] = node;
    }

    this.setState({
      userWidgets: userWidgets,
    })
  }
  
  render() {
    const { user, app } = this.props; 

    const container = {
      width: '100%',
      marginLeft: 256,
      marginRight: 'auto',
      padding: 20,
    };

    // We need to wait for the 
    // userWidgetsMap to be created before 
    // mounting the WidgetSettings.
    if(!this.state.userWidgets) {
      return (<FullScreenProgress />);
    }

    const self = this;
    return (
      <div style={container}>
        <List>
          {app.widgets.edges.map((edge, index) => {
              return (<WidgetSettings 
                        key={index}
                        user={user}
                        appWidget={edge.node}
                        widget={self.state.userWidgets[edge.node.name]}/>)
          })}
        </List>
      </div>
    );
  }
}

WidgetsSettings.propTypes = {
  user: React.PropTypes.object.isRequired,
  app: React.PropTypes.object.isRequired
};

export default WidgetsSettings;