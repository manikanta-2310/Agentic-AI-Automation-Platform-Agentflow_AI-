function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

function notFoundHandler(req, res) {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');

  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
