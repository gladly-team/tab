import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
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
    RedditShareButtonProps,
    TumblrShareButtonProps,
    TwitterShareButtonProps,
    url,
    iconSize,
  } = props
  // Note: hashtags for Facebook and Twitter are hardcoded.
  // We may want to move them server-side if we use them often.
  return (
    <div className={classes.root}>
      {FacebookShareButtonProps ? (
        <div className={classes.button}>
          <FacebookShareButton
            {...FacebookShareButtonProps}
            url={url}
            // TODO: remove
            hashtag={'tabsTransformed'}
          >
            <FacebookIcon size={iconSize} round />
          </FacebookShareButton>
        </div>
      ) : null}
      {TwitterShareButtonProps ? (
        <div className={classes.button}>
          <TwitterShareButton
            {...TwitterShareButtonProps}
            url={url}
            // TODO: remove
            hashtags={['tabsTransformed']}
          >
            <TwitterIcon size={iconSize} round />
          </TwitterShareButton>
        </div>
      ) : null}
      {RedditShareButtonProps ? (
        <div className={classes.button}>
          <RedditShareButton {...RedditShareButtonProps} url={url}>
            <RedditIcon size={iconSize} round />
          </RedditShareButton>
        </div>
      ) : null}
      {TumblrShareButtonProps ? (
        <div className={classes.button}>
          <TumblrShareButton {...TumblrShareButtonProps} url={url}>
            <TumblrIcon size={iconSize} round />
          </TumblrShareButton>
        </div>
      ) : null}
      {EmailShareButtonProps ? (
        <div className={classes.button}>
          <EmailShareButton {...EmailShareButtonProps} url={url}>
            <EmailIcon size={iconSize} round />
          </EmailShareButton>
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
  RedditShareButtonProps: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  TumblrShareButtonProps: PropTypes.shape({
    title: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
  }),
  TwitterShareButtonProps: PropTypes.shape({
    title: PropTypes.string.isRequired,
    via: PropTypes.string,
    hashtags: PropTypes.arrayOf(PropTypes.string),
    related: PropTypes.arrayOf(PropTypes.string),
  }),
  url: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
}

SocialShare.defaultProps = {
  iconSize: 32,
}

export default withStyles(styles)(SocialShare)
