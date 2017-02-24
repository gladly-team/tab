// Mock our database to return data for id 42 but no others
get_fn = (params) => {
  if (params.Key.UserId == 42) {
    return Promise.resolve({ hearts: 100 });
  } else {
    return Promise.reject();
  }
};

module.exports = {
  get: get_fn,
  set: () => Promise.reject(),
}
