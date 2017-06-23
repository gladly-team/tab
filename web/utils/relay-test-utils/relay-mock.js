
export default function relayMock (Relay) {
  class Mutation extends Relay.Mutation {
    constructor (props) {
      super(props)
      this.props = props
    }
    _resolveProps (props) {
      this.props = props
    }
  }

  class MockStore {
    reset () {
      this.successResponse = undefined
      this.failureResponse = undefined
      this.spyCommitUpdate = undefined
      this.spyApplyUpdate = undefined
    }

    mockCommitUpdate (spy) {
      this.spyCommitUpdate = spy
    }

    mockApplyUpdate (spy) {
      this.spyApplyUpdate = spy
    }

    succeedWith (response) {
      this.reset()
      this.successResponse = response
    }

    failWith (response) {
      this.reset()
      this.failureResponse = response
    }

    update (callbacks) {
      if (this.successResponse) {
        callbacks.onSuccess(this.successResponse)
      } else if (this.failureResponse) {
        callbacks.onFailure(this.failureResponse)
      }
      this.reset()
    }

    commitUpdate (mutation, callbacks) {
      if (this.spyCommitUpdate) {
        this.spyCommitUpdate(mutation, callbacks)
      }
      return this.update(callbacks)
    }

    applyUpdate (mutation, callbacks) {
      if (this.spyApplyUpdate) {
        this.spyApplyUpdate(mutation, callbacks)
      }
      return this.update(callbacks)
    }
  }

  const Store = new MockStore()
  const Route = Relay.Route
  const PropTypes = Relay.PropTypes

  return {
    QL: Relay.QL,
    Mutation,
    Route,
    PropTypes,
    Store,
    createContainer: (component, specs) => {
      /* eslint no-param-reassign:0 */
      component.getRelaySpecs = () => specs
      return component
    }
  }
}
