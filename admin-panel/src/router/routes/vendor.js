export default [
  {
    path: '/create-profile',
    name: 'vendor-create-profile',
    component: () => import('@/views/pages/vendor/account-setting/AccountSetting'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Create Profile',
      breadcrumb: [
        {
          text: 'Vendor Panel',
        },
        {
          text: 'Create Profile',
          active: true,
        },
      ],
    },
  },
  {
    path: '/vendor/turfs',
    name: 'vendor-turfs',
    component: () => import('@/views/pages/vendor/turfs/UsersList.vue'),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Turfs',
      breadcrumb: [
        {
          text: 'Vendor Panel',
        },
        {
          text: 'Turfs',
          active: true,
        },
      ],
    },
  },
  {
    path: '/vendor/bookings',
    name: 'vendor-bookings',
    component: () => import('@/views/pages/vendor/bookings/Calendar'),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Bookings',
      breadcrumb: [
        {
          text: 'Vendor Panel',
        },
        {
          text: 'Bookings',
          active: true,
        },
      ],
    },
  },
  {
    path: '/vendor/turfs/:id',
    name: 'vendor-turf',
    component: () => import('@/views/pages/vendor/turfs/UsersView.vue'),
    props: ({ params }) => ({ id: Number.parseInt(params.id, 10) || 0 }),
    meta: {
      resource: 'Auth',
      action: 'read',
      pageTitle: 'Turfs',
      breadcrumb: [
        {
          text: 'Vendor Panel',
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
    path: '/vendor/turfs/edit/:id',
    name: 'vendor-turf-edit',
    component: () => import('@/views/pages/vendor/turfs/account-setting/AccountSetting.vue'),
    props: ({ params }) => ({ id: Number.parseInt(params.id, 10) || 0 }),
    meta: {
      pageTitle: 'Turfs',
      breadcrumb: [
        {
          text: 'Vendor Panel',
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
]
