import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import store from 'redux/configureStore'

import App from './app'

const throwError = ({ error }) => { throw error }

render(
  <AppContainer errorReporter={throwError}>
    <App store={store} />
  </AppContainer>,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept('./app', () => {
    System.import('./app').then((RootModule) => {
      const UpdatedRoot = RootModule.default

      render(
        <AppContainer errorReporter={throwError}>
          <UpdatedRoot store={store} />
        </AppContainer>,
        document.getElementById('root'),
      )
    })
  })
}
