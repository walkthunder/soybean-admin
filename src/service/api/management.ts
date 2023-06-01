import { request } from '../request';

/** 获取用户列表 */
// export const fetchUserList = async () => {
//   const data = await mockRequest.post<ApiUserManagement.User[] | null>('/getAllUserList');
//   return adapter(adapterOfFetchUserList, data);
// };
export const fetchUserList = async (token: string, query?: any) => {
  const q = new URLSearchParams();
  if (query?.start) {
    q.set('start', query?.start);
  }
  if (query?.end) {
    q.set('end', query?.end);
  }
  if (query?.limit) {
    q.set('limit', query?.limit);
  }
  if (query?.id) {
    q.set('id', query?.id);
  }
  if (query?.appId) {
    q.set('appId', query?.appId);
  }
  if (query?.name) {
    q.set('name', query?.name);
  }
  if (query?.email) {
    q.set('email', query?.email);
  }
  const resp = await request.get(`/api/admin/apps/customers?${q.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log('user info: ', resp);
  return resp.data;
};

export const fetchOrderList = async (token: string, query?: any) => {
  const q = new URLSearchParams();
  if (query?.start) {
    q.set('start', query?.start);
  }
  if (query?.end) {
    q.set('end', query?.end);
  }
  if (query?.limit) {
    q.set('limit', query?.limit);
  }
  if (query?.id) {
    q.set('id', query?.id);
  }
  if (query?.serial) {
    q.set('serial', query?.serial);
  }
  if (query?.status) {
    q.set('status', query?.status);
  }
  if (query?.customerId) {
    q.set('customerId', query?.customerId);
  }
  const resp = await request.get(`/api/admin/apps/orders?${q.toString()}`, {
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
