/* eslint-env jest */

beforeEach(() => {
  jest.resetModules()
})

describe('localBkgStorageMgr', () => {
  it('loads the expected object', () => {
    jest.mock('../localstorage-mgr', () => {
      return {
        getItem: (key) => {
          switch (key) {
            case 'background-option':
              return 'photo'
            case 'background-color':
              return '#FF0000'
            case 'background-image-url':
              return 'https://static.example.com/my-img.png'
            case 'custom-image':
              return 'https://static.foo.com/some-img.png'
            default:
              return undefined
          }
        }
      }
    })
    const localBkgStorageMgr = require('../local-bkg-settings').default
    expect(localBkgStorageMgr.getLocalBkgSettings()).toEqual({
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://static.example.com/my-img.png'
      },
      backgroundOption: 'photo',
      customImage: 'https://static.foo.com/some-img.png'
    })
  })

  it('catches errors', () => {
    jest.spyOn(console, 'log')
      .mockImplementationOnce(() => {})
    jest.mock('../localstorage-mgr', () => {
      return {
        getItem: (key) => {
          throw new Error('Oops.')
        }
      }
    })
    const localBkgStorageMgr = require('../local-bkg-settings').default
    localBkgStorageMgr.getLocalBkgSettings()
  })

  it('does not updates local storages as expected', () => {
    const user = {
      backgroundColor: '#FF0000',
      backgroundImage: {
        // This has changed.
        imageURL: 'https://static.example.com/a-new-image-yay.png'
      },
      backgroundOption: 'photo',
      customImage: 'https://static.foo.com/some-img.png'
    }

    jest.mock('../localstorage-mgr', () => {
      return {
        getItem: (key) => {
          switch (key) {
            case 'background-option':
              return 'photo'
            case 'background-color':
              return '#FF0000'
            case 'background-image-url':
              return 'https://static.example.com/my-img.png'
              // return 'https://static.example.com/a-new-image-yay.png' // wrong
            case 'custom-image':
              return 'https://static.foo.com/some-img.png'
            default:
              return undefined
          }
        }
      }
    })
    const localBkgStorageMgr = require('../local-bkg-settings').default
    expect(localBkgStorageMgr
      .shouldUpdateLocalBkgSettings(user)).toBe(true)
  })

  it('does not update local storage unnecessarily', () => {
    const user = {
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://static.example.com/my-img.png'
      },
      backgroundOption: 'photo',
      customImage: 'https://static.foo.com/some-img.png'
    }

    jest.mock('../localstorage-mgr', () => {
      return {
        getItem: (key) => {
          switch (key) {
            case 'background-option':
              return 'photo'
            case 'background-color':
              return '#FF0000'
            case 'background-image-url':
              return 'https://static.example.com/my-img.png'
            case 'custom-image':
              return 'https://static.foo.com/some-img.png'
            default:
              return undefined
          }
        }
      }
    })
    const localBkgStorageMgr = require('../local-bkg-settings').default
    expect(localBkgStorageMgr
      .shouldUpdateLocalBkgSettings(user)).toBe(false)
  })

  it('writes to local storage as expected', () => {
    const user = {
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://static.example.com/my-img.png'
      },
      backgroundOption: 'photo',
      customImage: 'https://static.foo.com/some-img.png'
    }

    const mockSetItem = jest.fn()
    jest.mock('../localstorage-mgr', () => {
      return {
        setItem: mockSetItem
      }
    })
    const localBkgStorageMgr = require('../local-bkg-settings').default
    localBkgStorageMgr.setLocalBkgSettings(user)
    expect(mockSetItem).toHaveBeenCalledWith('background-image-url',
      'https://static.example.com/my-img.png')
    expect(mockSetItem).toHaveBeenCalledWith('background-color',
     '#FF0000')
    expect(mockSetItem).toHaveBeenCalledWith('custom-image',
      'https://static.foo.com/some-img.png')
    expect(mockSetItem).toHaveBeenCalledWith('background-option', 'photo')
  })
})
