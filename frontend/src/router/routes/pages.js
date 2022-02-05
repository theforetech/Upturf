import AccessControl from '@/views/extensions/acl/AccessControl.vue'
import RefreshLogin from '@/views/pages/authentication/RefreshLogin.vue'
import Error404 from '@/views/error/Error404.vue'
import ProfileForm from '@/views/pages/forms/profile-form.vue'
import Login from '@/views/pages/authentication/Login.vue'
import Register from '@/views/pages/authentication/Register.vue'
import ComingSoon from '@/views/pages/miscellaneous/ComingSoon.vue'
import NotAuthorized from '@/views/pages/miscellaneous/NotAuthorized.vue'
import UnderMaintenance from '@/views/pages/miscellaneous/UnderMaintenance.vue'
import Error from '@/views/pages/miscellaneous/Error.vue'
import TurfPage from '@/views/pages/components/Turf-page/TurfPage.vue'
import Home from '@/views/pages/components/Home.vue'
import Categories from '@/views/pages/components/Categories.vue'
import Turfs from '@/views/pages/components/Turfs.vue'
import Wishlist from '@/views/pages/components/Wishlist.vue'
import Booking from '@/views/pages/components/booking/Booking.vue'
import UserBookings from '@/views/pages/components/user/UserBookings.vue'
import Terms from '@/views/pages/components/user/Terms.vue'
import UpdateProfile from '@/views/pages/components/user/UpdateProfile.vue'
import Notifications from '@/views/pages/components/user/Notifications.vue'
import CancelPolicy from '@/views/pages/components/user/CancelPolicy.vue'
import Fair from '@/views/pages/components/user/Fair.vue'
import Summary from '@/views/pages/components/user/Summary.vue'
import UserProfile from '@/views/pages/components/user/UserProfile.vue'
import Search from '@/views/pages/components/Search/Search.vue'
import Faq from '@/views/pages/faq/Faq.vue'
import Callback from '@/views/pages/authentication/Callback.vue'

export default [
  {
    path: '/access-control',
    name: 'access-control',
    component: AccessControl,
    meta: {
      resource: 'ACL',
      action: 'read',
    },
  },
  {
    path: '/redirect-to-dashboard',
    name: 'redirect-to-dashboard',
    component: RefreshLogin.vue,
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/callback',
    name: 'auth-callback',
    component: Callback,
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: Error404,
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/profile-form',
    name: 'profile-form',
    component: ProfileForm,
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: Login,
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/register',
    name: 'auth-register',
    component: Register,
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/pages/miscellaneous/coming-soon',
    name: 'misc-coming-soon',
    component: ComingSoon,
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/not-authorized',
    name: 'misc-not-authorized',
    component: NotAuthorized,
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/pages/miscellaneous/under-maintenance',
    name: 'misc-under-maintenance',
    component: UnderMaintenance,
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/error',
    name: 'misc-error',
    component: Error,
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/turf/:id',
    name: 'pages-turf',
    component: TurfPage,
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      header: true,
      search: true,
      filters: false,
    },
  },
  {
    path: '/categories',
    name: 'pages-categories',
    component: Categories,
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
    component: Turfs,
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
    component: Wishlist,
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
    component: Booking,
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
    component: UserBookings,
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
    component: Terms,
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
    component: UpdateProfile,
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
    component: Notifications,
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
    component: CancelPolicy,
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
    path: '/privacy',
    name: 'privacy',
    component: Fair,
    meta: {
      layout: 'full',
      pageTitle: 'Privacy Policy',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Private Policy',
          active: true,
        },
      ],
    },
  },
  {
    path: '/summary/:id',
    name: 'pages-summary',
    component: Summary,
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
    component: UserProfile,
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
    component: Search,
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
    component: Faq,
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
]
