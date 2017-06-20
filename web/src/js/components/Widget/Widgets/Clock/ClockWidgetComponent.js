import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { getWidgetConfig } from '../../../../utils/widgets-utils';

import appTheme from 'theme/default';

class ClockWidget extends React.Component {

  constructor(props) {
    super(props);

    this.updateClockInterval = 0;

    this.state = {
        date: '',
        time: '',
        config: {},
    }
  }

  componentDidMount() {
    const self = this;
    this.updateClockInterval = setInterval(() => {
      self.setDateTime(self.state.config);
    }, 1000);

    const { widget } = this.props; 

    const config = JSON.parse(widget.config);
    const settings = JSON.parse(widget.settings);
    const configuration = getWidgetConfig(config, settings);
    this.setState({
      config: configuration,
    });

    this.setDateTime(configuration);
  }

  componentWillUnmount() {
    clearInterval(this.updateClockInterval);
  }

  setDateTime(config) {
    const format24 = config.format24;
    var date = moment().format("ddd, MMMM D");
    var time;
    if(format24) {
      time = moment().format("k:mm");
    } else {
      time = moment().format("h:mm a");
    }

    this.setState({
       date: date,
       time: time,
    });

  }

  render() {
    const clockContainer = {
      marginTop: 20,
      pointerEvents: 'none',
    }

    const timeStyle = {
      color: '#FFF',
      fontSize: '3em',
      fontWeight: 'normal',
      margin: 0,
      fontFamily: appTheme.fontFamily,
    };

    const dateStyle = {
      color: '#FFF',
      margin: 0,
      fontWeight: 'normal',
      fontFamily: appTheme.fontFamily,
    };

    return (
        <div style={clockContainer}>
          <h1 style={timeStyle}>{this.state.time}</h1>
          <h2 style={dateStyle}>{this.state.date}</h2>
        </div>
    );
  }
}

ClockWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default ClockWidget;
