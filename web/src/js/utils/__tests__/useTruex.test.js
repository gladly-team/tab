import { act, renderHook } from '@testing-library/react-hooks'
import useTruex from 'js/utils/useTrueX'
import { requestAd } from 'js/utils/truex'
import CreateVideoAdLogMutation from 'js/mutations/CreateVideoAdLogMutation'
import LogVideoAdCompleteMutation from 'js/mutations/LogVideoAdCompleteMutation'
import React from 'react'

jest.mock('js/mutations/CreateVideoAdLogMutation')
jest.mock('js/mutations/LogVideoAdCompleteMutation')
jest.mock('js/utils/truex', () => ({
  requestAd: jest.fn(),
}))
beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.clearAllMocks()
})
const defaults = overrides => ({
  truexUserId: 'some-truex-id',
  userId: 'some-user-id',
  videoAdEligible: false,
  open: false,
  adContainer: null,
  ...overrides,
})
const mockRequestAd = {
  onStart: jest.fn(),
  onCredit: jest.fn(),
  onClose: jest.fn(),
  onFinish: jest.fn(),
  onMessage: jest.fn(),
  onError: jest.fn(),
}
const mockRef = <div />
describe('useData', () => {
  it.skip('returns expected variables with initial inputs and null ref', async () => {
    expect.assertions(1)

    requestAd.mockReturnValue({ ad: mockRequestAd, client: jest.fn() })
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults() }
    )
    // Update logic that affects the `useData` state.
    await act(async () => {
      rerender()
      // https://github.com/testing-library/react-hooks-testing-library/issues/14#issuecomment-480225170
      await waitForNextUpdate()
    })
    expect(result.current).toEqual({
      adAvailable: false,
      credited: false,
      error: false,
      status: 'WAITING',
    })
  })

  it.skip('requests an ad and sets status to waiting and user is video ad eligible and ref hasnt mounted', async () => {
    expect.assertions(1)

    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults({ videoAdEligible: true }) }
    )
    await act(async () => {
      rerender()
      // https://github.com/testing-library/react-hooks-testing-library/issues/14#issuecomment-480225170
      await waitForNextUpdate()
    })
    expect(result.current).toEqual({
      adAvailable: true,
      credited: false,
      error: false,
      status: 'READY',
    })
  })

  it('loads ad into ref container when ref mounts', async () => {
    expect.assertions(1)
    const mockLoadActivityIntoContainer = jest.fn()
    requestAd.mockReturnValue({
      ad: mockRequestAd,
      client: { loadActivityIntoContainer: mockLoadActivityIntoContainer },
    })
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults({ videoAdEligible: true }) }
    )
    // initial update.
    await act(async () => {
      rerender()
      // https://github.com/testing-library/react-hooks-testing-library/issues/14#issuecomment-480225170
      await waitForNextUpdate()
    })
    // simulating ref coming in with open
    await act(async () => {
      rerender(
        defaults({ videoAdEligible: true, adContainer: mockRef, open: true })
      )
      // https://github.com/testing-library/react-hooks-testing-library/issues/14#issuecomment-480225170
      await waitForNextUpdate()
    })
    expect(mockLoadActivityIntoContainer).toHaveBeenCalledWith(
      mockRequestAd,
      mockRef
    )
  })

  it('logs when an ad starts and updates the status', async () => {
    expect.assertions(2)
    const mockLoadActivityIntoContainer = jest.fn()
    CreateVideoAdLogMutation.mockReturnValue({
      createVideoAdLog: {
        VideoAdLog: { id: 'ad-id-random' },
      },
    })
    requestAd.mockReturnValue({
      ad: mockRequestAd,
      client: { loadActivityIntoContainer: mockLoadActivityIntoContainer },
    })
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults({ videoAdEligible: true }) }
    )
    // initial update.
    await act(async () => {
      rerender()
      await waitForNextUpdate()
    })
    // simulating ref coming in with open
    await act(async () => {
      rerender(
        defaults({ videoAdEligible: true, adContainer: mockRef, open: true })
      )
      await waitForNextUpdate()
    })
    // simulating firing start callback
    await act(async () => {
      await mockRequestAd.onStart.mock.calls[2][0]()
    })
    expect(CreateVideoAdLogMutation).toHaveBeenCalledWith({
      userId: 'some-user-id',
    })
    expect(result.current).toEqual({
      adAvailable: true,
      credited: false,
      error: false,
      status: 'STARTED',
    })
  })

  it('resets when a user closes the ad', async () => {
    expect.assertions(2)
    const mockLoadActivityIntoContainer = jest.fn()

    CreateVideoAdLogMutation.mockReturnValue({
      createVideoAdLog: {
        VideoAdLog: { id: 'ad-id-random' },
      },
    })
    requestAd.mockReturnValue({
      ad: mockRequestAd,
      client: { loadActivityIntoContainer: mockLoadActivityIntoContainer },
    })
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults({ videoAdEligible: true }) }
    )
    // initial update.
    await act(async () => {
      rerender()
      await waitForNextUpdate()
    })
    // simulating ref coming in with open
    await act(async () => {
      rerender(
        defaults({ videoAdEligible: true, adContainer: mockRef, open: true })
      )
      await waitForNextUpdate()
    })
    // simulating firing start callback
    await act(async () => {
      await mockRequestAd.onStart.mock.calls[2][0]()
    })
    expect(result.current).toEqual({
      adAvailable: true,
      credited: false,
      error: false,
      status: 'STARTED',
    })
    // simulating closing
    await act(async () => {
      rerender(
        defaults({ videoAdEligible: true, adContainer: mockRef, open: false })
      )
      await waitForNextUpdate()
    })
    expect(result.current).toEqual({
      adAvailable: true,
      credited: false,
      error: false,
      status: 'READY',
    })
  })

  it('correctly returns status and ad availibility if fetch ads does not return', async () => {
    expect.assertions(1)
    const mockLoadActivityIntoContainer = jest.fn()

    CreateVideoAdLogMutation.mockReturnValue({
      createVideoAdLog: {
        VideoAdLog: { id: 'ad-id-random' },
      },
    })
    requestAd.mockReturnValue({
      ad: undefined,
      client: { loadActivityIntoContainer: mockLoadActivityIntoContainer },
    })
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults({ videoAdEligible: true }) }
    )
    // initial update.
    await act(async () => {
      rerender()
      await waitForNextUpdate()
    })

    expect(result.current).toEqual({
      adAvailable: false,
      credited: false,
      error: false,
      status: 'READY',
    })
  })

  it('returns an error when onError is fired', async () => {
    expect.assertions(1)
    const mockLoadActivityIntoContainer = jest.fn()
    CreateVideoAdLogMutation.mockReturnValue({
      createVideoAdLog: {
        VideoAdLog: { id: 'ad-id-random' },
      },
    })
    requestAd.mockReturnValue({
      ad: mockRequestAd,
      client: { loadActivityIntoContainer: mockLoadActivityIntoContainer },
    })
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults({ videoAdEligible: true }) }
    )
    // initial update.
    await act(async () => {
      rerender()
      await waitForNextUpdate()
    })
    // simulating ref coming in with open
    await act(async () => {
      rerender(
        defaults({ videoAdEligible: true, adContainer: mockRef, open: true })
      )
      await waitForNextUpdate()
    })
    // simulating firing start callback
    await act(async () => {
      await mockRequestAd.onStart.mock.calls[2][0]()
    })
    // simulating ad throwing an error
    await act(async () => {
      await mockRequestAd.onError.mock.calls[2][0]()
    })
    expect(result.current).toEqual({
      adAvailable: true,
      credited: false,
      error: true,
      status: 'STARTED',
    })
  })

  it('logs when an ad starts and then correctly logs when an ad credits and completes successfully', async () => {
    expect.assertions(3)
    const mockLoadActivityIntoContainer = jest.fn()
    CreateVideoAdLogMutation.mockReturnValue({
      createVideoAdLog: {
        VideoAdLog: { id: 'ad-id-random' },
      },
    })
    LogVideoAdCompleteMutation.mockReturnValue({
      logVideoAdComplete: {
        success: true,
      },
    })
    requestAd.mockReturnValue({
      ad: mockRequestAd,
      client: { loadActivityIntoContainer: mockLoadActivityIntoContainer },
    })
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults({ videoAdEligible: true }) }
    )
    // initial update.
    await act(async () => {
      rerender()
      await waitForNextUpdate()
    })
    // simulating ref coming in with open
    await act(async () => {
      rerender(
        defaults({ videoAdEligible: true, adContainer: mockRef, open: true })
      )
      await waitForNextUpdate()
    })
    // simulating firing start callback
    await act(async () => {
      await mockRequestAd.onStart.mock.calls[2][0]()
    })
    // simulate on credit
    await act(async () => {
      await mockRequestAd.onCredit.mock.calls[3][0]({
        ad: { creative_id: 'some-creative-id' },
        key: 'some-key',
        signature: 'some-signature',
        signature_argument_string: 'some-signature-string',
      })
    })
    expect(LogVideoAdCompleteMutation).toHaveBeenCalledWith({
      signature: 'some-signature',
      signatureArgumentString: 'some-signature-string',
      truexAdId: 'some-key',
      truexCreativeId: 'some-creative-id',
      userId: 'some-user-id',
      videoAdId: 'ad-id-random',
    })
    expect(result.current).toEqual({
      adAvailable: true,
      credited: true,
      error: false,
      status: 'STARTED',
    })
    //complete ad
    await act(async () => {
      await mockRequestAd.onFinish.mock.calls[4][0]()
    })
    expect(result.current).toEqual({
      adAvailable: true,
      credited: true,
      error: false,
      status: 'COMPLETED',
    })
  })

  it('returns an error if logVideoAdComplete Mutation returns an error', async () => {
    expect.assertions(2)
    const mockLoadActivityIntoContainer = jest.fn()
    CreateVideoAdLogMutation.mockReturnValue({
      createVideoAdLog: {
        VideoAdLog: { id: 'ad-id-random' },
      },
    })
    LogVideoAdCompleteMutation.mockReturnValue({
      logVideoAdComplete: {
        success: false,
      },
    })
    requestAd.mockReturnValue({
      ad: mockRequestAd,
      client: { loadActivityIntoContainer: mockLoadActivityIntoContainer },
    })
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useTruex(props),
      { initialProps: defaults({ videoAdEligible: true }) }
    )
    // initial update.
    await act(async () => {
      rerender()
      await waitForNextUpdate()
    })
    // simulating ref coming in with open
    await act(async () => {
      rerender(
        defaults({ videoAdEligible: true, adContainer: mockRef, open: true })
      )
      await waitForNextUpdate()
    })
    // simulating firing start callback
    await act(async () => {
      await mockRequestAd.onStart.mock.calls[2][0]()
    })
    // simulate on credit
    await act(async () => {
      await mockRequestAd.onCredit.mock.calls[3][0]({
        ad: { creative_id: 'some-creative-id' },
        key: 'some-key',
        signature: 'some-signature',
        signature_argument_string: 'some-signature-string',
      })
    })
    expect(LogVideoAdCompleteMutation).toHaveBeenCalledWith({
      signature: 'some-signature',
      signatureArgumentString: 'some-signature-string',
      truexAdId: 'some-key',
      truexCreativeId: 'some-creative-id',
      userId: 'some-user-id',
      videoAdId: 'ad-id-random',
    })
    expect(result.current).toEqual({
      adAvailable: true,
      credited: false,
      error: true,
      status: 'STARTED',
    })
  })
})
