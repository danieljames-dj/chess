// exports.handler = (event, context, callback) => {
//   console.log("Hello World");
// };
exports.handler = async (event) => {
  const response = {
      statusCode: 200,
      body: JSON.stringify('Updated Through Github Action 😁'),
  };
  return response;
};
