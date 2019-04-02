import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { getFormattedMessages } from 'utils/i18n';

// eslint-disable-next-line
export default class Example extends React.Component {
  static propTypes = {
    history: PropTypes.any.isRequired,
    mainMap: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
  }

  getCrumbItem = (path) => {
    const { lang, mainMap } = this.props;

    const pathArray = path.split('/').filter(item => Boolean(item));
    return pathArray.map((item, index) => {
      if (mainMap[item]) {
        return {
          key: item,
          text: getFormattedMessages(lang, `sofa.config.${item}`),
          path: index === 0 ? './' : pathArray.slice(1, index + 1).join('/'),
        };
      }
      return null;
    });
  }

  render() {
    const { history } = this.props;
    this.path = history.location.pathname;
    const items = this.getCrumbItem(this.path);

    return (
      <Breadcrumb className="breadCrumb">
        {
          items.map((item, index) => (
            <Breadcrumb.Item key={item.key}>
              {
                item.path && index !== 0 && index !== items.length - 1
                  ? <Link to={item.path}>{item.text}</Link> : item.text
              }
            </Breadcrumb.Item>
          ))
        }
      </Breadcrumb>
    );
  }
}
