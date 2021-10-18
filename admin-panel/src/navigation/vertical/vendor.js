export default [
  {
    title: 'Dashboard',
    icon: 'HomeIcon',
    role: 'vendor',
    tagVariant: 'light-warning',
    route: 'dashboard-analytics',
  },
  {
    title: 'Bookings',
    route: 'apps-calendar',
    role: 'vendor',
    icon: 'CalendarIcon',
  },
  {
    title: 'Turfs',
    icon: 'MapIcon',
    role: 'vendor',
    route: 'vendor-turfs',
  },
  {
    title: 'Facilities',
    icon: 'MapIcon',
    role: 'vendor',
    route: 'apps-e-commerce-shop',
  },
  {
    title: 'Payments',
    icon: 'DollarSignIcon',
    role: 'vendor',
    route: 'apps-e-commerce-shop',
  },
  {
    title: 'Profile',
    icon: 'UserIcon',
    role: 'vendor',
    route: { name: 'apps-users-edit', params: { id: 21 } },
  },
]
