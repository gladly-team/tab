import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import WidgetSharedSpace from 'general/WidgetSharedSpace';
import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation';
import Todo from './Todo';

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

import appTheme from 'theme/default';

import {
  grey300,
} from 'material-ui/styles/colors';

class TodosWidget extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      // open: false,
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
      // open: widget.visible,
    });
  }

  // toggleWidgetContent() {
  //   const open = !this.state.open;

  //   this.setState({
  //     open: open,
  //   });

  //   this.props.widgetVisibilityChanged(
  //     this.props.user, this.props.widget, open);
  // }

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
      fontSize: 14,
      fontFamily: appTheme.fontFamily,
    }

    const todosContainer = {
      display: 'flex',
      flexDirection: 'column',
    }


    const floatingLabelStyle = {
      color: '#FFF',
      fontFamily: appTheme.fontFamily,
      backgroundColor: appTheme.palette.primary1Color,
      borderRadius: 16,
      padding: 5,
      paddingLeft: 12,
      paddingRight: 12,
    }

    const floatingLabelFocusStyle = {
      color: '#FFF',
      backgroundColor: 'transparent',
    }

    const underlineStyle = {
      borderColor: 'transparent',
    }

    const underlineFocusStyle = {
      borderColor: '#FFF',
    }

    const addTodoContainer = {
      display: 'flex',
      justifyContent: 'flex-start',
    }

    const addTodoStyle = {
      top: -20,
    }

    const addTodoInpuStyle = {
      color: '#FFF',
      fontSize: 14,
      fontFamily: appTheme.fontFamily,
    }

    const removeIconStyle = {
      fontSize: '14px'
    }

    return (<WidgetSharedSpace>
              <div style={todosContainer}>
                  <div style={addTodoContainer}>
                    <TextField
                      ref={(input) => { this.newTodo = input; }}
                      onKeyPress = {this._handleKeyPress.bind(this)}
                      style={addTodoStyle}
                      inputStyle={addTodoInpuStyle}
                      floatingLabelText="Add new Todo"
                      floatingLabelStyle={floatingLabelStyle}
                      floatingLabelFocusStyle={floatingLabelFocusStyle}
                      underlineStyle={underlineStyle}
                      underlineFocusStyle={underlineFocusStyle}/>
                  </div>
                  {this.state.todos.map((todo, index) => {
                      return (
                        <Todo
                          key={todo.id}
                          todo={todo}
                          index={index}
                          completed={false}
                          onCompletedChange={this.completeTodo.bind(this)}
                          remove={this.removeTodo.bind(this)}/>
                      );
                  })}
                  
                  <Subheader style={headerStyle}>Completed</Subheader>
                  {this.state.completed.map((todo, index) => {
                      return (
                        <Todo
                          key={todo.id}
                          todo={todo}
                          index={index}
                          completed={true}
                          onCompletedChange={this.setNotCompleted.bind(this)}
                          remove={this.removeCompletedTodo.bind(this)}/>
                        );
                  })}
              </div>
          </WidgetSharedSpace>);
  }
}

TodosWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  widgetVisibilityChanged: PropTypes.func.isRequired
};

export default TodosWidget;
