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
]
