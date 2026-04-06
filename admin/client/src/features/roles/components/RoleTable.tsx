export const RoleTable = ({ roles }: { roles: string[] }) => {
  return (
    <div className="table">
      <div className="table-row head">
        <span>Role</span>
        <span>Description</span>
      </div>
      {roles.map((role) => (
        <div key={role} className="table-row">
          <span className="hash" data-label="Role">{role}</span>
          <span data-label="Description">Operational access profile</span>
        </div>
      ))}
    </div>
  )
}
