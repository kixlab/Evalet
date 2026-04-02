import Axios from 'axios';
import qs from 'qs';

enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export const getForEntity: <T>(url: string, params?: any, timeout?: number) => Promise<T> = (url: string, params?: any, timeout?: number) => {
  return requestForEntity(HttpMethod.GET, url, params, null, false, timeout);
};

export const postForEntity: <T>(url: string, data: any, timeout?: number) => Promise<T> = (url: string, data: any, timeout?: number) => {
  return requestForEntity(HttpMethod.POST, url, null, data, false, timeout);
};

const requestForEntity: <T>(
  method: HttpMethod,
  url: string,
  params: any | null,
  data: any | null,
  arrayNoBrackets?: boolean,
  timeout?: number,
) => Promise<T> = async (method: HttpMethod, url: string, params: any | null, data: any | null, arrayNoBrackets?: boolean, timeout?: number) => {
  const headers = {
    Authorization: 'Bearer ', // API Key
  };

  try {
    const axiosResult = await Axios.request({
      url,
      method,
      params,
      data,
      headers,
      // baseURL: process.env.SERVER_URL,
      timeout,
      paramsSerializer: arrayNoBrackets ? (params) => qs.stringify(params, { arrayFormat: 'repeat' }) : undefined,
    });
    return axiosResult.data;
  } catch (e) {
    throw e;
  }
};
