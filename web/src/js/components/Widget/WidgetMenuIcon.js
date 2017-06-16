import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import {
  grey300,
} from 'material-ui/styles/colors';

class WidgetMenuIcon extends React.Component {

  constructor(props) {
    super(props);
  }

  onWidgetIconClicked() {
    this.props.onWidgetIconClicked(
      this.props.widget);
  }

  render() {
    const { widget } = this.props;

    return (
        <IconButton 
          onClick={this.onWidgetIconClicked.bind(this)}>
            <FontIcon
              color={grey300}
              hoverColor={'#FFF'}
              className={this.props.iconClassName}/>
        </IconButton>
    );
  }
}

WidgetMenuIcon.propTypes = {
  onWidgetIconClicked: PropTypes.func.isRequired,
  iconClassName: PropTypes.string.isRequired,
  widget: PropTypes.object.isRequired,
};

export default WidgetMenuIcon;
