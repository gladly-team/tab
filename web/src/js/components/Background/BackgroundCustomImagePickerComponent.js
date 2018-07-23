import React from 'react'
import PropTypes from 'prop-types'

import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {
  cardHeaderSubtitleStyle
} from 'theme/default'
import brokenImage from 'assets/nopicture.jpg'

class BackgroundCustomeImagePicker extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      image: null
    }
  }

  componentDidMount () {
    const { user } = this.props
    if (user.customImage) {
      this.setState({
        image: user.customImage
      })
      this.updateUserCustomImg(user.customImage)
    }
  }

  // TODO: could validate URI and have separate error message.
  isValid (value) {
    return true
  }

  onChange (event, newValue) {
    if (this.isValid(newValue)) {
      this.setState({
        image: newValue
      })
    }
  }

  updateUserCustomImg (imgURL) {
    this.props.onCustomImageSelection(imgURL)
  }

  clear () {
    this.imgLink.input.value = ''
    this.setState({
      image: null
    })
  }

  onImgLoaded () {
    const { user } = this.props
    if (this.state.image && this.state.image !== user.customImage) {
      this.updateUserCustomImg(this.state.image)
    }
  }

  onErrorLoadingImg () {
    this.props.showError('Could not load that image.')
    this.setState({
      image: null
    })
  }

  render () {
    const image = this.state.image || brokenImage

    const root = {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    }

    const textInput = {
      fontSize: 14,
      width: '100%'
    }

    const column1 = {
      flex: 1,
      paddingRight: 30
    }

    const column2 = {
      flex: 1
    }

    const header = Object.assign({}, cardHeaderSubtitleStyle, {
      paddingLeft: 0
    })

    const preview = {
      height: 'auto',
      transform: 'translateY(-0%)',
      position: 'relative',
      left: 0,
      width: '100%',
      top: 0
    }

    const clear = {
      margin: 5,
      marginLeft: 0
    }

    return (
      <div style={root}>
        <div
          style={column1}>
          <Subheader style={header}>Enter an image URL</Subheader>
          <TextField
            ref={(input) => { this.imgLink = input }}
            style={textInput}
            value={this.state.image || ''}
            hintText='Image URL'
            onChange={this.onChange.bind(this)} />
          <RaisedButton
            label='CLEAR'
            onClick={this.clear.bind(this)}
            default
            style={clear} />
        </div>
        <div style={column2}>
          <img
            alt={'Preview of your custom background'}
            onLoad={this.onImgLoaded.bind(this)}
            onError={this.onErrorLoadingImg.bind(this)}
            style={preview}
            src={image} />
        </div>
      </div>
    )
  }
}

BackgroundCustomeImagePicker.propTypes = {
  user: PropTypes.shape({
    customImage: PropTypes.string.isRequired
  }),
  showError: PropTypes.func.isRequired,
  onCustomImageSelection: PropTypes.func.isRequired
}

export default BackgroundCustomeImagePicker
