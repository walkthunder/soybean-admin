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

    async getUserList() {
      const token = localStg.get('token');
      if (!token) {
        return [];
      }
      const list = await fetchUserList(token);
      console.log('list: ', list);
      return list as any[];
    },
    async getOrderList() {
      const token = localStg.get('token');
      if (!token) {
        return [];
      }
      const list = await fetchOrderList(token);
      console.log('order list: ', list);
      return list as any[];
    }
  }
});
