import React from 'react';
import {getUrlParameters, updateReferralData} from 'web-utils';

class DownloadApp extends React.Component {

  componentDidMount() {
    const params = getUrlParameters();
    updateReferralData(params);
  }

  render() {
    const root = {
      width: '100vw',
      height: '100vh',
    };

    return (
      <div style={root}>
        Get Tab Now!
      </div>
    );
  }
}

export default DownloadApp;

