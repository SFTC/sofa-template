import { fromJS } from 'immutable';
import commonConf from 'config/main.conf';
import { CREATE, FATCH_ACTION_SUCCESS_PREFIX } from 'utils/constants';
import {
  UPDATE_ENTITY_MODAL,
  UPDATE_RESET_PASSWORD_MODAL,
  UPDATE_AUTH_MODAL,
  UPDATE_SEARCH_CONDITION,
  GET_DATA_LIST,
  GET_PRIVILEGE_LIST,
  GET_LOGIN_USER_INFO,
  GET_FULL_AUTH_AND_AUTHGROUP,
  GET_USER_INFO,
} from './constants';

const initialState = fromJS({
  searchCondition: {
    // 这里推荐枚举出所有Field的初始值
    acount: '',
    name: '',
    acountStatus: '',
  },
  entityModal: {
    type: CREATE,
    show: false,
    data: {},
  },
  authModal: {
    type: CREATE,
    show: false,
    data: {},
  },
  resetPasswordModal: {
    show: false,
    data: {},
  },
  tableData: [],
  operationAuth: [],
  loginUserInfo: {},
  fullAuthList: [],
  pagination: {
    pageSize: commonConf.table.defaultPageSize,
    total: 100,
    current: 1,
  },
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ENTITY_MODAL:
      return state
        .set('entityModal', fromJS(action.payload));
    case UPDATE_AUTH_MODAL:
      return state
        .set('authModal', fromJS(action.payload));
    case UPDATE_RESET_PASSWORD_MODAL:
      return state
        .set('resetPasswordModal', fromJS(action.payload));
    case UPDATE_SEARCH_CONDITION:
      return state
        .set('searchCondition', fromJS(action.payload));
    case `${FATCH_ACTION_SUCCESS_PREFIX}${GET_DATA_LIST}`:
      if (action.payload && action.payload.data && action.payload.data.list) {
        return state
          .set('tableData', fromJS(action.payload.data.list))
          .setIn(['pagination', 'total'], action.payload.data.total)
          .setIn(['pagination', 'page'], action.payload.data.page);
      }
      return state;
    case `${FATCH_ACTION_SUCCESS_PREFIX}${GET_PRIVILEGE_LIST}`:
      if (action.payload && action.payload.data && action.payload.data.list) {
        return state
          .set('operationAuth', fromJS(action.payload.data.list));
      }
      return state;
    case `${FATCH_ACTION_SUCCESS_PREFIX}${GET_USER_INFO}`:
      if (action.payload && action.payload.data && action.payload.data.role_ids) {
        return state
          .setIn(['entityModal', 'auth'], fromJS(action.payload.data.data_privileges))
          .setIn(['authModal', 'data'], fromJS(action.payload.data.role_ids));
      }
      if (action.payload && action.payload.data && action.payload.data.data_privileges) {
        return state
          .setIn(['entityModal', 'auth'], fromJS(action.payload.data.data_privileges));
      }
      return state;
    case `${FATCH_ACTION_SUCCESS_PREFIX}${GET_LOGIN_USER_INFO}`:
      if (action.payload && action.payload.data) {
        return state
          .set('loginUserInfo', fromJS(action.payload.data));
      }
      return state;
    case `${FATCH_ACTION_SUCCESS_PREFIX}${GET_FULL_AUTH_AND_AUTHGROUP}`:
      if (action.payload && action.payload.data && action.payload.data.role_list) {
        return state
          .set('fullAuthList', fromJS(action.payload.data.role_list));
      }
      return state;
    default:
      break;
  }
  return state;
}

export default reducer;
