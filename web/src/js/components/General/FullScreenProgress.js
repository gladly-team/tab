
import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

class FullScreenProgress extends React.Component { 
  render() {
	    
	    const {containerStyle, progressStyle} = this.props;
            
        return (
        	<div 
        		style={containerStyle}>
        			<CircularProgress 
        				{...progressStyle}/>
        	</div>);
  }
}

FullScreenProgress.propTypes = {
  containerStyle: React.PropTypes.object,
  progressStyle: React.PropTypes.object,
};

FullScreenProgress.defaultProps = {
  containerStyle: {
  		width: '100vw',
	  height: '100vh',
	  display: 'flex',
	  justifyContent: 'center',
	  alignItems: 'center'
  },

  progressStyle: {
  	size: 60,
	thickness: 7
  }
};



export default FullScreenProgress;
