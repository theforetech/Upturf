export default [
  {
    path: '/access-control',
    name: 'access-control',
    component: () => import(/* webpackChunkName: "auth" */'@/views/extensions/acl/AccessControl.vue'),
    meta: {
      resource: 'ACL',
      action: 'read',
    },
  },
  {
    path: '/redirect-to-dashboard',
    name: 'redirect-to-dashboard',
    component: () => import(/* webpackChunkName: "auth" */'@/views/pages/authentication/RefreshLogin.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/callback',
    name: 'auth-callback',
    component: () => import(/* webpackChunkName: "auth" */'@/views/pages/authentication/Callback.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import(/* webpackChunkName: "auth" */'@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/profile-form',
    name: 'profile-form',
    component: () => import(/* webpackChunkName: "user" */'@/views/pages/forms/profile-form.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import(/* webpackChunkName: "auth" */'@/views/pages/authentication/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/register',
    name: 'auth-register',
    component: () => import(/* webpackChunkName: "auth" */'@/views/pages/authentication/Register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/pages/miscellaneous/coming-soon',
    name: 'misc-coming-soon',
    component: () => import(/* webpackChunkName: "misc" */'@/views/pages/miscellaneous/ComingSoon.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/not-authorized',
    name: 'misc-not-authorized',
    component: () => import(/* webpackChunkName: "auth" */'@/views/pages/miscellaneous/NotAuthorized.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/pages/miscellaneous/under-maintenance',
    name: 'misc-under-maintenance',
    component: () => import(/* webpackChunkName: "misc" */'@/views/pages/miscellaneous/UnderMaintenance.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/error',
    name: 'misc-error',
    component: () => import(/* webpackChunkName: "misc" */'@/views/pages/miscellaneous/Error.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/turf/:id',
    name: 'pages-turf',
    component: () => import(/* webpackChunkName: "turf" */'@/views/pages/components/Turf-page/TurfPage.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */'@/views/pages/components/Home.vue'),
    meta: {
      header: true,
      search: true,
      filters: false,
    },
  },
  {
    path: '/categories',
    name: 'pages-categories',
    component: () => import(/* webpackChunkName: "categories" */'@/views/pages/components/Categories.vue'),
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
    component: () => import(/* webpackChunkName: "turf" */'@/views/pages/components/Turfs.vue'),
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
    component: () => import(/* webpackChunkName: "wishlist" */'@/views/pages/components/Wishlist.vue'),
    meta: {
      header: true,
      pageTitle: 'Favourites',
      breadcrumb: [
        {
          text: 'Favourites',
          active: true,
        },
      ],
    },
  },
  {
    path: '/booking',
    name: 'booking',
    component: () => import(/* webpackChunkName: "booking" */'@/views/pages/components/booking/Booking.vue'),
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
    component: () => import(/* webpackChunkName: "booking" */'@/views/pages/components/user/UserBookings.vue'),
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
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "misc" */'@/views/pages/components/user/Terms.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Terms and Conditions',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Terms and Conditions',
          active: true,
        },
      ],
    },
  },
  {
    path: '/update-profile',
    name: 'update-profile',
    component: () => import(/* webpackChunkName: "user" */'@/views/pages/components/user/UpdateProfile.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Update Profile',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Update Profile',
          active: true,
        },
      ],
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import(/* webpackChunkName: "user" */'@/views/pages/components/user/Notifications.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Notifications',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Notifications',
          active: true,
        },
      ],
    },
  },
  {
    path: '/cancelpolicy',
    name: 'cancelpolicy',
    component: () => import(/* webpackChunkName: "misc" */'@/views/pages/components/user/CancelPolicy.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Cancellation & Refund Policy',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Cancellation & Refund Policy',
          active: true,
        },
      ],
    },
  },
  {
    path: '/fairusage',
    name: 'fairusage',
    component: () => import(/* webpackChunkName: "misc" */'@/views/pages/components/user/Fair.vue'),
    meta: {
      layout: 'full',
      pageTitle: 'Fair Usage Policy',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Fair Usage Policy',
          active: true,
        },
      ],
    },
  },
  {
    path: '/summary/:id',
    name: 'pages-summary',
    component: () => import(/* webpackChunkName: "booking" */'@/views/pages/components/user/Summary.vue'),
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
    component: () => import(/* webpackChunkName: "user" */'@/views/pages/components/user/UserProfile.vue'),
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
    component: () => import(/* webpackChunkName: "home" */'@/views/pages/components/Search/Search.vue'),
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
    component: () => import(/* webpackChunkName: "misc" */'@/views/pages/faq/Faq.vue'),
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
