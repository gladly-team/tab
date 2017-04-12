import React from 'react';
import relayTestUtils from 'relay-test-utils';
import { mount } from 'enzyme';
import CharitiesContainer from '../CharitiesContainer';
 
const fixtures = {
  viewer: {
  	charities: {
  		edges: [ 
	  		{
	  			node:{
		  			id: 'charity1',
		  			name: 'charity1_name',
		  			category: 'charity1_category',
		  		}
	  		},
	  		{
	  			node:{
		  			id: 'charity2',
		  			name: 'charity2_name',
		  			category: 'charity2_category',
		  		}
	  		},
	  		{
	  			node:{
		  			id: 'charity3',
		  			name: 'charity3_name',
		  			category: 'charity3_category',
		  		}
	  		}
	  	]
  	}
  }
};

function setup(state) {

  	
  
	const output = mount(
	    relayTestUtils.relayWrap(<CharitiesContainer {...fixtures} />)
	  );

	return {
	  output: output,
	};
}

describe('CharitiesContainer', function() {
    it('should render without error', function() {
      var { output } = setup();
      expect(output.find('ul').children()).toHaveLength(
      	fixtures.viewer.charities.edges.length);
    });
});
