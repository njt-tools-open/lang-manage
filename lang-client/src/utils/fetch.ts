import axios from 'axios';

const origin =
  process.env.NODE_ENV === 'development' ? 'http://localhost:11000' : '';

const baseURL = `${origin}/api/client`;

// 根据不同的状态码，生成不同的提示信息
const showStatus = (status: number) => `${status}，请检查网络或联系管理员！`;

const fetch = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 30000,
  // 在向服务器发送请求前，序列化请求数据
  transformRequest: [data => JSON.stringify(data)],
  // 在传递给 then/catch 前，修改响应数据
  transformResponse: [
    data => {
      let res = data;
      if (typeof data === 'string' && data.startsWith('{')) {
        res = JSON.parse(data);
      }
      return res;
    },
  ],
});

// 响应拦截器
fetch.interceptors.response.use(
  response => {
    const { status, data } = response;
    let message = '';
    if (status < 200 || status >= 300) {
      // 处理 http 错误，抛到业务代码
      message = showStatus(status);
      if (typeof data === 'string') {
        response.data = { message };
      } else {
        response.data.message = message;
      }
    }
    return response.data;
  },
  error => Promise.reject(error)
);

export default fetch;
