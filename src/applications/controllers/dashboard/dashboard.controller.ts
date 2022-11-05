import { ICounterRequest, THttpResponse } from '../../../domain';
import { AxiosHttpClient } from '../../drivers';

export function dashboardController() {
  const http = new AxiosHttpClient(import.meta.env.VITE_DASHBOARD_BACKEND);

  async function getResourceGroup(): Promise<THttpResponse> {
    return await http.request({
      method: 'get',
      url: '/resource-group',
    });
  }

  async function getMfgOrder(): Promise<THttpResponse> {
    return await http.request({
      method: 'get',
      url: '/mfg-order',
    });
  }

  async function getCounter(data: ICounterRequest): Promise<THttpResponse> {
    return await http.request({
      method: 'post',
      url: '/counter',
      data: data
    });
  }

  return {
    getCounter,
    getResourceGroup,
    getMfgOrder,
  };
}