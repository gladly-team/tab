import React from 'react';
import PropTypes from 'prop-types';

import Chip from 'material-ui/Chip';
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel';

import appTheme from 'theme/default';

class BookmarkChip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hoveringDelete: false,
    };

    this.hideChipDeleteTimer = 0;
  }

  openLink(link) {
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

  removeChip(event) {
    event.stopPropagation();
    event.preventDefault();

    this.props.removeChip(this.props.index);
  }

  render() {
    const {bookmark} = this.props;
    
    const chip = {
      style: {
        margin: 5,
        maxWidth: 300,
      },
      backgroundColor: 'rgba(0,0,0,.3)',
      labelColor: '#FFF',
      deleteIcon: {
        cursor: 'pointer',
        float: 'right',
        margin: '4px -4px 0px 4px',
        hoverColor: appTheme.fontIcon.color,
        color: 'rgba(255,255,255,.3)',
        display: 'inline-block',
      }
    }

    var deleteIconColor = (this.state.hoveringDelete)?
                    chip.deleteIcon.hoverColor: chip.deleteIcon.color;

    const bookmarkName = bookmark.name.length >= 25? 
      bookmark.name.substring(0, 20) + '...': bookmark.name;
    const tooltip = bookmark.name.length >= 25?
      bookmark.name: '';
    return (
        <Chip
          backgroundColor={chip.backgroundColor}
          labelColor={chip.labelColor}
          style={chip.style}
          onTouchTap={() => {}}
          onClick={this.openLink.bind(this, bookmark.link)}>
            {bookmarkName}
            <DeleteIcon
              color={deleteIconColor}
              style={chip.deleteIcon}
              onClick={this.removeChip.bind(this)}
              onMouseEnter={this.onDeleteBtnMouseMove.bind(this, true)}
              onMouseLeave={this.onDeleteBtnMouseMove.bind(this, false)}/>
        </Chip>);
  }
}

BookmarkChip.propTypes = {
  bookmark: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  removeChip: PropTypes.func.isRequired,
};


export default BookmarkChip;
