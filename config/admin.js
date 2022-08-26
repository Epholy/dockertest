module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'a223e98fc311cc37348e6080efd3a930'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
});
