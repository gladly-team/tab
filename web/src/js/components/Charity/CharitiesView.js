import React from 'react';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';

import CharitiesContainer from './CharitiesContainer';

class CharitiesView extends React.Component { 
  render() {
    return (
        <QueryRenderer
          environment={environment}
          query={graphql`
            query CharitiesViewQuery {
              app {
                ...CharitiesContainer_app
              }
            }
          `}
          render={({error, props}) => {
            if (props) {
              return (
                  <CharitiesContainer 
                    app={props.app}/>
              )
            } else {
              return (<h1>Loading Charities</h1>);
            }
          }}/>
    );
  }
}

export default CharitiesView;
