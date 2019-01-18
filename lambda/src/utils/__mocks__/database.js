// Mock our database.
const getFn = params => {
  if (params.Key.id === "abc123") {
    return Promise.resolve({
      Item: {
        username: "fake_user",
        id: "abc123",
        vcCurrent: 350
      }
    });
  }
  return Promise.reject(new Error());
};

module.exports = {
  get: getFn,
  set: () => Promise.reject(new Error())
};
