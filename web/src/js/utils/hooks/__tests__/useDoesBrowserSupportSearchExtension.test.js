import { renderHook } from '@testing-library/react-hooks'
import useDoesBrowserSupportSearchExtension from 'js/utils/hooks/useDoesBrowserSupportSearchExtension'
import useBrowserInfo from 'js/utils/hooks/useBrowserInfo'

// Let's choose not to mock other browser detection utils.
jest.mock('js/utils/hooks/useBrowserInfo')

beforeEach(() => {
  useBrowserInfo.mockReturnValue({
    name: 'chrome',
    os: 'Mac OS',
    type: 'browser',
    version: '58.0.3029',
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('useDoesBrowserSupportSearchExtension', () => {
  it('passes the user agent to useBrowserInfo, if provided', () => {
    const mockUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0'
    renderHook(() =>
      useDoesBrowserSupportSearchExtension({ userAgent: mockUserAgent })
    )
    expect(useBrowserInfo).toHaveBeenCalledWith({ userAgent: mockUserAgent })
  })

  it('returns false if no browser could be detected', () => {
    useBrowserInfo.mockReturnValue(undefined)
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns true on Chrome', () => {
    useBrowserInfo.mockReturnValue({
      name: 'chrome',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(true)
  })

  it('returns true on Chrome iOS', () => {
    useBrowserInfo.mockReturnValue({
      name: 'crios',
      os: 'iPhone',
      type: 'browser',
      version: '8.10.3',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(true)
  })

  it('returns true on Firefox', () => {
    useBrowserInfo.mockReturnValue({
      name: 'firefox',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(true)
  })

  it('returns false on Edge', () => {
    useBrowserInfo.mockReturnValue({
      name: 'edge',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns false on Edge Chromium', () => {
    useBrowserInfo.mockReturnValue({
      name: 'edge-chromium',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns false on Edge iOS', () => {
    useBrowserInfo.mockReturnValue({
      name: 'edge-ios',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns false on Safari', () => {
    useBrowserInfo.mockReturnValue({
      name: 'safari',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns false on Opera', () => {
    useBrowserInfo.mockReturnValue({
      name: 'opera',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })
})
