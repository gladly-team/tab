import { renderHook } from '@testing-library/react-hooks'
import { detect } from 'detect-browser'
import useBrowserInfo from '../useBrowserInfo'

jest.mock('detect-browser')

beforeEach(() => {
  detect.mockReturnValue({
    name: 'chrome',
    os: 'Mac OS',
    type: 'browser',
    version: '58.0.3029',
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('useBrowserInfo', () => {
  it('returns undefined on first render when no user agent is provided', () => {
    const { result } = renderHook(() => useBrowserInfo())
    expect(result.all[0]).toBeUndefined()
  })

  it('returns the expected browser info on first render -- with user agent', () => {
    const mockUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0'
    detect.mockReturnValue({
      name: 'firefox',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() =>
      useBrowserInfo({ userAgent: mockUserAgent })
    )
    expect(result.all[0]).toEqual({
      name: 'firefox',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
  })

  it('returns the expected browser info', () => {
    const { result } = renderHook(() => useBrowserInfo())
    expect(result.current).toEqual({
      name: 'chrome',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
  })

  it('modifies the browser info if it is different on mount vs server-side with user agent', () => {
    const mockUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0'
    detect.mockImplementation(userAgent => {
      if (userAgent) {
        return {
          name: 'firefox',
          os: 'Mac OS',
          type: 'browser',
          version: '58.0.3029',
        }
      }
      return {
        name: 'chrome',
        os: 'Mac OS',
        type: 'browser',
        version: '58.0.3029',
      }
    })
    const { result } = renderHook(() =>
      useBrowserInfo({ userAgent: mockUserAgent })
    )
    expect(result.all[0].name).toEqual('firefox')
    expect(result.all[1].name).toEqual('chrome')
  })
})
