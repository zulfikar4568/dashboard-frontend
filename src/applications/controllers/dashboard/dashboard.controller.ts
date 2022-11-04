import { ICounterRequest, THttpResponse } from '../../../domain';
import { AxiosHttpClient } from '../../drivers';

export function dashboardController() {
  const http = new AxiosHttpClient('http://localhost:3000');

  async function getCounter(data: ICounterRequest): Promise<THttpResponse> {
    return await http.request({
      method: 'post',
      url: '/counter',
      data: data
    });
  }

  return {
    getCounter,
  };
}