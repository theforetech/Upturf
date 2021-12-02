export default [
  {
    title: 'Dashboard',
    icon: 'HomeIcon',
    role: 'vendor',
    tagVariant: 'light-warning',
    route: 'dashboard-vendor',
  },
  {
    title: 'Bookings',
    route: 'vendor-bookings',
    role: 'vendor',
    icon: 'CalendarIcon',
  },
  {
    title: 'New Booking',
    route: 'vendor-new-booking-form',
    role: 'vendor',
    icon: 'PlusIcon',
  },
  {
    title: 'Turfs',
    icon: 'MapIcon',
    role: 'vendor',
    route: 'vendor-turfs',
  },
  {
    title: 'Payments',
    icon: 'DollarSignIcon',
    role: 'vendor',
    route: 'misc-coming-soon',
  },
  {
    title: 'Profile',
    icon: 'UserIcon',
    role: 'vendor',
    route: { name: 'apps-users-edit', params: { id: 21 } },
  },
]
