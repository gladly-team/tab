import React from 'react'
import PropTypes from 'prop-types'

import SetBackgroundCustomImageMutation from 'mutations/SetBackgroundCustomImageMutation'

import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'

import brokenImage from 'assets/nopicture.jpg'

class BackgroundCustomeImagePicker extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      image: null,
    }
  }

  componentDidMount () {
    const { user } = this.props
    if (user.customImage) {
      this.setState({
        image: user.customImage,
      })
    }
  }

  isValid (value) {
    return true
  }

  onChange (event, newValue) {
    if (this.isValid(newValue)) {
      this.setState({
        image: newValue,
      })
    }
  }

  updateUserCustomImg(imgUrl) {
    SetBackgroundCustomImageMutation.commit(
      this.props.relay.environment,
      this.props.user,
      imgUrl
    )
  }

  clear() {
    this.imgLink.input.value = ''
    this.setState({
      image: null,
    })
  }

  onImgLoaded() {
    const { user } = this.props
    if(this.state.image && this.state.image !== user.customImage){
      this.updateUserCustomImg(this.state.image)
    }
  }
// http://cdn.wallpapersafari.com/66/6/leY
  onErrorLoadingImg() {
    this.setState({
      image: null,
    })
  }

  render () {
    const { user } = this.props
    const imageUrl = this.state.image || ''
    const image = this.state.image || brokenImage

    const root = {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    }

    const textInput = {
      width: '100%'
    }

    const column1 = {
      width: '50%'
    }

    const column2 = {
      width: '40%'
    }

    const header = {
      paddingLeft: 0
    }

    const divider = {
      marginBottom: 10
    }

    const preview = {
      height: 'auto',
      transform: 'translateY(-0%)',
      position: 'relative',
      left: 0,
      width: '100%',
      top: 0,
    }

    const clear = {
      margin: 5,
      marginLeft: 0,
    }

    return (
      <div style={root}>
        <div 
          style={column1}>
          <Subheader style={header}>Paste your image source</Subheader>
          <TextField
            ref={(input) => { this.imgLink = input }}
            style={textInput}
            value={this.state.image}
            hintText='Paste here the url to your image'
            onChange={this.onChange.bind(this)}/>
          <RaisedButton 
            label="CLEAR" 
            onClick={this.clear.bind(this)}
            secondary={true} 
            style={clear}/>
        </div>
        <div style={column2}>
          <img 
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
  user: PropTypes.object.isRequired
}

export default BackgroundCustomeImagePicker
