import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  Form,
  Transfer,
} from 'antd';

import { createStructuredSelector } from 'reselect';
import connectFactory from 'utils/connectFactory';
import { CREATE, EDIT } from 'utils/constants';
import { injectIntl, intlShape } from 'react-intl';
import commonMessages from 'utils/commonMessages';

import messages from '../messages';
import { NAMESPACE } from '../constants';
import {
  updateAuthModal, postCreateEntity, postEditEntity, getPrivilegeList,
  getFullAuthAndAuthGroup, getLoginUserInfo,
} from '../actions';
import {
  selectEntityModal, selectEntityModalType,
  selectOperationAuth, selectUserAuthList, selectUserAuthGroupList,
  selectLoginAuthList, selectLoginAuthGroupList, selectAuthModal,
} from '../selectors';

const withConnect = connectFactory(NAMESPACE);
const FormItem = Form.Item;

@injectIntl
@withConnect(
  createStructuredSelector({ // 实用reselect性能有明显的提升；
    entityModal: selectEntityModal,
    authModal: selectAuthModal,
    type: selectEntityModalType,
    operationAuth: selectOperationAuth,
    userAuthList: selectUserAuthList,
    UserAuthGroupList: selectUserAuthGroupList,
    loginAuthList: selectLoginAuthList,
    loginAuthGroupList: selectLoginAuthGroupList,
  }),
  { // 其实这里可以处理掉，当前每引入一个action,需要更新props绑定，更新PropsType，
    // 实际可以直接将action全量引入，但是出于对性能及规范开发的要求，这里仍然使用单独引入的方式；
    updateAuthModal,
    postCreateEntity,
    postEditEntity,
    getPrivilegeList,
    getLoginUserInfo,
    getFullAuthAndAuthGroup,
  },
)
@Form.create({
  mapPropsToFields: props => ({
    // 这里埋个坑，没空细看到底发生了什么……
    // email: Form.createFormField({ value: props.entityModal.data.email || '' }),
  }),
})
// eslint-disable-next-line
class OperationAuthSelectModal extends React.PureComponent {
  static propTypes = {
    entityModal: PropTypes.object.isRequired,
    authModal: PropTypes.object.isRequired,
    operationAuth: PropTypes.array.isRequired,
    updateAuthModal: PropTypes.func.isRequired,
    postCreateEntity: PropTypes.func.isRequired,
    postEditEntity: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    type: PropTypes.string.isRequired,
    loginAuthList: PropTypes.array.isRequired,
    loginAuthGroupList: PropTypes.array.isRequired,
    userAuthList: PropTypes.array.isRequired,
    userAuthGroupList: PropTypes.array,
    getFullAuthAndAuthGroup: PropTypes.func.isRequired,
    getLoginUserInfo: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getPrivilegeList();
    this.props.getFullAuthAndAuthGroup();
    this.props.getLoginUserInfo();
  }

  handleChangeAuthSelect = (targetKeys) => {
    const { userAuthGroupList, authModal } = this.props;
    const newAuth = targetKeys.concat(userAuthGroupList);
    this.props.updateAuthModal({
      ...authModal,
      show: true,
      data: newAuth,
    });
  }

  handleChangeAuthGroupSelect = (targetKeys) => {
    const { userAuthList, authModal } = this.props;
    const newAuth = targetKeys.concat(userAuthList);
    this.props.updateAuthModal({
      ...authModal,
      show: true,
      data: newAuth,
    });
  }

  handleOk = () => {
    const { authModal } = this.props;
    this.props.postUserAuthModify({
      pass_uid: authModal.pass_uid,
      role_ids: authModal.data.join(),
    });
  }

  handleCancel = () => {
    this.props.updateAuthModal({
      show: false,
      data: [],
    });
  }

  render() {
    const {
      authModal, intl, loginAuthList, loginAuthGroupList, userAuthList, userAuthGroupList,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { data } = authModal;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <div>
        <Modal
          width={600}
          title={intl.formatMessage(messages.userManage.modifyAuth)}
          visible={authModal.show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={intl.formatMessage(commonMessages.ok)}
          cancelText={intl.formatMessage(commonMessages.cancel)}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(messages.userManage.operationAuth)}
            >
              <Transfer
                dataSource={loginAuthList}
                showSearch
                targetKeys={userAuthList}
                onChange={this.handleChangeAuthSelect}
                render={item => item.title}
                searchPlaceholder={intl.formatMessage(commonMessages.inputPlaceholder)}
                notFoundContent={intl.formatMessage(commonMessages.dataNotFound)}
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(messages.userManage.operationAuth)}
            >
              <Transfer
                dataSource={loginAuthGroupList}
                showSearch
                targetKeys={userAuthGroupList}
                onChange={this.handleChangeAuthGroupSelect}
                render={item => item.title}
                searchPlaceholder={intl.formatMessage(commonMessages.inputPlaceholder)}
                notFoundContent={intl.formatMessage(commonMessages.dataNotFound)}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>);
  }
}

export default OperationAuthSelectModal;
