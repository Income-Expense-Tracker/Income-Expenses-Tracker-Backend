const getTokenFromHeader = (req) => {
  const headerObj = req.headers;
  const token = headerObj["authorization"].split(" ")[1];
  if (token !== undefined) {
    return token;
  }
  return {
    status: "Failed",
    message: "There is no token attachedto header",
  };
};

module.exports = getTokenFromHeader;
