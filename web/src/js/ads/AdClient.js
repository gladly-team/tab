/* global googletag */

import { NotImplementedException } from '../utils/exceptions'
import { getActiveAdServerName } from './activeAdClient'

class AdClientBase {
  defineAdSlot (adSlot, dimensions, adId) {
    throw new NotImplementedException()
  }

  fetchAds () {
    throw new NotImplementedException()
  }

  displayAd (adId) {
    throw new NotImplementedException()
  }
}

export class DFP extends AdClientBase {
  defineAdSlot (adSlot, dimensions, adId) {
    googletag.cmd.push(function () {
      googletag.defineSlot(adSlot, dimensions, adId)
        .addService(googletag.pubads())
    })
  }

  fetchAds () {
    // Start ad fetching.
    // This should happen after all slots are defined via
    // `googletag.defineSlot`.
    googletag.pubads().enableSingleRequest()
    googletag.enableServices()
  }

  displayAd (adId) {
    googletag.cmd.push(function () {
      googletag.display(adId)
    })
  }
}

export class MockAdClient extends AdClientBase {
  defineAdSlot (adSlot, dimensions, adId) {
    console.log('Mock ad server: defineAdSlot')
  }

  fetchAds () {
    console.log('Mock ad server: fetchAds')
  }

  displayAd (adId) {
    console.log('Mock ad server: displayAd')

    // Mock returning an ad.
    const mockNetworkDelayMs = 1200
    setTimeout(() => {
      const elem = document.getElementById(adId)
      elem.setAttribute('style', `
        color: white;
        background: repeating-linear-gradient(
          -55deg,
          #222,
          #222 20px,
          #333 20px,
          #333 40px
        );
        width: 100%;
        height: 100%;
      `)
    }, mockNetworkDelayMs)
  }
}

let adServer
const adServerName = getActiveAdServerName()

switch (adServerName) {
  case 'mock':
    adServer = new MockAdClient()
    break
  case 'dfp':
    adServer = new DFP()
    break
  default:
    throw new Error(`Ad server name ${adServerName} not recognized.`)
}

export default adServer
