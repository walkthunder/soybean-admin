import { request } from '../request';

/** 获取用户列表 */
// export const fetchUserList = async () => {
//   const data = await mockRequest.post<ApiUserManagement.User[] | null>('/getAllUserList');
//   return adapter(adapterOfFetchUserList, data);
// };
export const fetchUserList = async (token: string) => {
  const resp = await request.get('/api/admin/apps/customers', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log('user info: ', resp);
  return resp.data;
};

export const fetchOrderList = async (token: string) => {
  const resp = await request.get('/api/admin/apps/orders', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log('order info: ', resp);
  return resp.data;
};
export const fetchAppList = async () => {
  const resp = await request.get('/api/admin/apps', {});
  console.log('app info: ', resp);
  return resp.data;
};
