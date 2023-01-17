import { useState } from 'react'
import { datadogLogs } from '@datadog/browser-logs'

import './App.css'

import { axios } from './lib/axios'

const BadComponent = () => {
  throw new Error('BadComponent error')
}

const ApiCall402 = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    void (await axios.get('/user'))
  } catch (e) {
    datadogLogs.logger.warn('ApiCall402 error', { name: 'ApiCall402', id: 123 })
  }
}

const ApiCall500 = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    void (await axios.get('/login'))
  } catch (e) {
    datadogLogs.logger.error('ApiCall500 error', { name: 'ApiCall500', id: 456 })
  }
}

const App = () => {
  const [errorIsShown, setErrorIsShown] = useState(false)
  return (
    <div className="App">
      <h1>Sentry Sample</h1>
      <div className="card">
        {/* ボタン押下で例外を発生させる */}
        <button
          type="button"
          onClick={() => {
            setErrorIsShown(true)
          }}
        >
          Sentry.ErrorBoundaryで例外を補足
        </button>
        <button
          type="button"
          onClick={() => {
            datadogLogs.logger.info('info level Exception test', { name: 'info', id: 789 })
          }}
        >
          Infoレベルのエラー
        </button>
        <button
          type="button"
          onClick={() => {
            datadogLogs.logger.error('error level Exception test', { name: 'error', id: 999 })
          }}
        >
          Errorレベルのエラー
        </button>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button type="button" onClick={() => ApiCall402()}>
          API実行(402エラー)
        </button>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button type="button" onClick={() => ApiCall500()}>
          API実行(500エラー)
        </button>
        {errorIsShown && <BadComponent />}
      </div>
    </div>
  )
}

export default App
