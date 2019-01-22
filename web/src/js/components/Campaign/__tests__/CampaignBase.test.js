/* eslint-env jest */

// import React from 'react'
// import { shallow } from 'enzyme'
// import IconButton from '@material-ui/core/IconButton'
// import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'

jest.mock('js/utils/local-user-data-mgr')

// const getMockProps = () => ({
//   showError: () => {},
//   onDismiss: () => {},
// })

describe('Campaign base component', () => {
  it('is a placeholder test', () => {
    expect(true).toBe(true)
  })

  // it('sets the dismiss time in local storage when clicking the "dismiss" button ', () => {
  //   // QueryRenderer.__setQueryResponse({
  //   //   error: null,
  //   //   props: {
  //   //     app: {
  //   //       some: 'value',
  //   //     },
  //   //     user: {
  //   //       id: 'abc123xyz456',
  //   //     },
  //   //   },
  //   //   retry: jest.fn(),
  //   // })

  //   const CampaignBase = require('js/components/Campaign/CampaignBase').default
  //   const mockProps = getMockProps()
  //   const wrapper = shallow(<CampaignBase {...mockProps} />)
  //     .dive()
  //     .dive()
  //   wrapper
  //     .find(IconButton)
  //     .first()
  //     .simulate('click')
  //   expect(setCampaignDismissTime).toHaveBeenCalled()
  // })

  // it('calls the onDismiss prop when clicking the "dismiss" button ', () => {
  //   const CampaignBase = require('js/components/Campaign/CampaignBase').default
  //   const mockProps = getMockProps()
  //   mockProps.onDismiss = jest.fn()
  //   const wrapper = shallow(<CampaignBase {...mockProps} />)
  //     .dive()
  //     .dive()
  //   wrapper
  //     .find(IconButton)
  //     .first()
  //     .simulate('click')
  //   expect(mockProps.onDismiss).toHaveBeenCalled()
  // })
})
