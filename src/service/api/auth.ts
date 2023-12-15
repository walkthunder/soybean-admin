import { mockRequest, request } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 获取验证码
 * @param token - 租户的access token
 * @param email
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchEmailCode(email: string) {
  return request
    .post('/v1-flowda-admin-api/auth/preSignup', {
      email
    })
    .then(resp => {
      const { data } = resp;
      if (!(data as any)?.verifyCode) return null;
      return resp;
    });
}

/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
export function fetchLogin(userName: string, password: string) {
  return request.post('/v1-flowda-admin-api/auth/logInApi', { username: userName, password }).then(resp => {
    const { data } = resp;
    if (!(data as any)?.at) return null;
    return {
      data: {
        token: (data as any)?.at,
        refreshToken: (data as any)?.rt
      }
    };
  });
}

/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
// eslint-disable-next-line max-params
export function fetchSingup(code: string, email: string, password: string, name?: string) {
  return request.post('/v1-flowda-admin-api/auth/signup', { verifyCode: code, name, email, password }).then(resp => {
    const { data } = resp;
    if (!(data as any)?.id) return null;
    return resp;
  });
}

/** 获取用户信息 */
export async function fetchUserInfo(at?: string) {
  const resp = await request.get('/v1-flowda-admin-api/auth/info', {
    headers: {
      Authorization: `Bearer ${at}`
    }
  });
  console.log('user info: ', resp);
  return resp;

  return mockRequest.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export async function fetchUpdateToken(refreshToken: string) {
  // return mockRequest.post<ApiAuth.Token>('/updateToken', { refreshToken });
  const resp = await request.get('/v1-flowda-admin-api/auth/refreshToken', {
    headers: {
      Refresh: `Bearer ${refreshToken}`
    }
  });
  console.log('refresh user token with resp info: ', resp);
  return resp;
}
