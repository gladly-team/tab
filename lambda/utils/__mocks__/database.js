// Mock our database to return data for id 42 but no others
const get_fn = (params) => {
  if (params.Key.UserId == 42) {
    return Promise.resolve({
      Item: {
        UserName: 'fake_user',
        UserId: 42,
        VcCurrent: 350
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
