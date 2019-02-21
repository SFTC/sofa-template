import React from 'react';
import PropTypes from 'prop-types';

import {
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
import { updateEntityModal, postCreateEntity, postEditEntity, getPrivilegeList } from '../actions';
import { selectEntityModal, selectEntityModalType, selectOperationAuth } from '../selectors';

const withConnect = connectFactory(NAMESPACE);
const FormItem = Form.Item;

function isModify(type) {
  return type === 'modify';
}
@injectIntl
@withConnect(
  createStructuredSelector({ // 实用reselect性能有明显的提升；
    entityModal: selectEntityModal,
    type: selectEntityModalType,
    operationAuth: selectOperationAuth,
  }),
  { // 其实这里可以处理掉，当前每引入一个action,需要更新props绑定，更新PropsType，
    // 实际可以直接将action全量引入，但是出于对性能及规范开发的要求，这里仍然使用单独引入的方式；
    updateEntityModal,
    postCreateEntity,
    postEditEntity,
    getPrivilegeList,
  },
)
@Form.create({
  mapPropsToFields: props => ({
    // 这里埋个坑，没空细看到底发生了什么……
    // email: Form.createFormField({ value: props.entityModal.data.email || '' }),
  }),
})
// eslint-disable-next-line
class OperationAuthSelect extends React.PureComponent {
  static propTypes = {
    entityModal: PropTypes.object.isRequired,
    operationAuth: PropTypes.array.isRequired,
    updateEntityModal: PropTypes.func.isRequired,
    postCreateEntity: PropTypes.func.isRequired,
    postEditEntity: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    type: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.props.getPrivilegeList();
  }

  state = {
  };

  handleOk = (e) => {
    e.preventDefault();
    const { type } = this.props.entityModal;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (type === CREATE) {
          this.props.postCreateEntity(values);
        } else if (type === EDIT) {
          this.props.postEditEntity(values);
        }
      }
    });
  }

  handleCancel = () => {
    this.props.updateEntityModal({
      type: CREATE,
      show: false,
      data: {},
    });
  }

  onChangeHandle = (targetKeys) => {
    const { entityModal } = this.props;
    const { data, type } = entityModal;
    const values = this.props.form.getFieldsValue();
    values.privileges = targetKeys;
    if (type === EDIT) {
      values.role_id = data.role_id;
    }
    this.props.updateEntityModal({
      ...entityModal,
      data: values,
    });
  }

  render() {
    const { entityModal, intl, operationAuth } = this.props;
    const { privileges } = entityModal.data;
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
      <FormItem
        {...formItemLayout}
        label={intl.formatMessage(messages.authGroupManage.operationAuth)}
      >
        <Transfer
          dataSource={operationAuth} // 登陆用户有的所有权限
          showSearch
          targetKeys={privileges} // 当前用户已有的权限
          onChange={this.onChangeHandle}
          render={item => item.title}
          searchPlaceholder={intl.formatMessage(commonMessages.inputPlaceholder)}
          notFoundContent={intl.formatMessage(commonMessages.dataNotFound)}
        />
      </FormItem>);
  }
}

export default OperationAuthSelect;
