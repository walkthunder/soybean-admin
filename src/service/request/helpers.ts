import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';
import { localStg } from '@/utils';
import { fetchUpdateToken } from '../api';

/**
 * 刷新token
 * @param axiosConfig - token失效时的请求配置
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const { resetAuthStore } = useAuthStore();
  const refreshToken = localStg.get('refreshToken') || '';
  const { data } = await fetchUpdateToken(refreshToken);
  if (data) {
    const at = (data as any).at;
    localStg.set('token', at);

    const config = { ...axiosConfig };
    if (config.headers) {
      config.headers.Authorization = at;
    }
    return config;
  }

  resetAuthStore();
  return null;
}
