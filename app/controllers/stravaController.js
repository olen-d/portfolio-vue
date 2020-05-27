exports.read_auth_code = (req, res) => {
  if (req.query) {
    const {
      query: { code, scope, state }
    } = req;
    res.write(`<p>${code}, ${scope}, ${state}`);
  } else {
    // TODO: Failed, deal with error.
    res.write("FAIL");
  }
};
