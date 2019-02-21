import { createSelector } from 'reselect';
import { NAMESPACE } from './constants';

const selectNamespace = state => state.get(NAMESPACE);

export const selectSearchCondition = createSelector(
  selectNamespace,
  subState => subState.get('searchCondition').toJS(),
);

export const selectPagination = createSelector(
  selectNamespace,
  subState => subState.get('pagination').toJS(),
);

export const selectEntityModal = createSelector(
  selectNamespace,
  subState => subState.get('entityModal').toJS(),
);

export const selectResetPasswordModal = createSelector(
  selectNamespace,
  subState => subState.get('resetPasswordModal').toJS(),
);

export const selectEntityModalType = createSelector(
  selectNamespace,
  subState => subState.get('entityModal').toJS().type,
);

export const selectAuthModal = createSelector(
  selectNamespace,
  subState => subState.get('authModal').toJS(),
);

export const selectTableData = createSelector(
  selectNamespace,
  subState => subState.get('tableData').toJS(),
);

export const selectFullAuthList = createSelector(
  selectNamespace,
  subState => subState.get('fullAuthList').toJS(),
);


export const selectLoginUserAuth = createSelector(
  selectNamespace,
  (subState) => {
    const userInfo = subState.get('loginUserInfo').toJS();
    if (userInfo && Array.isArray(userInfo.role_list)) {
      return userInfo.role_list;
    }
    return [];
  },
);

export const selectLoginUserIdentity = createSelector(
  selectNamespace,
  subState => subState.get('loginUserInfo').is_super,
);

export const selectFullAuthMap = (state) => {
  const authList = selectFullAuthList(state).filter(item => item.is_system === 1);
  const authMap = {};
  authList.forEach((item) => {
    authMap[item.role_id] = item.name;
  });
  return authMap;
};

export const selectFullAuthGroupMap = (state) => {
  const authList = selectFullAuthList(state).filter(item => item.is_system === 0);
  const authMap = {};
  authList.forEach((item) => {
    authMap[item.role_id] = item.name;
  });
  return authMap;
};

export const selectLoginAuthList = createSelector(
  selectLoginUserAuth,
  selectLoginUserIdentity,
  selectFullAuthList,
  selectFullAuthMap,
  (loginUserAuth, loginUserIdentity, fullAuth, authMap) => {
    if (Array.isArray(loginUserAuth) && Array.isArray(fullAuth)) {
      if (loginUserIdentity) { // 超管
        return fullAuth.filter(item => item.is_system === 1).map(item => ({
          key: item.role_id,
          title: item.name,
        }));
      }
      // 非超管
      return loginUserAuth.filter(item => authMap[item]).map(item => ({
        key: item,
        title: authMap[item],
      }));
    }
    return [];
  },
);

export const selectLoginAuthGroupList = createSelector(
  selectLoginUserAuth,
  selectLoginUserIdentity,
  selectFullAuthList,
  selectFullAuthGroupMap,
  (loginUserAuth, loginUserIdentity, fullAuth, authGroupMap) => {
    if (Array.isArray(loginUserAuth) && Array.isArray(fullAuth)) {
      if (loginUserIdentity) { // 超管
        return fullAuth.filter(item => item.is_system === 0).map(item => ({
          key: item.role_id,
          title: item.name,
        }));
      }
      // 非超管
      return loginUserAuth.filter(item => authGroupMap[item]).map(item => ({
        key: item,
        title: authGroupMap[item],
      }));
    }
    return [];
  },
);

export const selectUserAuthList = createSelector(
  selectAuthModal,
  selectFullAuthMap,
  (authModal, authMap) => {
    const userAuthList = authModal.data;
    if (userAuthList && Array.isArray(userAuthList)) {
      return userAuthList.filter(item => authMap[item]);
    }
    return [];
  },
);

export const selectUserAuthGroupList = createSelector(
  selectAuthModal,
  selectFullAuthGroupMap,
  (authModal, authGroupMap) => {
    const userAuthList = authModal.data;
    if (userAuthList && Array.isArray(userAuthList)) {
      return userAuthList.filter(item => authGroupMap[item]);
    }
    return [];
  },
);

export const selectOperationAuth = createSelector(
  selectNamespace,
  subState => subState.get('operationAuth').toJS().map(item => ({
    key: item.privilege_id,
    title: item.name,
  })),
);

export default {};
