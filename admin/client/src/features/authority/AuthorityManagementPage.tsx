import { type FormEvent, useEffect, useState } from 'react'
import { Building2, KeyRound, ShieldCheck, UserRoundPlus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { Loader } from '../../components/ui/Loader'
import { Input } from '../../components/ui/Input'
import { getStatusColor } from '../../utils/getStatusColor'
import {
  addAuthority,
  clearAuthorityMessage,
  loadAuthorities,
  updateAuthorityStatus,
} from './authoritySlice'

export const AuthorityManagementPage = () => {
  const dispatch = useAppDispatch()
  const { authorities, status, error, actionMessage, actionStatus } = useAppSelector(
    (state) => state.authority,
  )

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadAuthorities())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (!actionMessage) return
    const timer = window.setTimeout(() => {
      dispatch(clearAuthorityMessage())
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [actionMessage, dispatch])

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setFormError('Name, email, password, and confirm password are required.')
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setFormError('Password and confirm password must match.')
      return
    }

    dispatch(
      addAuthority({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        confirmPassword: trimmedConfirmPassword,
      }),
    )
      .unwrap()
      .then(() => {
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      })
      .catch(() => {})
  }

  const handleStatusToggle = (userId: string, nextStatus: 'active' | 'suspended') => {
    dispatch(updateAuthorityStatus({ userId, status: nextStatus }))
  }

  const activeAuthorities = authorities.filter((user) => user.status === 'active').length
  const suspendedAuthorities = authorities.filter((user) => user.status === 'suspended').length

  return (
    <div className="content">
      <section className="page-title">
        <div>
          <p className="section-kicker">Authority administration</p>
          <h1>Investigative Authority Registry</h1>
          <p>
            Provision government reviewers, control account activation, and maintain
            access for police, forensic, and supervisory units.
          </p>
        </div>
      </section>

      <section className="grid-4">
        <article className="metric-panel">
          <div className="metric-panel-top">
            <span className="section-kicker">Registered accounts</span>
            <Building2 size={16} strokeWidth={2} />
          </div>
          <h3>{authorities.length}</h3>
          <p>Total authority accounts configured for the secure review environment.</p>
        </article>
        <article className="metric-panel tone-verified">
          <div className="metric-panel-top">
            <span className="section-kicker">Active authorities</span>
            <ShieldCheck size={16} strokeWidth={2} />
          </div>
          <h3>{activeAuthorities}</h3>
          <p>Accounts currently cleared for case review and chain confirmation duties.</p>
        </article>
        <article className="metric-panel tone-flagged">
          <div className="metric-panel-top">
            <span className="section-kicker">Suspended accounts</span>
            <KeyRound size={16} strokeWidth={2} />
          </div>
          <h3>{suspendedAuthorities}</h3>
          <p>Accounts held from access until reactivated by a supervising administrator.</p>
        </article>
        <article className="metric-panel">
          <div className="metric-panel-top">
            <span className="section-kicker">Provisioning</span>
            <UserRoundPlus size={16} strokeWidth={2} />
          </div>
          <h3>Immediate</h3>
          <p>New accounts receive internal access without public-facing onboarding flows.</p>
        </article>
      </section>

      <section className="grid-2">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-title">Create Authority Account</p>
              <p className="panel-sub">Provision a secure internal reviewer identity</p>
            </div>
          </div>

          <form className="stack" onSubmit={handleCreate}>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Authority full name"
              aria-label="Authority name"
            />
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Authority email"
              aria-label="Authority email"
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              aria-label="Authority password"
              minLength={10}
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              aria-label="Confirm authority password"
              minLength={10}
            />
            {formError && <p className="form-error">{formError}</p>}
            <div className="panel-actions">
              <button
                type="submit"
                className="pill active"
                disabled={actionStatus === 'loading'}
              >
                Create Authority
              </button>
            </div>
          </form>
        </article>

        <article className="panel table-panel">
          <div className="panel-header">
            <div>
              <p className="panel-title">Authority Directory</p>
              <p className="panel-sub">Review status, activity, and account state</p>
            </div>
          </div>

          {actionMessage && (
            <p className={actionStatus === 'failed' ? 'form-error' : 'panel-sub'}>
              {actionMessage}
            </p>
          )}

          {status === 'loading' && <Loader />}
          {status === 'failed' && (
            <ErrorState message={error ?? 'Unable to load authorities.'} />
          )}
          {status === 'succeeded' && authorities.length === 0 && (
            <EmptyState
              title="No authorities yet"
              message="Create your first authority account from the panel."
            />
          )}
          {status === 'succeeded' && authorities.length > 0 && (
            <div className="table">
              <div className="table-row head">
                <span>Authority</span>
                <span>Official Email</span>
                <span>Status</span>
                <span>Last Active</span>
                <span>Control</span>
              </div>
              {authorities.map((user) => {
                const nextStatus = user.status === 'active' ? 'suspended' : 'active'
                const ctaLabel = user.status === 'active' ? 'Suspend' : 'Activate'

                return (
                  <div key={user.id} className="table-row">
                    <span className="hash" data-label="Authority">{user.name}</span>
                    <span data-label="Official Email">{user.email}</span>
                    <span className={getStatusColor(user.status)} data-label="Status">
                      <span className="status-dot" aria-hidden="true"></span>
                      {user.status}
                    </span>
                    <span className="muted" data-label="Last Active">{user.lastActive}</span>
                    <span data-label="Control">
                      <button
                        className="pill"
                        onClick={() => handleStatusToggle(user.id, nextStatus)}
                        disabled={actionStatus === 'loading'}
                      >
                        {ctaLabel}
                      </button>
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}

export default AuthorityManagementPage
