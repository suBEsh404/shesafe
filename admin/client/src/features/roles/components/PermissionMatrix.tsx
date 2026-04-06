interface Props {
  permissions: Record<string, string[]>
}

export const PermissionMatrix = ({ permissions }: Props) => {
  return (
    <div className="stack">
      {Object.entries(permissions).map(([role, perms]) => (
        <div key={role} className="stack-item">
          <div>
            <p className="panel-title">{role}</p>
            <p className="panel-sub">{perms.join(' | ')}</p>
          </div>
          <span className="muted">{perms.length} permissions</span>
        </div>
      ))}
    </div>
  )
}
