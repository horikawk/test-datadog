import React from 'react'
import ReactDOM from 'react-dom/client'
import { datadogLogs } from '@datadog/browser-logs'

import { worker } from './__mocks__/api/browser'
import App from './App'
import './index.css'

datadogLogs.init({
  clientToken: 'pub4c4574424a5762b4c8e1c7cd67f40dc3',
  site: 'datadoghq.com',
  forwardErrorsToLogs: true,
  sampleRate: 100,
  // ログ送信前処理
  beforeSend: (event) => {
    // infoレベルは送信しない
    if (event.status === 'info') {
      return false
    }
    return true
  },
})

void worker.start()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
