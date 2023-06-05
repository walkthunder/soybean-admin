import { request } from '../request';

/** 获取用户列表 */
// export const fetchUserList = async () => {
//   const data = await mockRequest.post<ApiUserManagement.User[] | null>('/getAllUserList');
//   return adapter(adapterOfFetchUserList, data);
// };
export const fetchUserList = async (token: string, query?: any) => {
  const isAdmin = query?.isAdmin;

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
  const resp = await request.get(
    isAdmin ? `/api/admin/apps/super/customers?${q.toString()}` : `/api/admin/apps/customers?${q.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  console.log('user info: ', resp);
  return resp.data;
};

export const fetchOrderList = async (token: string, query?: any) => {
  const isAdmin = query?.isAdmin;

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
  const resp = await request.get(
    isAdmin ? `/api/admin/apps/super/orders?${q.toString()}` : `/api/admin/apps/orders?${q.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  console.log('order info: ', resp);
  return resp.data;
};
export const fetchAppList = async (token: string, isAdmin?: boolean) => {
  const resp = await request.get(isAdmin ? '/api/admin/apps/super/apps' : '/api/admin/apps', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log('app info: ', resp);
  return resp.data;
};

export const createApp = async (token: string, displayName: string, description: string) => {
  if (!token) {
    throw new Error('customer token is missing');
  }
  if (!displayName || !description) {
    throw new Error('App data is missing when creating app');
  }
  const resp = await request.post(
    '/api/admin/apps/create',
    {
      displayName,
      description
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  console.log('app info: ', resp);
  return resp;
};

export const createProducts = async (token: string, appId: string, products: any[]) => {
  if (!token) {
    throw new Error('customer token is missing');
  }
  if (!appId || !products) {
    throw new Error('App data is missing when creating products');
  }

  if (!products || !Array.isArray(products)) {
    throw new Error('invalid products data');
  }
  const resp = await request.post(`/api/admin/apps/${appId}/products/createMany`, products, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log('products info: ', resp);
  if (!resp?.data) {
    throw new Error(resp?.error?.msg);
  }
  return resp;
};
