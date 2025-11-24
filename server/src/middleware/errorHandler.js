export const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Unexpected server error',
  });
};
