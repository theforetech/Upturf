export default [
  {
    title: 'Dashboard',
    icon: 'HomeIcon',
    // tag: '2',
    role: 'admin',
    tagVariant: 'light-warning',
    route: 'dashboard-ecommerce',
  },
  {
    title: 'Bookings',
    route: 'apps-calendar',
    role: 'admin',
    icon: 'CalendarIcon',
  },
  {
    title: 'Users',
    icon: 'UserIcon',
    role: 'admin',
    children: [
      {
        title: 'List',
        route: 'users',
      },
      {
        title: 'View',
        route: { name: 'user', params: { id: 21 } },
      },
    ],
  },
  {
    title: 'Vendors',
    icon: 'UserIcon',
    role: 'admin',
    children: [
      {
        title: 'List',
        route: 'vendors',
      },
      {
        title: 'View',
        route: { name: 'vendor', params: { id: 21 } },
      },
    ],
  },
  {
    title: 'Sports',
    icon: 'PackageIcon',
    role: 'admin',
    route: 'sports',
  },
  {
    title: 'Turfs',
    icon: 'MapIcon',
    role: 'admin',
    children: [
      {
        title: 'List',
        route: 'turfs',
      },
      {
        title: 'View',
        route: { name: 'turf', params: { id: 21 } },
      },
    ],
  },
  {
    title: 'Access Control',
    route: 'access-control',
    role: 'admin',
    icon: 'ShieldIcon',
    action: 'read',
    resource: 'ACL',
  },
]
