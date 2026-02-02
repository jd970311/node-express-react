import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  console.log(config, 'config');

  // 在发送请求之前做些什么
  // 获取token判断是否登录
  const token = localStorage.getItem('token')
  if (!token) {
    return Promise.reject(new Error('未登录'))
  }
  config.headers.Authorization = `Bearer ${token}`
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // 判断响应数据是否成功
  if (response.status === 200) {
    return response.data;
  }
}, function (error) {
  if (error.response.status === 500) {
    return Promise.reject(new Error('服务器错误'))
  }
  if (error.response.status === 502) {
    return Promise.reject(new Error('网关错误'))
  }
  if (error.response.status === 503) {
    return Promise.reject(new Error('服务不可用'))
  }
  return Promise.reject(error);
});


export default request;