// console log the type and path of each request 

const logger = (req, res, next) => {
      console.log(`${req.method} request to ${req.path}`);
  next();
};

exports.customLogger = logger;
