module.exports = (ok, message, result) => {
  console.log(message);
  return {
    ok,
    error: message,
    result,
  };
};
