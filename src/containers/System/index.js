/**
 * pageName: {{pageNameUpper}}
 * chineseName: {{pageNavChineseName}}
 * parentModule: {{moduleName}}
 * author: {{author}}
 * date: {{date}}
 */
import React from 'react';
import { withRouter } from 'react-router-dom';

@withRouter
class System extends React.Component {
  render() {
    return (<div>System</div>);
  }
}

export default System;
