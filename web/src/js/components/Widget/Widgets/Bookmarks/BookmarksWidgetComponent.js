import React from 'react'
import PropTypes from 'prop-types'

import WidgetSharedSpace from 'general/WidgetSharedSpace'
import WidgetScrollSection from '../../WidgetScrollSection'
import EmptyWidgetMsg from '../../EmptyWidgetMsg'
import BookmarkChip from './BookmarkChip'
import AddBookmarkForm from './AddBookmarkForm'
import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation'
import Paper from 'material-ui/Paper'
import {
  alternateAccentColor
} from 'theme/default'

class BookmarksWidget extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bookmarks: []
    }
  }

  componentDidMount () {
    const { widget } = this.props

    // TODO: have the server send obj, not string.
    const data = JSON.parse(widget.data)
    const bookmarks = data.bookmarks || []
    this.setState({
      bookmarks: bookmarks
    })
  }

  getFavicon (link) {
    return 'https://www.google.com/s2/favicons?domain_url=' + encodeURI(link)
  }

  onSaveSuccess () {}

  onSaveError () {
    this.props.showError('Oops, we are having trouble saving your widgets right now :(')
  }

  updateWidget (bookmarks) {
    const widgetData = {
      bookmarks: bookmarks
    }
    const data = JSON.stringify(widgetData)
    UpdateWidgetDataMutation.commit(
      this.props.relay.environment,
      this.props.user,
      this.props.widget,
      data,
      this.onSaveSuccess.bind(this),
      this.onSaveError.bind(this)
    )
  }

  addBookmark (name, link) {
    const newBookmark = {
      name: name,
      link: link
    }
    this.setState({
      bookmarks: [newBookmark, ...this.state.bookmarks]
    }, () => {
      this.updateWidget(this.state.bookmarks)
    })
  }

  removeBookmark (index) {
    this.setState({
      bookmarks: this.state.bookmarks.filter((_, i) => {
        return i !== index
      })
    }, () => {
      this.updateWidget(this.state.bookmarks)
    })
  }

  render () {
    const bookmarks = this.state.bookmarks || []

    const sharedSpaceStyle = {
      overflowX: 'visible',
      overflowY: 'visible',
      overflow: 'visible'
    }

    const wrapper = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    }

    const bookmarksContainer = {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 27
    }

    var nodataMsg
    if (!bookmarks.length) {
      nodataMsg = (
        <EmptyWidgetMsg
          widgetName={'Bookmarks'} />)
    }

    return (<WidgetSharedSpace
      containerStyle={sharedSpaceStyle}>
      <div style={bookmarksContainer}>
        <Paper
          zDepth={0}
          style={{
            width: 200,
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'space-between',
            fontSize: 14,
            margin: 5,
            // background: appTheme.palette.primary1Color,
            background: alternateAccentColor,
            color: '#FFF',
            padding: '12px 8px'
          }}
        >
          <span>Improvements to bookmarks coming soon. </span>
          <a
            href='https://www.facebook.com/notes/tab-for-a-cause/the-new-version-of-tab-for-a-cause-is-live-heres-what-tabbers-are-saying-about-i/1653202238056190/'
            target='_top'
            style={{
              color: '#FFF',
              textDecoration: 'underline'
            }}
          >
            Learn more
          </a>
        </Paper>
        <AddBookmarkForm
          addBookmark={this.addBookmark.bind(this)} />
        <WidgetScrollSection>
          <div style={wrapper}>
            {nodataMsg}
            {
              bookmarks.map((bookmark, index) => {
                return (<BookmarkChip
                  key={index}
                  index={index}
                  bookmark={bookmark}
                  deleteBookmark={this.removeBookmark.bind(this, index)} />
                )
              })
            }
          </div>
        </WidgetScrollSection>
      </div>
    </WidgetSharedSpace>)
  }
}

BookmarksWidget.propTypes = {
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

export default BookmarksWidget
