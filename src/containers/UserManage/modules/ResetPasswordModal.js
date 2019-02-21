import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  Form,
  Input,
  Select,
} from 'antd';

import { createStructuredSelector } from 'reselect';
import connectFactory from 'utils/connectFactory';
import { CREATE, EDIT } from 'utils/constants';
import { injectIntl, intlShape } from 'react-intl';
import commonMessages from 'utils/commonMessages';

import messages from '../messages';

import { NAMESPACE } from '../constants';
import { updateResetPasswordModal, postCreateEntity, postEditEntity } from '../actions';
import { selectResetPasswordModal } from '../selectors';

const withConnect = connectFactory(NAMESPACE);

const FormItem = Form.Item;
const { Option } = Select;

function isModify(type) {
  return type === 'modify';
}
@injectIntl
@withConnect(
  createStructuredSelector({ // 实用reselect性能有明显的提升；
    entityModal: selectResetPasswordModal,
  }),
  { // 其实这里可以处理掉，当前每引入一个action,需要更新props绑定，更新PropsType，
    // 实际可以直接将action全量引入，但是出于对性能及规范开发的要求，这里仍然使用单独引入的方式；
    updateResetPasswordModal,
    postCreateEntity,
    postEditEntity,
  },
)
@Form.create({
  mapPropsToFields: props => ({
    // 这里埋个坑，没空细看到底发生了什么……
    // email: Form.createFormField({ value: props.entityModal.data.email || '' }),
  }),
})
// eslint-disable-next-line
class ResetPasswordModal extends React.PureComponent {
  static propTypes = {
    entityModal: PropTypes.object.isRequired,
    updateResetPasswordModal: PropTypes.func.isRequired,
    postCreateEntity: PropTypes.func.isRequired,
    postEditEntity: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

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
    this.props.updateResetPasswordModal({
      show: false,
      data: {},
    });
  }

  render() {
    const { entityModal, intl } = this.props;
    const { data } = entityModal;

    const { getFieldDecorator } = this.props.form;

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
          width={700}
          title={intl.formatMessage(messages.userManage.resetPassword)}
          visible={entityModal.show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={intl.formatMessage(commonMessages.ok)}
          cancelText={intl.formatMessage(commonMessages.cancel)}
        >
          <Form
            className="sofa-modal-form"
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(messages.userManage.newPassword)}
            >
              {getFieldDecorator('new_password', {
                initialValue: '',
                rules: [{
                  required: true, message: 'Please input your id!',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(messages.userManage.confirmNewPassword)}
            >
              {getFieldDecorator('confirm_new_password', {
                initialValue: '',
                rules: [{ required: true, message: 'Please input your name!' }],
              })(
                <Input />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>);
  }
}

export default ResetPasswordModal;
