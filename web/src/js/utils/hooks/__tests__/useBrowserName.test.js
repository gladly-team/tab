import { renderHook } from '@testing-library/react-hooks'
import useBrowserName from '../useBrowserName'
import useBrowserInfo from '../useBrowserInfo'

// Let's choose not to mock other browser detection utils.
jest.mock('../useBrowserInfo')

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

describe('useBrowserName', () => {
  it('passes the user agent to useBrowserInfo, if provided', () => {
    const mockUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0'
    renderHook(() => useBrowserName({ userAgent: mockUserAgent }))
    expect(useBrowserInfo).toHaveBeenCalledWith({ userAgent: mockUserAgent })
  })

  it('returns undefined if it has not yet determined the browser', () => {
    useBrowserInfo.mockReturnValue(undefined)
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toBeUndefined()
  })

  it('returns "other" if it is not one of the key browsers we care about', () => {
    useBrowserInfo.mockReturnValue({
      name: 'facebook',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('other')
  })

  it('returns "chrome" on Chrome', () => {
    useBrowserInfo.mockReturnValue({
      name: 'chrome',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('chrome')
  })

  it('returns "chrome" on Chrome iOS', () => {
    useBrowserInfo.mockReturnValue({
      name: 'crios',
      os: 'iPhone',
      type: 'browser',
      version: '8.10.3',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('chrome')
  })

  it('returns "firefox" on Firefox', () => {
    useBrowserInfo.mockReturnValue({
      name: 'firefox',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('firefox')
  })

  it('returns "edge" on Edge', () => {
    useBrowserInfo.mockReturnValue({
      name: 'edge',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('edge')
  })

  it('returns "edge" on Edge Chromium', () => {
    useBrowserInfo.mockReturnValue({
      name: 'edge-chromium',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('edge')
  })

  it('returns "edge" on Edge iOS', () => {
    useBrowserInfo.mockReturnValue({
      name: 'edge-ios',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('edge')
  })

  it('returns "safari" on Safari', () => {
    useBrowserInfo.mockReturnValue({
      name: 'safari',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('safari')
  })

  it('returns "opera" on Opera', () => {
    useBrowserInfo.mockReturnValue({
      name: 'opera',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useBrowserName())
    expect(result.current).toEqual('opera')
  })
})
