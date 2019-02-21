import { getRequest } from 'utils/request';

export const getLoginUserInfoService = () => getRequest('/user/basic/getuserauth');
