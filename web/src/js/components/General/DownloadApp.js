import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { getUrlParameters, setReferralData } from 'js/utils/utils'
import { goToLogin } from 'js/navigation/navigation'

class DownloadApp extends React.Component {
  componentDidMount() {
    const params = getUrlParameters()
    setReferralData(params)
  }

  onAppDownload() {
    goToLogin()
  }

  render() {
    const root = {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }

    const style = {
      margin: 12,
    }

    return (
      <div style={root}>
        <RaisedButton
          label="Get Tab Now!"
          secondary
          style={style}
          onClick={this.onAppDownload.bind(this)}
        />
      </div>
    )
  }
}

export default DownloadApp
