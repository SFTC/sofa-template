import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  Form,
  Input,
  Select,
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
const { Option } = Select;

function isModify(type) {
  return type === 'edit';
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
class CreateAndEditModal extends React.PureComponent {
  static propTypes = {
    entityModal: PropTypes.object.isRequired,
    operationAuth: PropTypes.array.isRequired,
    updateEntityModal: PropTypes.func.isRequired,
    postCreateEntity: PropTypes.func.isRequired,
    postEditEntity: PropTypes.func.isRequired,
    getPrivilegeList: PropTypes.func.isRequired,
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

  render() {
    const { entityModal, intl, type, operationAuth } = this.props;
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
            ? intl.formatMessage(messages.authGroupManage.edit)
            : intl.formatMessage(messages.authGroupManage.create)}
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
            {
              isModify(type)
                ? (
                  <FormItem
                    {...formItemLayout}
                    label={intl.formatMessage(messages.authGroupManage.authGroupId)}
                  >
                    {
                      getFieldDecorator('role_id', {
                        initialValue: data.role_id,
                      })(
                        <Input disabled />,
                      )
                    }
                  </FormItem>) : ''
            }
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(messages.authGroupManage.authGroupName)}
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
              label={intl.formatMessage(messages.authGroupManage.operationAuth)}
            >
              {
                getFieldDecorator('privileges', {
                  initialValue: data.privileges || [],
                  valuePropName: 'targetKeys',
                })(
                  <Transfer
                    dataSource={operationAuth} // 登陆用户有的所有权限
                    showSearch
                    render={item => item.title}
                    searchPlaceholder={intl.formatMessage(commonMessages.inputPlaceholder)}
                    notFoundContent={intl.formatMessage(commonMessages.dataNotFound)}
                  />,
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl.formatMessage(commonMessages.remark)}
            >
              {
                getFieldDecorator('content', {
                  initialValue: data.content || '',
                })(
                  <Input.TextArea rows={4} />,
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>);
  }
}

export default CreateAndEditModal;
