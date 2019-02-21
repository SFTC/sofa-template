/**
 * 前置登录校验，避免页面加载后再行跳转；
 */
import { getRequest } from 'utils/request';
import {
  USER_NOT_LOGIN_ERRNO,
  USER_NOT_EXIST_ERRNO,
} from 'utils/constants';

import { gotoPass } from 'config/pass.conf';

const getLoginUserInfoService = () => getRequest('/user/basic/getuserauth');

getLoginUserInfoService().then((res) => {
  if (res) {
    if (res.errno === USER_NOT_LOGIN_ERRNO || res.errno === USER_NOT_EXIST_ERRNO) {
      gotoPass('login');
    }
  }
});
