export default [
  {
    path: '/sports',
    name: 'sports',
    component: () => import('@/views/pages/admin/sports/UsersList.vue'),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Sports',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Sports',
          active: true,
        },
      ],
    },
  },
  {
    path: '/turfs',
    name: 'turfs',
    component: () => import('@/views/pages/admin/turfs/UsersList.vue'),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Turfs',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Turfs',
          active: true,
        },
      ],
    },
  },
  {
    path: '/turfs/:id',
    name: 'turf',
    component: () => import('@/views/pages/admin/turfs/UsersView.vue'),
    meta: {

      resource: 'Auth',
      action: 'read',
      pageTitle: 'Turfs',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Turfs',
        },
        {
          text: 'Turf',
          active: true,
        },
      ],
    },
  },
  {
    path: '/vendors',
    name: 'vendors',
    component: () => import('@/views/pages/admin/vendors/UsersList.vue'),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Vendors',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Vendors',
          active: true,
        },
      ],
    },
  },
  {
    path: '/vendors/:id',
    name: 'vendor',
    component: () => import('@/views/pages/admin/vendors/UsersView.vue'),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Vendors',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Vendors',
        },
        {
          text: 'Profile',
          active: true,
        },
      ],
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/pages/admin/users/UsersView.vue'),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Users',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Turfs',
          active: true,
        },
      ],
    },
  },
  {
    path: '/users/:id',
    name: 'user',
    component: () => import('@/views/pages/admin/users/UsersView.vue'),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Turfs',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Users',
        },
        {
          text: 'Profile',
          active: true,
        },
      ],
    },
  },
]
