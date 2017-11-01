import React from 'react'
import PropTypes from 'prop-types'

import WidgetSharedSpace from 'general/WidgetSharedSpace'
import EmptyWidgetMsg from '../../EmptyWidgetMsg'
import {List} from 'general/List'
import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation'
import Todo from './Todo'
import AddTodoForm from './AddTodoForm'
import Subheader from 'material-ui/Subheader'
import appTheme, {
  dashboardIconInactiveColor,
  primaryColor
} from 'theme/default'

class TodosWidget extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      completed: [],
      todos: []
    }
  }

  componentDidMount () {
    const { widget } = this.props
    const data = JSON.parse(widget.data)

    this.setState({
      completed: data.completed || [],
      todos: data.todos || []
    })
  }

  completeTodo (index) {
    const removed = this.state.todos.splice(index, 1)
    this.state.completed.push(removed[0])
    this.setState({
      completed: this.state.completed,
      todos: this.state.todos
    })
    this.updateWidget()
  }

  setNotCompleted (index) {
    const removed = this.state.completed.splice(index, 1)
    this.state.todos.push(removed[0])
    this.setState({
      completed: this.state.completed,
      todos: this.state.todos
    })
    this.updateWidget()
  }

  addNewTodo (text) {
    const content = text
    if (content) {
      const newTodo = {
        id: this.randomString(6),
        text: content
      }
      this.state.todos.splice(0, 0, newTodo)
      this.setState({
        todos: this.state.todos
      })
      this.updateWidget()
    }
  }

  removeCompletedTodo (index) {
    this.state.completed.splice(index, 1)
    this.setState({
      completed: this.state.completed
    })
    this.updateWidget()
  }

  removeTodo (index) {
    this.state.todos.splice(index, 1)
    this.setState({
      todos: this.state.todos
    })
    this.updateWidget()
  }

  getWidgetData () {
    const data = {
      completed: this.state.completed,
      todos: this.state.todos
    }
    return JSON.stringify(data)
  }

  onSaveSuccess () {}

  onSaveError () {
    this.props.showError('Oops, we are having trouble saving your widgets right now :(')
  }

  updateWidget () {
    const data = this.getWidgetData()

    UpdateWidgetDataMutation.commit(
      this.props.relay.environment,
      this.props.user,
      this.props.widget,
      data,
      this.onSaveSuccess.bind(this),
      this.onSaveError.bind(this)
    )
  }

  // This is a temporary solution since we are updating the
  // widget data, if we have specific mutations for the notes
  // then we should generate the id of the note on the server.
  randomString (length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
  }

  render () {
    const sharedSpaceStyle = {
      overflowX: 'visible',
      overflowY: 'visible',
      overflow: 'visible'
    }

    const todosContainer = {
      overflowY: 'scroll',
      overflowX: 'hidden',
      height: '60vh'
    }

    const mainContainer = {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 27
    }

    var nodataMsg
    if (!this.state.todos.length && !this.state.completed.length) {
      nodataMsg = (
        <EmptyWidgetMsg
          widgetName={'Todos'} />)
    }

    return (<WidgetSharedSpace
      containerStyle={sharedSpaceStyle}>
      <div style={mainContainer}>
        <AddTodoForm
          addTodo={this.addNewTodo.bind(this)} />
        <List
          containerStyle={todosContainer}>
          {nodataMsg}
          {this.state.todos.map((todo, index) => {
            return (
              <Todo
                key={todo.id}
                todo={todo}
                index={index}
                completed={false}
                onCompletedChange={this.completeTodo.bind(this)}
                remove={this.removeTodo.bind(this)} />
            )
          })}
          {
            this.state.completed.length
            ? (
              <Subheader
                style={{
                  color: dashboardIconInactiveColor,
                  borderTop: `2px ${primaryColor} solid`,
                  borderBottom: `2px ${primaryColor} solid`,
                  display: 'block',
                  lineHeight: '100%',
                  margin: 5,
                  width: 'auto',
                  padding: '6px 12px',
                  boxSizing: 'border-box',
                  fontSize: 14,
                  fontFamily: appTheme.fontFamily,
                  backgroundColor: 'rgba(0,0,0,.3)'
                }}
                inset={false}
              >
                Completed
              </Subheader>
            )
            : null
          }
          {this.state.completed.map((todo, index) => {
            return (
              <Todo
                key={todo.id}
                todo={todo}
                index={index}
                completed
                onCompletedChange={this.setNotCompleted.bind(this)}
                remove={this.removeCompletedTodo.bind(this)} />
            )
          })}
        </List>
      </div>
    </WidgetSharedSpace>)
  }
}

TodosWidget.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    data: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  showError: PropTypes.func.isRequired
}

export default TodosWidget
