const { backend } = require('../../../global-vars')

export default {
  // Endpoints
  loginEndpoint: `${backend}/login`,
  // loginEndpoint: '/jwt/login',
  registerEndpoint: `${backend}/register`,
  // registerEndpoint: '/jwt/register',
  refreshEndpoint: `${backend}/token`,
  logoutEndpoint: `${backend}/logout`,

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
}
