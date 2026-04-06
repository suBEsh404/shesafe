import { UserRoundPlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { registerUser } from '../../store/authSlice'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(registerUser({ name, email, password, role }))
      .unwrap()
      .then(() => navigate('/', { replace: true }))
      .catch(() => {})
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div>
          <div className="auth-mark">
            <UserRoundPlus size={18} strokeWidth={2} />
            <span>Authority Provisioning</span>
          </div>
          <p className="eyebrow">Internal registration</p>
          <h1>Create a secure authority account</h1>
          <p className="panel-sub">
            Register a new internal user for evidence review, audit, or
            supervisory administration duties.
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Full Name</span>
            <Input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
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
          <label className="field">
            <span>Role</span>
            <select
              className="input"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="user">User</option>
              <option value="authority">Authority</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <Button className="btn-primary" type="submit">
            {status === 'loading' ? 'Creating...' : 'Create authority account'}
          </Button>
        </form>
        <Button className="btn" type="button" onClick={() => navigate('/login')}>
          Back to sign in
        </Button>
      </div>
    </div>
  )
}

export default RegisterPage
