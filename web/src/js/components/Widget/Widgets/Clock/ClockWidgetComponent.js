import React from 'react';
import moment from 'moment';

import {
  grey300,
} from 'material-ui/styles/colors';

class ClockWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        date: '',
        time: '',
    }
  }

  componentDidMount() {
    this.setDateTime();
    
    const self = this;
    setInterval(() => {
      self.setDateTime();
    }, 1000);
  }

  setDateTime() {
    const { widget } = this.props; 
    const config = JSON.parse(widget.config);
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
    const { widget } = this.props; 

    const clockContainer = {
      textAlign: 'center',
      position: 'absolute',
      width: '100vw',
      pointerEvents: 'none',
    }

    const timeStyle = {
      color: '#FFF',
      fontSize: '3em',
      fontWeight: 'normal',
      margin: 0,
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
    };

    const dateStyle = {
      color: '#FFF',
      margin: 0,
      fontWeight: 'normal',
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
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
  widget: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default ClockWidget;
