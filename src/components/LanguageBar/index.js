/**
 * componentName: {{ComponentName}}
 * author: {{author}}
 * date: {{date}}
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

class LanguageBar extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  handleChangeSelect = (e) => {
    const { onToggle } = this.props;
    const { value } = e.target;

    onToggle(value);
  }

  render() {
    const { value } = this.props;
    return (
      <div>
        <Radio.Group
          buttonStyle="solid"
          value={value}
          onChange={this.handleChangeSelect}
        >
          <Radio.Button value="zh">中文</Radio.Button>
          <Radio.Button value="en">English</Radio.Button>
        </Radio.Group>
      </div>
    );
  }
}

export default LanguageBar;
