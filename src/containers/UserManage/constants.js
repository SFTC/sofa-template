import { FATCH_ACTION_PREFIX } from 'utils/constants';

export const NAMESPACE = 'UserManage';

export default {
  NAMESPACE,
};

export const GET_DATA_LIST = `${FATCH_ACTION_PREFIX}GET_DATA_LIST_${NAMESPACE}`;

export const UPDATE_SEARCH_CONDITION = `UPDATE_SEARCH_CONDITION_${NAMESPACE}`;

export const POST_CREATE_ENTITY = `${FATCH_ACTION_PREFIX}POST_CREATE_ENTITY_${NAMESPACE}`;

export const POST_EDIT_ENTITY = `${FATCH_ACTION_PREFIX}POST_EDIT_ENTITY_${NAMESPACE}`;

export const UPDATE_ENTITY_MODAL = `UPDATE_ENTITY_MODAL_${NAMESPACE}`;

export const UPDATE_RESET_PASSWORD_MODAL = `UPDATE_RESET_PASSWORD_MODAL_${NAMESPACE}`;
