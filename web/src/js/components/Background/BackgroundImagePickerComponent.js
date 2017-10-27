import React from 'react'
import PropTypes from 'prop-types'
import SetBackgroundImageMutation from 'mutations/SetBackgroundImageMutation'

import {GridList, GridTile} from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Subheader from 'material-ui/Subheader'
import {
  cardHeaderSubtitleStyle
} from 'theme/default'

class BackgroundImagePicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedImage: null
    }
  }

  componentWillMount () {
    const { app, user } = this.props
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
      this.onImageSelected(image)
    }
  }

  onSaveSuccess () {}

  onSaveError () {
    this.props.showError('Oops, we are having trouble saving your settings right now :(')
  }

  onImageSelected (image) {
    this.setState({
      selectedImage: image
    })

    SetBackgroundImageMutation.commit(
      this.props.relay.environment,
      this.props.user,
      image,
      this.onSaveSuccess.bind(this),
      this.onSaveError.bind(this)
    )
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
                    <FontIcon
                      className={checked ? 'fa fa-check-circle' : 'fa fa-circle-o'}
                      color='white' />
                  </IconButton>}>
                <img src={edge.node.imageURL} />
              </GridTile>)
          })}
        </GridList>
      </div>
    )
  }
}

BackgroundImagePicker.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired
}

export default BackgroundImagePicker
