/* eslint-disable no-warning-comments */
import axios from 'axios';
import type { AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { REFRESH_TOKEN_CODE } from '@/config';
import {
  handleAxiosError,
  handleBackendError,
  handleResponseError,
  handleServiceResult,
  transformRequestData
} from '@/utils';
import { handleRefreshToken } from './helpers';

/**
 * 封装axios请求类
 * @author Soybean<honghuangdc@gmail.com>
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance;

  backendConfig: Service.BackendResultConfig;

  /**
   *
   * @param axiosConfig - axios配置
   * @param backendConfig - 后端返回的数据配置
   */
  constructor(
    axiosConfig: AxiosRequestConfig,
    backendConfig: Service.BackendResultConfig = {
      codeKey: 'code',
      dataKey: 'data',
      msgKey: 'message',
      successCode: 200
    }
  ) {
    this.backendConfig = backendConfig;
    this.instance = axios.create(axiosConfig);
    this.setInterceptor();
  }

  /** 设置请求拦截器 */
  setInterceptor() {
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = { ...config };
        if (handleConfig.headers) {
          // 数据转换
          const contentType = handleConfig.headers['Content-Type'] as UnionKey.ContentType;
          handleConfig.data = await transformRequestData(handleConfig.data, contentType);
          // 设置token
          // handleConfig.headers.Authorization = localStg.get('token') || '';
        }
        return handleConfig;
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
    this.instance.interceptors.response.use(
      (async response => {
        const { status } = response;
        if (status === 200 || status < 300 || status === 304) {
          const backend = response.data;
          const { codeKey } = this.backendConfig;
          // 请求成功
          // if (backend[codeKey] === successCode) {
          //   return handleServiceResult(null, backend[dataKey]);
          // }
          if (!backend.error) {
            return handleServiceResult(null, backend);
          }

          // token失效, 刷新token
          // TODO: 配置token失效的错误吗
          if (REFRESH_TOKEN_CODE.includes(backend[codeKey])) {
            const config = await handleRefreshToken(response.config);
            if (config) {
              return this.instance.request(config);
            }
          }

          const error = handleBackendError(backend, this.backendConfig);
          return handleServiceResult(error, null);
        }
        const error = handleResponseError(response);
        return handleServiceResult(error, null);
      }) as (response: AxiosResponse<any, any>) => Promise<AxiosResponse<any, any>>,
      async (axiosError: AxiosError) => {
        console.error('request error: ', axiosError);
        if (axiosError?.response?.status === 401) {
          const config = axiosError?.response?.config;
          const authedConfig = await handleRefreshToken(config);
          if (authedConfig) {
            return this.instance.request(authedConfig);
          }
        }
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
  }
}
