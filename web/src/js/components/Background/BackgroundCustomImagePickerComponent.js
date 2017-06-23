import React from 'react'
import PropTypes from 'prop-types'

import SetBackgroundCustomImageMutation from 'mutations/SetBackgroundCustomImageMutation'

import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'

class BackgroundCustomeImagePicker extends React.Component {
  componentDidMount () {
    const { user } = this.props
    if (user.customImage) {
      this.onChange(null, user.customImage)
    }
  }

  isValid (value) {
    return true
  }

  onChange (event, newValue) {
    if (this.isValid(newValue)) {
      SetBackgroundCustomImageMutation.commit(
        this.props.relay.environment,
        this.props.user,
        newValue
      )
    }
  }

  render () {
    const { user } = this.props

    const root = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around'
    }

    const gridList = {
      display: 'flex',
      width: '100%'
    }

    const textInput = {
      width: '100%'
    }

    const header = {
      paddingLeft: 0
    }

    const divider = {
      marginBottom: 10
    }

    return (
      <div style={root}>
        <Subheader style={header}>Paste your image source</Subheader>
        <Divider style={divider} />
        <div
          style={gridList}>
          <TextField
            style={textInput}
            defaultValue={user.customImage || ''}
            hintText='Paste here the url to your image'
            onChange={this.onChange.bind(this)}
            />
        </div>
      </div>
    )
  }
}

BackgroundCustomeImagePicker.propTypes = {
  user: PropTypes.object.isRequired
}

export default BackgroundCustomeImagePicker
