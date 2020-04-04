import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  // PinterestShareButton,
  // RedditShareButton,
  // TumblrShareButton,
  // TwitterShareButton,
} from 'react-share'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    padding: 4,
  },
})

const SocialShare = props => {
  const {
    classes,
    EmailShareButtonProps,
    FacebookShareButtonProps,
    url,
  } = props
  const iconSize = 32
  return (
    <div className={classes.root}>
      {EmailShareButtonProps ? (
        <div className={classes.button}>
          <EmailShareButton {...EmailShareButtonProps} url={url}>
            <EmailIcon size={iconSize} round />
          </EmailShareButton>
        </div>
      ) : null}
      {FacebookShareButtonProps ? (
        <div className={classes.button}>
          <FacebookShareButton {...FacebookShareButtonProps} url={url}>
            <FacebookIcon size={iconSize} round />
          </FacebookShareButton>
        </div>
      ) : null}
    </div>
  )
}

SocialShare.propTypes = {
  classes: PropTypes.object.isRequired,
  // https://github.com/nygardk/react-share#api
  EmailShareButtonProps: PropTypes.shape({
    subject: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    separator: PropTypes.string,
  }),
  FacebookShareButtonProps: PropTypes.shape({
    quote: PropTypes.string.isRequired,
    hashtag: PropTypes.string,
  }),
  url: PropTypes.string.isRequired,
}

SocialShare.defaultProps = {}

export default withStyles(styles)(SocialShare)
