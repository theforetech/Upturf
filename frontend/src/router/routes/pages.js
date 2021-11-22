export default [
  {
    path: '/access-control',
    name: 'access-control',
    component: () => import('@/views/extensions/acl/AccessControl.vue'),
    meta: {
      resource: 'ACL',
      action: 'read',
    },
  },
  {
    path: '/redirect-to-dashboard',
    name: 'redirect-to-dashboard',
    component: () => import('@/views/pages/authentication/RefreshLogin.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/callback',
    name: 'auth-callback',
    component: () => import('@/views/pages/authentication/Callback.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/profile-form',
    name: 'profile-form',
    component: () => import('@/views/pages/forms/profile-form.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/pages/authentication/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/register',
    name: 'auth-register',
    component: () => import('@/views/pages/authentication/Register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/pages/miscellaneous/coming-soon',
    name: 'misc-coming-soon',
    component: () => import('@/views/pages/miscellaneous/ComingSoon.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/not-authorized',
    name: 'misc-not-authorized',
    component: () => import('@/views/pages/miscellaneous/NotAuthorized.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/pages/miscellaneous/under-maintenance',
    name: 'misc-under-maintenance',
    component: () => import('@/views/pages/miscellaneous/UnderMaintenance.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/error',
    name: 'misc-error',
    component: () => import('@/views/pages/miscellaneous/Error.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/turf/:id',
    name: 'pages-turf',
    component: () => import('@/views/pages/components/Turf-page/TurfPage.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/pages/components/Home.vue'),
    meta: {
      header: true,
      search: true,
      filters: false,
    },
  },
  {
    path: '/categories',
    name: 'pages-categories',
    component: () => import('@/views/pages/components/Categories.vue'),
    meta: {
      header: true,
      search: true,
      pageTitle: 'Sports',
      breadcrumb: [
        {
          text: 'Pages',
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
    name: 'pages-turfs',
    component: () => import('@/views/pages/components/Turfs.vue'),
    meta: {
      header: true,
      search: true,
      filters: true,
      pageTitle: 'Turfs',
      breadcrumb: [
        {
          text: 'Turfs',
          active: true,
        },
      ],
    },
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('@/views/pages/components/Wishlist.vue'),
    meta: {
      header: true,
      pageTitle: 'Wishlist',
      breadcrumb: [
        {
          text: 'Wishlist',
          active: true,
        },
      ],
    },
  },
  {
    path: '/booking',
    name: 'booking',
    component: () => import('@/views/pages/components/booking/Booking.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Booking',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Booking',
          active: true,
        },
      ],
    },
    props: {
      header: true,
      content: true,
    },
  },
  {
    path: '/bookings',
    name: 'user-bookings',
    component: () => import('@/views/pages/components/user/UserBookings.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Bookings',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Bookings',
          active: true,
        },
      ],
    },
  },
  {
    path: '/summary/:id',
    name: 'pages-summary',
    component: () => import('@/views/pages/components/user/Summary.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Summary',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Summary',
          active: true,
        },
      ],
    },

  },
  {
    path: '/profile',
    name: 'user-profile',
    component: () => import('@/views/pages/components/user/UserProfile.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Profile',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Profile',
          active: true,
        },
      ],
    },

  },

  {
    path: '/search',
    name: 'pages-search',
    component: () => import('@/views/pages/components/Search/Search.vue'),
    meta: {
      pageTitle: '',
      layout: 'full',

      breadcrumb: [
        {
          text: 'Search',
          active: true,
        },
      ],
    },
  },
  {
    path: '/pages/faq',
    name: 'pages-faq',
    component: () => import('@/views/pages/faq/Faq.vue'),
    meta: {
      pageTitle: 'FAQ',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'FAQ',
          active: true,
        },
      ],
    },
  },
  // {
  //   path: '/pages/pricing',
  //   name: 'pages-pricing',
  //   component: () => import('@/views/pages/pricing/Pricing.vue'),
  // // },
  // {
  //   path: '/pages/blog/list',
  //   name: 'pages-blog-list',
  //   component: () => import('@/views/pages/blog/BlogList.vue'),
  //   meta: {
  //     pageTitle: 'Blog List',
  //     breadcrumb: [
  //       {
  //         text: 'Pages',
  //       },
  //       {
  //         text: 'Blog',
  //       },
  //       {
  //         text: 'List',
  //         active: true,
  //       },
  //     ],
  //   },
  // },
  // {
  //   path: '/pages/blog/:id',
  //   name: 'pages-blog-detail',
  //   component: () => import('@/views/pages/blog/BlogDetail.vue'),
  //   meta: {
  //     pageTitle: 'Blog Detail',
  //     breadcrumb: [
  //       {
  //         text: 'Pages',
  //       },
  //       {
  //         text: 'Blog',
  //       },
  //       {
  //         text: 'Detail',
  //         active: true,
  //       },
  //     ],
  //   },
  // },
  // {
  //   path: '/pages/blog/edit/:id',
  //   name: 'pages-blog-edit',
  //   component: () => import('@/views/pages/blog/BlogEdit.vue'),
  //   meta: {
  //     pageTitle: 'Blog Edit',
  //     breadcrumb: [
  //       {
  //         text: 'Pages',
  //       },
  //       {
  //         text: 'Blog',
  //       },
  //       {
  //         text: 'Edit',
  //         active: true,
  //       },
  //     ],
  //   },
  // },
]
