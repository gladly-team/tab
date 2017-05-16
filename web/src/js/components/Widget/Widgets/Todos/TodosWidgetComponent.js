import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';

import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import SvgIcon from 'material-ui/SvgIcon';

import {
  grey300,
} from 'material-ui/styles/colors';

class TodosWidget extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      completed: [],
      todos: [],
    }
  }

  componentDidMount() {
    const { widget } = this.props; 
    const data = JSON.parse(widget.data);

    this.setState({
      completed: data.completed || [],
      todos: data.todos || [],
      open: widget.visible,
      anchorEl: ReactDOM.findDOMNode(this.bIcon),
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });

    this.props.popoverWidgetVisibilityChanged(
      this.props.user, this.props.widget, false);
  }

  handleRequestOpen(event) {

    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });

    this.props.popoverWidgetVisibilityChanged(
      this.props.user, this.props.widget, true);
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.addNewTodo();
    }
  }

  completeTodo(index) {
    const removed = this.state.todos.splice(index, 1);
    this.state.completed.push(removed[0]);
    this.setState({
      completed: this.state.completed,
      todos: this.state.todos,
    });
    this.updateWidget();
  }

  setNotCompleted(index) {
    const removed = this.state.completed.splice(index, 1);
    this.state.todos.push(removed[0]);
    this.setState({
      completed: this.state.completed,
      todos: this.state.todos,
    });
    this.updateWidget();
  }

  addNewTodo() {
    const content = this.newTodo.input.value;
    if(content) {
        const newTodo = {
          id: this.randomString(6),
          text: content,
        };
        this.state.todos.splice(0, 0, newTodo);
        this.setState({
          todos: this.state.todos,
        });
        this.newTodo.input.value = '';
        this.updateWidget();
    }
  }

  removeCompletedTodo(index) {
    this.state.completed.splice(index, 1);
    this.setState({
      completed: this.state.completed,
    });
    this.updateWidget();
  }

  removeTodo(index) {
    this.state.todos.splice(index, 1);
    this.setState({
      todos: this.state.todos,
    });
    this.updateWidget();
  }

  getWidgetData() {
    const data = {
      completed: this.state.completed,
      todos: this.state.todos,
    }
    return JSON.stringify(data);
  }

  updateWidget() {
    const data = this.getWidgetData();
    
    UpdateWidgetDataMutation.commit(
      this.props.relay.environment,
      this.props.user,
      this.props.widget,
      data
    );
  }

  // This is a temporary solution since we are updating the 
  // widget data, if we have specific mutations for the notes
  // then we should generate the id of the note on the server.
  randomString(length) {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
  }

  render() {
    const { widget } = this.props;

    const containerStyle = {
      backgroundColor: 'rgba(0,0,0,.54)',
      width: 300,
    } 

    const headerStyle = {
      color: '#FFF',
    }

    const todosContainer = {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 500,
    }

    const todoListItem = {
      color: "#FFF",
    }

    const completedListItem = {
      color: "#FFF",
      textDecoration: 'line-through',
    }

    const checkedIcon = (
      <CheckCircle
          color="FFF"
          style={{color: '#FFF'}}/>);

    const uncheckedIcon =(
      <SvgIcon color={'#FFF'}>
        <svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      </SvgIcon>
    );

    const floatingLabelStyle = {
      color: '#FFF',
    }

    const floatingLabelFocusStyle = {
      color: '#FFF',
    }

    const underlineStyle = {
      borderColor: 'transparent',
    }

    const underlineFocusStyle = {
      borderColor: '#FFF',
    }

    const addTodoContainer = {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      top: -20,
    }

    const addTodoStyle = {
      color: '#FFF',
    }

    const removeIconStyle = {
      fontSize: '14px'
    }

    return (
        <div>
          <IconButton 
              ref={(bIcon) => { this.bIcon = bIcon; }}
              tooltip={widget.name}
              onClick={this.handleRequestOpen.bind(this)}>
                <FontIcon
                  color={grey300}
                  hoverColor={'#FFF'}
                  className="fa fa-list-ul"/>
          </IconButton>
          <Popover
            style={containerStyle}
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}>
              <div style={todosContainer}>
                <List>
                  <Subheader style={headerStyle}>Todos</Subheader>
                  <div style={addTodoContainer}>
                    <TextField
                      ref={(input) => { this.newTodo = input; }}
                      onKeyPress = {this._handleKeyPress.bind(this)}
                      inputStyle={addTodoStyle}
                      floatingLabelText="Add new"
                      floatingLabelStyle={floatingLabelStyle}
                      floatingLabelFocusStyle={floatingLabelFocusStyle}
                      underlineStyle={underlineStyle}
                      underlineFocusStyle={underlineFocusStyle}/>
                  </div>
                  {this.state.todos.map((todo, index) => {
                      return (
                        <ListItem
                          style={todoListItem}
                          key={todo.id}
                          rightIconButton={
                            (<IconButton
                                onClick={this.removeTodo.bind(this, index)}>
                                  <FontIcon
                                    color={grey300}
                                    hoverColor={'#FFF'}
                                    className="fa fa-times"/>
                            </IconButton>)
                          }
                          leftCheckbox={
                            <Checkbox
                              onCheck={this.completeTodo.bind(this, index)}
                              defaultChecked={false}
                              checkedIcon={checkedIcon}
                              uncheckedIcon={uncheckedIcon} />
                          }
                          primaryText={todo.text}/>);
                  })}
                  
                  <Subheader style={headerStyle}>Completed</Subheader>
                  {this.state.completed.map((todo, index) => {
                      return (
                        <ListItem
                          key={todo.id}
                          style={completedListItem}
                          rightIconButton={
                            (<IconButton
                                onClick={this.removeCompletedTodo.bind(this, index)}>
                                  <FontIcon
                                    style={removeIconStyle}
                                    color={grey300}
                                    hoverColor={'#FFF'}
                                    className="fa fa-times"/>
                            </IconButton>)
                          }
                          leftCheckbox={
                            <Checkbox
                              onCheck={this.setNotCompleted.bind(this, index)}
                              defaultChecked={true}
                              checkedIcon={checkedIcon}
                              uncheckedIcon={uncheckedIcon} />
                          }
                          primaryText={todo.text}/>);
                  })}
                </List>
              </div>

          </Popover>
        </div>);
  }
}

TodosWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  popoverWidgetVisibilityChanged: PropTypes.func.isRequired
};

export default TodosWidget;
