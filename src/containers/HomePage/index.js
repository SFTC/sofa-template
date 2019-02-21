import React from 'react';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import messages from './messages';

@withRouter
class HomePage extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { intl } = this.props;
    return (<div>{intl.formatMessage(messages.homePage.homePage)}</div>);
  }
}

export default injectIntl(HomePage);
