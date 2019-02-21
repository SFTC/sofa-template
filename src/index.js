import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Main from 'containers/Main';
import LanguageProvider from 'containers/LanguageProvider';
import { translationMessages } from 'utils/i18n';
import storeFactory from './state/storeFactory';

import './global-styles';
import './theme/style.less';

const rootElement = document.getElementById('root');
const initialState = {};
const store = storeFactory(initialState);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={translationMessages}>
        <Main />
      </LanguageProvider>
    </Provider>,
    rootElement,
  );
};

if (module.hot) {
  module.hot.accept(['utils/i18n', 'containers/Main'], () => {
    ReactDOM.unmountComponentAtNode(rootElement);
    render();
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(import('intl'));
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
      import('intl/locale-data/jsonp/zh.js'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}
