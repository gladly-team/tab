import React from 'react'
import { Paper } from 'material-ui'
import UsernameField from 'general/UsernameField'
import RaisedButton from 'material-ui/RaisedButton'

class EnterUsernameForm extends React.Component {
  submit (e) {
    const usernameValid = this.username.validate()
    if (usernameValid) {
      // TODO:
      // SetUsernameMutation
      // Handle duplicate username error
      console.log('Setting username.')
    }
  }

  handleKeyPress (e) {
    // TODO
    // if (this.state.settingUsernameInProgress) { return }

    if (e.key === 'Enter') {
      this.submit()
    }
  }

  render () {
    return (
      <Paper
        zDepth={1}
        style={{
          padding: 24,
          backgroundColor: '#FFF'
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 500
          }}
        >
          Choose a username
        </span>
        <UsernameField
          usernameDuplicate={false}
          onKeyPress={this.handleKeyPress.bind(this)}
          ref={(elem) => { this.username = elem }}
          style={{
            display: 'block'
          }}
          />
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24
          }}
        >
          <RaisedButton
            label='NEXT'
            primary
            onClick={this.submit.bind(this)}
           />
        </span>
      </Paper>
    )
  }
}

export default EnterUsernameForm
