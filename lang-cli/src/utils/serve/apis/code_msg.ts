export const HTTP_OK = {
  code: 200,
};
export const HTTP_FOUND = {
  code: 302,
};
export const HTTP_BAD_REQUEST = {
  code: 400,
};
export const HTTP_UNAUTHORIZED = {
  code: 401,
};
export const HTTP_FORBIDDEN = {
  code: 403,
};
export const HTTP_NOT_FOUND = {
  code: 404,
};
export const HTTP_SERVER_ERROR = {
  code: 500,
};

export const CODE_OK = {
  code: 0,
};
export const TOKEN_EXPIRED = {
  code: -1,
  msg: '登录超时,请重新登录',
};
export const PARAM_ERROR = {
  code: 10000,
  msg: '参数错误,请检查你的请求',
};
export const TOKEN_ERROR = {
  code: 10100,
  msg: 'Token无效,请重新登录',
};
export const AUTH_VERIFY_ERROR = {
  code: 10201,
  msg: '无操作权限',
};

export const USER_NOT_EXIST = {
  code: 10301,
  msg: '用户不存在',
};
export const USER_PASSWORD_ERROR = {
  code: 10303,
  msg: '登录出错',
};
export const DATA_DUPLICATE = {
  code: 10302,
  msg: '请勿重复添加',
};
export const DATA_NOT_EXIST = {
  code: 10400,
  msg: '数据不存在',
};
export const CREATE_DATA_ERROR = {
  code: 10401,
  msg: '添加新数据错误',
};
export const RISK_NOT_EXSIT_ERROR = {
  code: 10402,
};

// 角色相关 105 开头
export const ROLE_EMPTY = {
  code: 10500,
};
