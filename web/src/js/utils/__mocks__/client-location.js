/* eslint-env jest */
// export const getCountry = () => Promise.resolve('US')

// export const isInEuropeanUnion = () => Promise.resolve(false)

export const getCountry = jest.fn(async () => 'US')

export const isInEuropeanUnion = jest.fn(async () => false)
