export default [
  {
    path: '/admin',
    name: 'dashboard-admin',
    component: () => import('@/views/dashboard/analytics/Analytics.vue'),
    meta: {
      resource: 'Admin',
      action: 'read',
      pageTitle: 'Admin Dashboard',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
      ],
    },
  },
  {
    path: '/sports',
    name: 'sports',
    component: () => import('@/views/pages/admin/sports/SportList.vue'),
    meta: {
      resource: 'Admin',
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
    path: '/amenities',
    name: 'amenities',
    component: () => import('@/views/pages/admin/amenities/SportList.vue'),
    meta: {
      resource: 'Admin',
      action: 'read',
      pageTitle: 'Amenities',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Amenities',
          active: true,
        },
      ],
    },
  },
  {
    path: '/turfs/:id',
    name: 'admin-turf',
    component: () => import('@/views/pages/admin/turfs/TurfPage'),
    props: ({ params }) => ({ id: Number.parseInt(params.id, 10) || 0 }),
    meta: {
      resource: 'Admin',
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
    path: '/turfs/edit/:id',
    name: 'admin-turf-edit',
    component: () => import('@/views/pages/admin/turfs/account-setting/AccountSetting.vue'),
    props: ({ params }) => ({ id: Number.parseInt(params.id, 10) || 0 }),
    meta: {
      resource: 'Admin',
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
          text: 'Edit Turf',
          active: true,
        },
      ],
    },
  },
  {
    path: '/turfs-approval',
    name: 'turfs-approval',
    component: () => import('@/views/pages/admin/turfs/Approval.vue'),
    meta: {
      resource: 'Admin',
      action: 'read',
      pageTitle: 'Turfs',
      breadcrumb: [
        {
          text: 'Admin Panel',
        },
        {
          text: 'Turfs Approval',
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
      resource: 'Admin',
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
    path: '/vendors',
    name: 'vendors',
    component: () => import('@/views/pages/admin/vendors/UsersList.vue'),
    meta: {
      resource: 'Admin',
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
      resource: 'Admin',
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
      resource: 'Admin',
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
      resource: 'Admin',
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
