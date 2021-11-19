/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
// eslint-disable-next-line import/prefer-default-export
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return { path: '/admin' }
  if (userRole === 'vendor') return { path: '/vendor' }
  return { name: 'access-control' }
}
