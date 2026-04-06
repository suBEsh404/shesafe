import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ApiHealth } from './components/ApiHealth'
import { StorageMeter } from './components/StorageMeter'
import { SecuritySettings } from './components/SecuritySettings'
import {
  clearSettingsActionMessage,
  generateAuditReport,
  loadSettings,
  reviewSecurityControls,
} from './settingsSlice'
import { Loader } from '../../components/ui/Loader'
import { ErrorState } from '../../components/shared/ErrorState'

export const SettingsPage = () => {
  const dispatch = useAppDispatch()
  const {
    apiHealth,
    storageUsed,
    storageTotal,
    securityLevel,
    status,
    actionStatus,
    actionMessage,
    error,
  } = useAppSelector((state) => state.settings)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadSettings())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (!actionMessage) return
    const timer = window.setTimeout(() => {
      dispatch(clearSettingsActionMessage())
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [actionMessage, dispatch])

  const handleReviewControls = () => {
    const notes = window.prompt('Optional review note') ?? ''
    dispatch(reviewSecurityControls(notes))
  }

  const handleGenerateReport = () => {
    dispatch(generateAuditReport())
  }

  return (
    <div className="content">
      <section className="page-title">
        <div>
          <h1>Settings</h1>
          <p>Infrastructure configuration and compliance posture.</p>
        </div>
      </section>

      {status === 'loading' && <Loader />}
      {status === 'failed' && (
        <ErrorState message={error ?? 'Unable to load settings.'} />
      )}
      {status === 'succeeded' && (
        <section className="grid-2">
          <ApiHealth status={apiHealth} />
          <StorageMeter used={storageUsed} total={storageTotal} />
          <SecuritySettings
            level={securityLevel}
            onReview={handleReviewControls}
            busy={actionStatus === 'loading'}
          />
          <div className="panel">
            <p className="panel-title">Audit Mode</p>
            <p className="panel-sub">Continuous logging enabled</p>
            <button
              className="pill"
              onClick={handleGenerateReport}
              disabled={actionStatus === 'loading'}
            >
              Generate report
            </button>
            {actionMessage && (
              <p className={actionStatus === 'failed' ? 'form-error' : 'panel-sub'}>
                {actionMessage}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default SettingsPage
