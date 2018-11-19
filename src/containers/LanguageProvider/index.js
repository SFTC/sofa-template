/*
 * pageName: {{pageNameUpper}}
 * chineseName: {{pageNavChineseName}}
 * parentModule: {{moduleName}}
 * author: {{author}}
 * date: {{date}}
 * 
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { DEFAULT_LOCALE } from 'utils/constants';

import { selectLang } from '../../state/selectors';

@connect(createSelector(
  selectLang,
  locale => ({ locale }),
))
// eslint-disable-line react/prefer-stateless-function
class LanguageProvider extends React.PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.object,
    children: PropTypes.element.isRequired,
  };

  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={this.props.messages[this.props.locale]}
        defaultLocale={DEFAULT_LOCALE}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}


export default LanguageProvider;
