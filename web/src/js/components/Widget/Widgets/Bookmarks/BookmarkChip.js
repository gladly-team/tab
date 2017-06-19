import React from 'react';
import PropTypes from 'prop-types';

import RandomAppearAnimation from 'general/RandomAppearAnimation';
import Chip from 'material-ui/Chip';

import appTheme from 'theme/default';

class BookmarkChip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hoveringDelete: false,
    };
  }

  openLink(link) {
    if(this.props.editMode){
      this.props.removeChip(this.props.index);
      return;
    }

    window.open(link, '_self'); 
    this.setState({
      open: false,
    });
  }

  onDeleteBtnMouseMove(enter) {
    this.setState({
      hoveringDelete: enter,
    })
  }

  render() {

    const {bookmark} = this.props;

    const container = {
      display: 'inline',
    }

    var deleteIconColor = (this.state.hoveringDelete)?
                    '#F44336': 'rgba(244,67,54,.5)';

    var chipBackgroundColor = 'rgba(0,0,0,.3)';
    if(this.props.editMode){
      chipBackgroundColor = deleteIconColor;
    }

    const chip = {
      style: {
        margin: 5,
        minWidth: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      labelStyle: {
        width: '100%',
        textAlign: 'center'
      },
      backgroundColor: chipBackgroundColor,
      labelColor: '#FFF'
    }

    const bookmarkName = bookmark.name.length >= 25? 
      bookmark.name.substring(0, 20) + '...': bookmark.name;
    const tooltip = bookmark.name.length >= 25?
      bookmark.name: '';

    const bookmarkChip = (
          <Chip
            key={'bookmark_' + this.props.index}
            backgroundColor={chip.backgroundColor}
            labelColor={chip.labelColor}
            labelStyle={chip.labelStyle}
            style={chip.style}
            onTouchTap={() => {}}
            onClick={this.openLink.bind(this, bookmark.link)}
            onMouseEnter={this.onDeleteBtnMouseMove.bind(this, true)}
            onMouseLeave={this.onDeleteBtnMouseMove.bind(this, false)}>
              {bookmarkName}
          </Chip>);

    return (
          <RandomAppearAnimation
            delayRange={300}>
              {bookmarkChip}
          </RandomAppearAnimation>);
  }
}

BookmarkChip.propTypes = {
  bookmark: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  removeChip: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

BookmarkChip.defaultProps = {
  editMode: false
}

export default BookmarkChip;
