import { getRequest, postRequest } from 'utils/request';

export const getDataListService = params => getRequest('/test/getUserList', params);

export const postCreateEntityService = params => postRequest('/test/create', params);

export const postEditEntityService = params => postRequest('/test/edit', params);

export const getPrivilegeListService = params => getRequest('/user/basic/getprivilegelist', params);

export const getUserInfoService = params => getRequest('/user/account/getuserinfo', params);
export const getLoginUserInfoService = () => getRequest('/user/basic/getuserauth');
export const getFullAuthAndAuthGroupService = () => getRequest('/user/basic/getauthlist');

export default {};
