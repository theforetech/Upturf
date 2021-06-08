const { backend } = require('../../../global-vars')

export default {
  // Endpoints
  loginEndpoint: `${backend}/user/login`,
  // loginEndpoint: '/jwt/login',
  registerEndpoint: `${backend}/user/register`,
  // registerEndpoint: '/jwt/register',
  refreshEndpoint: `${backend}/user/token`,
  logoutEndpoint: `${backend}/user/logout`,

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
}
