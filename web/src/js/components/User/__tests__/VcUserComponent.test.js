'use strict';

jest.mock('../UpdateVcMutation');
jest.mock('material-ui/LinearProgress');

import React from 'react';
import Relay from 'react-relay';
import UpdateVcMutation from '../UpdateVcMutation';
import VcUser from '../VcUserComponent';
import {mount} from 'enzyme';

function setup(state) {

  const viewer = {
      nextLevelHearts: {
        hearts: 300,
      },
      vcAllTime: 200,
      level: 2,
      vcCurrent: 50
  };
  
  const output = mount(
    <VcUser viewer={viewer}></VcUser>
  );


  return {
    output: output,
  };
}

describe('VcUser', function() {
    it('should render without error', function() {
      	var { output } = setup();
      	expect(output.find('[data-test-id="current-hearts"]').text()).toBe('50 Hearts');
      	expect(output.find('[data-test-id="tabber-level"]').text()).toBe('Level 2 Tabber');
    });
});


