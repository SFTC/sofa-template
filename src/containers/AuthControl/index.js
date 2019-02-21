/**
 * 权限检查
 * @param {*} authCode 权限码
 * @param {*} authList 用户权限列表，在store.global中有存储
 * @use { checkAuth(authCode, authList)(<Button />) }
 */
export function checkAuth(authCode, authList) {
  return (component) => {
    if (!authCode) {
      return component;
    }
    const authCodeNumber = parseInt(authCode, 10);
    const authCodeString = authCode.toString();

    if (authList.indexOf(authCodeNumber) > -1 || authList.indexOf(authCodeString) > -1) {
      return component;
    }
    return '';
  };
}

export default {};
