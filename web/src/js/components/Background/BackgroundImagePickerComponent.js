import React from 'react'
import PropTypes from 'prop-types'

import { get } from 'lodash/object'
import { GridList, GridTile } from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import RadioButtonUncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import Subheader from 'material-ui/Subheader'
import {
  cardHeaderSubtitleStyle
} from 'theme/default'

class BackgroundImagePicker extends React.Component {
  constructor (props) {
    super(props)

    const { app, user } = props
    const selectedImage = user.backgroundImage
    if (selectedImage) {
      var image
      for (var index in app.backgroundImages.edges) {
        var bkgImage = app.backgroundImages.edges[index].node
        if (selectedImage.imageURL === bkgImage.imageURL) {
          image = bkgImage
          break
        }
      }
    } else {
      // If the user's photo does not exist, select the first
      // photo we display.
      image = get(app, 'backgroundImages.edges[0].node') || null
    }

    this.state = {
      selectedImage: image || null
    }
  }

  componentDidMount () {
    // Call the image selection on mount so the parent component
    // can save the background settings.
    if (this.state.selectedImage) {
      this.props.onBackgroundImageSelection(this.state.selectedImage)
    }
  }

  onImageSelected (image) {
    if (!image || !image.id) {
      return
    }
    this.setState({
      selectedImage: image
    })

    this.props.onBackgroundImageSelection(image)
  }

  render () {
    const { app } = this.props
    const root = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around'
    }

    const gridList = {
      width: '100%',
      overflowY: 'auto'
    }

    const header = Object.assign({}, cardHeaderSubtitleStyle, {
      paddingLeft: 0
    })
    return (
      <div style={root}>
        <Subheader style={header}>Select your photo</Subheader>
        <GridList
          cols={3}
          cellHeight={170}
          style={gridList}>
          {app.backgroundImages.edges.map((edge) => {
            const checked = (
              this.state.selectedImage &&
              this.state.selectedImage.id === edge.node.id
            )
            return (
              <GridTile
                key={edge.node.id}
                title={edge.node.name}
                style={{ cursor: 'pointer' }}
                onClick={this.onImageSelected.bind(this, edge.node)}
                actionIcon={
                  <IconButton
                    onClick={this.onImageSelected.bind(this, edge.node)}>
                    {checked
                      ? <CheckCircleIcon color={'white'} />
                      : <RadioButtonUncheckedIcon color={'white'} />
                    }
                  </IconButton>}>
                <img alt={edge.node.name} src={edge.node.thumbnailURL} />
              </GridTile>)
          })}
        </GridList>
      </div>
    )
  }
}

BackgroundImagePicker.propTypes = {
  app: PropTypes.shape({
    backgroundImages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
          imageURL: PropTypes.string,
          thumbnailURL: PropTypes.string
        })
      ).isRequired
    }).isRequired
  }),
  user: PropTypes.shape({
    backgroundImage: PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageURL: PropTypes.string.isRequired
    }).isRequired
  }),
  onBackgroundImageSelection: PropTypes.func.isRequired
}

export default BackgroundImagePicker
