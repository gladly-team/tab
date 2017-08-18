import React from 'react'
import PropTypes from 'prop-types'
import SetBackgroundImageMutation from 'mutations/SetBackgroundImageMutation'

import {GridList, GridTile} from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

class BackgroundImagePicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedImage: null
    }
  }

  componentDidMount () {
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

  onImageSelected (image) {
    this.setState({
      selectedImage: image
    })

    SetBackgroundImageMutation.commit(
      this.props.relay.environment,
      this.props.user,
      image
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

    const header = {
      paddingLeft: 0
    }

    const divider = {
      marginBottom: 10
    }

    return (
      <div style={root}>
        <Subheader style={header}>Select your photo</Subheader>
        <Divider style={divider} />
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
                subtitle={<span>by <b>{'Gladly'}</b></span>}
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
  user: PropTypes.object.isRequired
}

export default BackgroundImagePicker
