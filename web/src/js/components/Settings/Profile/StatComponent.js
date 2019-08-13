import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const Stat = props => {
  const { extraContent, stat, statText, style } = props
  return (
    <Paper
      style={{
        paddingTop: 50,
        paddingBottom: 50,
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'middle',
        ...style,
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant={'h2'}
          color={'secondary'}
          style={{ textAlign: 'center' }}
        >
          {stat}
        </Typography>
        <Typography
          variant={'body2'}
          style={{ textAlign: 'center', maxWidth: '70%' }}
        >
          {statText}
        </Typography>
      </span>
      <span
        style={{
          display: 'block',
          marginTop: 4,
          minHeight: 16,
          alignSelf: 'center',
          textAlign: 'center',
        }}
      >
        {extraContent}
      </span>
    </Paper>
  )
}

Stat.propTypes = {
  stat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  statText: PropTypes.string.isRequired,
  extraContent: PropTypes.element,
  style: PropTypes.object,
}

Stat.default = {
  style: {},
}

export default Stat
