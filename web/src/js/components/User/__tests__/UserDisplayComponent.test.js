'use strict';

import React from 'react';
import UserDisplay from '../UserDisplayComponent';
import {shallow} from 'enzyme';

function setup(state) {

  const viewer = {
      username: 'Raul',
      email: 'raul@tfac.com'
  };
  
  const output = shallow(
    <UserDisplay viewer={viewer}></UserDisplay>
  );

  return {
    output: output,
  };
}

describe('UserDisplay', function() {
    it('should render without error', function() {
      var { output } = setup();
      expect(output.find('h1').text()).toBe('Welcome, Raul(raul@tfac.com)');
    });
});


