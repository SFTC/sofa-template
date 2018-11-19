/**
 * pageName: {{pageNameUpper}}
 * chineseName: {{pageNavChineseName}}
 * parentModule: {{moduleName}}
 * author: {{author}}
 * date: {{date}}
 */
import React from 'react';
import { withRouter } from 'react-router-dom';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import { NAMESPACE } from './constants';
import reducer from './reducer';
import saga from './saga';

import PrintPage from './modules/PrintPage';

const withReducer = injectReducer({ key: NAMESPACE, reducer });
const withSaga = injectSaga({ key: NAMESPACE, saga });

@withRouter
@withSaga
@withReducer
class Print extends React.Component {
  render() {
    return (
      <div>
        <PrintPage />
      </div>);
  }
}

export default Print;
