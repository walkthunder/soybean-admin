const dashboard: AuthRoute.Route = {
  name: 'dashboard',
  path: '/dashboard',
  component: 'basic',
  children: [
    {
      name: 'dashboard_analysis',
      path: '/dashboard/analysis',
      component: 'self',
      meta: {
        title: '分析页',
        requiresAuth: true,
        icon: 'icon-park-outline:analysis',
        i18nTitle: 'message.routes.dashboard.analysis'
      }
    },
    {
      name: 'dashboard_workbench',
      path: '/dashboard/workbench',
      component: 'self',
      meta: {
        title: '工作台',
        requiresAuth: true,
        icon: 'icon-park-outline:workbench',
        i18nTitle: 'message.routes.dashboard.workbench'
      }
    },
    {
      name: 'dashboard_admin',
      path: '/dashboard/admin',
      component: 'self',
      meta: {
        permissions: ['super'],
        title: '超管页',
        icon: 'mdi:menu',
        requiresAuth: true,
        i18nTitle: 'message.routes.dashboard.admin'
      }
    }
  ],
  meta: { title: '仪表盘', icon: 'mdi:monitor-dashboard', order: 1, i18nTitle: 'message.routes.dashboard._value' }
};

export default dashboard;
