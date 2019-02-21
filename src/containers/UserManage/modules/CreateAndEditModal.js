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
import DataAuthSelect from './DataAuthSelect';

import messages from '../messages';

import { NAMESPACE } from '../constants';
import { updateEntityModal, postCreateEntity, postEditEntity } from '../actions';
import { selectEntityModal, selectEntityModalType } from '../selectors';

const withConnect = connectFactory(NAMESPACE);

const FormItem = Form.Item;
const { Option } = Select;

function isModify(type) {
  return type === 'modify';
}
@injectIntl
@withConnect(
  createStructuredSelector({ // 实用reselect性能有明显的提升；
    entityModal: selectEntityModal,
    type: selectEntityModalType,
  }),
  { // 其实这里可以处理掉，当前每引入一个action,需要更新props绑定，更新PropsType，
    // 实际可以直接将action全量引入，但是出于对性能及规范开发的要求，这里仍然使用单独引入的方式；
    updateEntityModal,
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
class CreateAndEditModal extends React.PureComponent {
  static propTypes = {
    entityModal: PropTypes.object.isRequired,
    updateEntityModal: PropTypes.func.isRequired,
    postCreateEntity: PropTypes.func.isRequired,
    postEditEntity: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    type: PropTypes.string.isRequired,
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
    this.props.updateEntityModal({
      type: CREATE,
      show: false,
      data: {},
    });
  }

  render() {
    const { entityModal, intl, type } = this.props;
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
          title={isModify(type)
            ? intl.formatMessage(messages.userManage.createUser)
            : intl.formatMessage(messages.userManage.editUser)}
          visible={entityModal.show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={isModify(type)
            ? intl.formatMessage(commonMessages.ok) : intl.formatMessage(commonMessages.nextStep)}
          cancelText={intl.formatMessage(commonMessages.cancel)}
        >
          <Form
            className="sofa-modal-form"
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(messages.userManage.account)}
            >
              {getFieldDecorator('id', {
                initialValue: data.id || '',
                rules: [{
                  required: true, message: 'Please input your id!',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(commonMessages.name)}
            >
              {getFieldDecorator('name', {
                initialValue: data.name || '',
                rules: [{ required: true, message: 'Please input your name!' }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(messages.userManage.accountStatus)}
            >
              {getFieldDecorator('accountStatus', {
                initialValue: data.accountStatus || '',
                rules: [{ required: true, message: 'Please input your accountStatus!' }],
              })(
                <Select>
                  {
                    Object.keys(messages.userManage.accountStatusMap).map(key => (
                      <Option value={key} key={key}>
                        {intl.formatMessage(messages.userManage.accountStatusMap[key])}
                      </Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
            <DataAuthSelect />
          </Form>
        </Modal>
      </div>);
  }
}

export default CreateAndEditModal;
