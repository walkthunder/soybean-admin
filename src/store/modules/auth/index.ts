import { unref, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchLogin, fetchSingup, fetchUserInfo } from '@/service';
import { useRouterPush } from '@/composables';
import { localStg } from '@/utils';
import { useTabStore } from '../tab';
import { useRouteStore } from '../route';
import { getToken, getUserInfo, clearAuthStorage } from './helpers';

interface AuthState {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
  /** 用户token */
  token: string;
  /** 登录的加载状态 */
  loginLoading: boolean;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfo: getUserInfo(),
    token: getToken(),
    loginLoading: false
  }),
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token);
    }
  },
  actions: {
    /** 重置auth状态 */
    resetAuthStore() {
      const { toLogin } = useRouterPush(false);
      const { resetTabStore } = useTabStore();
      const { resetRouteStore } = useRouteStore();
      const route = unref(router.currentRoute);

      clearAuthStorage();
      this.$reset();

      if (route.meta.requiresAuth) {
        toLogin();
      }

      nextTick(() => {
        resetTabStore();
        resetRouteStore();
      });
    },
    /**
     * 处理登录后成功或失败的逻辑
     * @param backendToken - 返回的token
     */
    async handleActionAfterLogin(backendToken: ApiAuth.Token) {
      const route = useRouteStore();
      const { toLoginRedirect } = useRouterPush(false);

      const loginSuccess = await this.loginByToken(backendToken);

      if (loginSuccess) {
        await route.initAuthRoute();

        // 跳转登录后的地址
        toLoginRedirect();

        // 登录成功弹出欢迎提示
        if (route.isInitAuthRoute) {
          window.$notification?.success({
            title: '登录成功!',
            content: `欢迎回来，${this.userInfo.userName}!`,
            duration: 3000
          });
        }

        return;
      }

      // 不成功则重置状态
      this.resetAuthStore();
    },
    /**
     * 根据token进行登录
     * @param backendToken - 返回的token
     */
    async loginByToken(backendToken: ApiAuth.Token) {
      let successFlag = false;

      // 先把token存储到缓存中(后面接口的请求头需要token)
      const { token, refreshToken } = backendToken;
      localStg.set('token', token);
      localStg.set('refreshToken', refreshToken);

      // 获取用户信息
      const { data } = await fetchUserInfo(token);
      if (data) {
        const userInfo = {
          userId: (data as any).id,
          userName: (data as any).name,
          userRole: ((data as any)?.role === 'superadmin' ? 'super' : 'user') as Auth.RoleType
        };
        // 成功后把用户信息存储到缓存中
        localStg.set('userInfo', userInfo);

        // 更新状态
        this.userInfo = userInfo;
        this.token = token;

        successFlag = true;
      }

      return successFlag;
    },
    /**
     * 登录
     * @param userName - 用户名
     * @param password - 密码
     */
    async login(userName: string, password: string) {
      this.loginLoading = true;
      const { data } = (await fetchLogin(userName, password)) || {};
      if (data) {
        console.log('data - ', data);
        await this.handleActionAfterLogin(data);
      } else {
        window.$notification?.error({
          title: '登录失败!',
          content: `请重新登录`,
          duration: 3000
        });
      }
      this.loginLoading = false;
    },

    /**
     * signup
     * @param userName - 用户名
     * @param password - 密码
     */
    // eslint-disable-next-line max-params
    async signup(verifyCode: string, email: string, password: string, name?: string) {
      this.loginLoading = true;
      const { data } = (await fetchSingup(verifyCode, email, password, name)) || {};
      if (data) {
        console.log('signup data - ', data);
        // await this.handleActionAfterLogin(data);
      }
      this.loginLoading = false;
      return data;
    },

    /**
     * 更换用户权限(切换账号)
     * @param userRole
     */
    async updateUserRole(userRole: Auth.RoleType) {
      const { resetRouteStore, initAuthRoute } = useRouteStore();

      const accounts: Record<Auth.RoleType, { userName: string; password: string }> = {
        super: {
          userName: 'Super',
          password: 'super123'
        },
        admin: {
          userName: 'Admin',
          password: 'admin123'
        },
        user: {
          userName: 'User01',
          password: 'user01123'
        }
      };
      const { userName, password } = accounts[userRole];
      const { data } = (await fetchLogin(userName, password)) || {};
      if (data) {
        await this.loginByToken(data);
        resetRouteStore();
        initAuthRoute();
      }
    }
  }
});
