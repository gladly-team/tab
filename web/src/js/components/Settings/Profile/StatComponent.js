import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import { alternateAccentColor } from 'theme/default'

class Stat extends React.Component {
  render () {
    const containerStyle = Object.assign({}, {
      paddingTop: 40,
      paddingBottom: 40,
      minWidth: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'middle'
    }, this.props.style)
    const statStyle = {
      color: alternateAccentColor,
      display: 'block',
      fontSize: 50,
      textAlign: 'center'
    }
    const statTextStyle = {
      display: 'block',
      textAlign: 'center',
      maxWidth: '70%'
    }
    const extraContentStyle = {
      display: 'block',
      marginTop: 4,
      minHeight: 16,
      alignSelf: 'center',
      textAlign: 'center'
    }
    return (
      <Paper style={containerStyle}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <span style={statStyle}>{this.props.stat}</span>
          <span style={statTextStyle}>{this.props.statText}</span>
        </span>
        <span style={extraContentStyle}>
          {this.props.extraContent}
        </span>
      </Paper>
    )
  }
}

Stat.propTypes = {
  stat: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  statText: PropTypes.string.isRequired,
  extraContent: PropTypes.element,
  style: PropTypes.object
}

Stat.default = {
  style: {}
}

export default Stat
