import {
  UPDATE_SEARCH_CONDITION,
  UPDATE_ENTITY_MODAL,
  UPDATE_AUTH_MODAL,
  UPDATE_RESET_PASSWORD_MODAL,
  GET_DATA_LIST,
  POST_CREATE_ENTITY,
  POST_EDIT_ENTITY,
  GET_PRIVILEGE_LIST,
  GET_FULL_AUTH_AND_AUTHGROUP,
  GET_LOGIN_USER_INFO,
  GET_USER_INFO,
} from './constants';

import {
  getDataListService,
  postCreateEntityService,
  postEditEntityService,
  getPrivilegeListService,
  getFullAuthAndAuthGroupService,
  getLoginUserInfoService,
  getUserInfoService,
} from './services';

import { showLoading } from '../../state/actions';

export function updateSearchCondition(payload) {
  return {
    type: UPDATE_SEARCH_CONDITION,
    payload,
  };
}

export function updateEntityModal(payload) {
  return {
    type: UPDATE_ENTITY_MODAL,
    payload,
  };
}

export function updateAuthModal(payload) {
  return {
    type: UPDATE_AUTH_MODAL,
    payload,
  };
}

export function updateResetPasswordModal(payload) {
  return {
    type: UPDATE_RESET_PASSWORD_MODAL,
    payload,
  };
}

export function getDataList(params) {
  return {
    type: GET_DATA_LIST,
    service: getDataListService,
    loadingAction: showLoading,
    params,
  };
}

export function getPrivilegeList(params) {
  return {
    type: GET_PRIVILEGE_LIST,
    service: getPrivilegeListService,
    loadingAction: showLoading,
    params,
  };
}

export function getFullAuthAndAuthGroup() {
  return {
    type: GET_FULL_AUTH_AND_AUTHGROUP,
    service: getFullAuthAndAuthGroupService,
  };
}

export function getLoginUserInfo() {
  return {
    type: GET_LOGIN_USER_INFO,
    service: getLoginUserInfoService,
  };
}

export function getUserInfo(params) {
  return {
    type: GET_USER_INFO,
    service: getUserInfoService,
    params,
  };
}

export function postCreateEntity(params) {
  return {
    type: POST_CREATE_ENTITY,
    service: postCreateEntityService,
    params,
  };
}

export function postEditEntity(params) {
  return {
    type: POST_EDIT_ENTITY,
    service: postEditEntityService,
    params,
  };
}

export default {};
