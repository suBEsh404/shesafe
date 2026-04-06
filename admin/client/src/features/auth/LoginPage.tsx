import { ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { loginUser } from '../../store/authSlice'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('admin@secure.in')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => navigate('/', { replace: true }))
      .catch(() => {})
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div>
          <div className="auth-mark">
            <ShieldCheck size={18} strokeWidth={2} />
            <span>Women Safety Command</span>
          </div>
          <p className="eyebrow">Secure authority access</p>
          <h1>Sign in to the Evidence Portal</h1>
          <p className="panel-sub">
            Access the internal blockchain evidence management dashboard for
            police, forensic, and supervisory review teams.
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={10}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <Button className="btn-primary" type="submit">
            {status === 'loading' ? 'Signing in...' : 'Enter secure workspace'}
          </Button>
        </form>
        <Button
          className="btn"
          type="button"
          onClick={() => navigate('/register')}
        >
          Create internal account
        </Button>
      </div>
    </div>
  )
}

export default LoginPage
