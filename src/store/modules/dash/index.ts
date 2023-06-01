import { defineStore } from 'pinia';
import { fetchAppList, fetchUserList, fetchOrderList } from '@/service';
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
    async getAppList() {
      const list = await fetchAppList();
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
    }
  }
});
