
// Mock our database.
const get_fn = (params) => {
  if (params.Key.id == 'abc123') {
    return Promise.resolve({
      Item: {
        username: 'fake_user',
        id: 'abc123',
        vcCurrent: 350
      }
    });
  } else {
    return Promise.reject();
  }
};

module.exports = {
  get: get_fn,
  set: () => Promise.reject(),
}
