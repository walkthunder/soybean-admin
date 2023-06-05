import { defineStore } from 'pinia';
import { fetchAppList, fetchUserList, fetchOrderList, createApp, createProducts } from '@/service';
import { localStg } from '@/utils';

interface DashState {
  apps: any[];
  loading: boolean;
}

export const useDashStore = defineStore('dash-store', {
  state: (): DashState => ({
    apps: [],
    loading: false
  }),
  getters: {
    /** 是否登录 */
    // isLogin(state) {
    //   return Boolean(state.token);
    // }
  },
  actions: {
    async getAppList(query?: { isAdmin: boolean }) {
      const token = localStg.get('token');
      if (!token) {
        return [];
      }
      if (query?.isAdmin) {
        const userInfo = localStg.get('userInfo');
        if (userInfo?.userRole === 'super') {
          const list = await fetchAppList(token, true);
          console.log('list: ', list);
          return list as any[];
        }
        // Throw 401
        return [];
      }
      const list = await fetchAppList(token);
      console.log('list: ', list);
      return list as any[];
    },

    async getUserList(query?: any) {
      const token = localStg.get('token');
      if (!token) {
        return [];
      }
      console.log('get user list with query: ', query);
      const list = await fetchUserList(token, query);
      console.log('list: ', list);
      return list as any[];
    },
    async getOrderList(query?: any) {
      const token = localStg.get('token');
      if (!token) {
        return [];
      }
      const list = await fetchOrderList(token, query);
      console.log('order list: ', list);
      return list as any[];
    },
    async createApp(option: any) {
      const { displayName, description } = option;
      console.log('creating app with: ', displayName, description);
      const token = localStg.get('token');
      if (!token) {
        throw new Error('Need login first');
      }
      const resp = await createApp(token, displayName, description);
      return resp?.data;
    },

    // {{admin_api_url}}/api/admin/apps/:appId/products/createMany
    async createProducts(option: any) {
      const { appId, products } = option;
      console.log('creating products with: ', appId, products);
      const token = localStg.get('token');
      if (!token) {
        throw new Error('Need login first');
      }
      const resp = await createProducts(token, appId, products);
      return resp?.data;
    }
  }
});
