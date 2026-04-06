import { useEffect } from 'react'
import {
  ArrowUpRight,
  FolderKanban,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { loadOverview } from './overviewSlice'
import { Loader } from '../../components/ui/Loader'

export const OverviewPage = () => {
  const dispatch = useAppDispatch()
  const { activityCards, weeklyActivity, recentActivity, status, error } =
    useAppSelector((state) => state.overview)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadOverview())
    }
  }, [dispatch, status])

  return (
    <div className="content">
      <section className="page-title">
        <div>
          <p className="section-kicker">Home</p>
          <h1>Project Activity Summary</h1>
          <p>
            Review the latest evidence intake, authority operations, and access
            activity across the project in a single summarized dashboard.
          </p>
        </div>
        <div className="page-meta-card">
          <span className="page-meta-label">Dashboard mode</span>
          <strong>Card-based summary view</strong>
          <span className="page-meta-foot">Backed by dedicated activity endpoint</span>
        </div>
      </section>

      {status === 'loading' && <Loader />}
      {status === 'failed' && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-title">Project Activity Summary</p>
              <p className="panel-sub">
                Overview data is temporarily unavailable. Showing fallback summary cards.
              </p>
            </div>
          </div>
          <div className="summary-card-grid">
            <article className="summary-card">
              <div className="summary-card-head">
                <span className="section-kicker">Status</span>
              </div>
              <h3>Unavailable</h3>
              <p>{error ?? 'Unable to load overview data.'}</p>
            </article>
            <article className="summary-card">
              <div className="summary-card-head">
                <span className="section-kicker">Project activity</span>
              </div>
              <h3>0</h3>
              <p>No activity records are available right now.</p>
            </article>
            <article className="summary-card">
              <div className="summary-card-head">
                <span className="section-kicker">Next step</span>
              </div>
              <h3>Retry later</h3>
              <p>Check API access or sign in with a role that can load overview data.</p>
            </article>
          </div>
        </section>
      )}
      {status === 'succeeded' && (
        <>
          <section className="summary-card-grid summary-card-grid-wide">
            {activityCards.map((item) => (
              <article key={item.title} className={`summary-card tone-${item.tone ?? 'default'}`}>
                <div className="summary-card-head">
                  <span className="section-kicker">{item.title}</span>
                  <FolderKanban size={14} strokeWidth={2} />
                </div>
                <h3>{item.value}</h3>
                <p>{item.note}</p>
              </article>
            ))}
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-title">Weekly Project Activity Summary</p>
                <p className="panel-sub">
                  Day-wise view of evidence intake, review actions, and project movement.
                </p>
              </div>
            </div>
            <div className="summary-card-grid">
              {weeklyActivity.length > 0 ? (
                weeklyActivity.map((item) => (
                  <article key={item.day} className="summary-card">
                    <div className="summary-card-head">
                      <span className="section-kicker">{item.day}</span>
                      <ArrowUpRight size={14} strokeWidth={2} />
                    </div>
                    <h3>{item.value}</h3>
                    <p>{item.summary}</p>
                  </article>
                ))
              ) : (
                <article className="summary-card">
                  <div className="summary-card-head">
                    <span className="section-kicker">No weekly activity</span>
                  </div>
                  <h3>0</h3>
                  <p>No project activity records were returned for the weekly summary.</p>
                </article>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-title">Recent Project Activity</p>
                <p className="panel-sub">
                  Latest operational events summarized from the evidence and blockchain flow.
                </p>
              </div>
            </div>
            <div className="summary-card-grid">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <article key={item.id} className="summary-card">
                    <div className="summary-card-head">
                      <span className="section-kicker">{item.category}</span>
                      <span className={`status ${item.status.toLowerCase()}`}>
                        <span className="status-dot" aria-hidden="true"></span>
                        {item.status}
                      </span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.subject}</p>
                    <p className="summary-card-meta">{item.note}</p>
                    <p className="summary-card-meta">{item.time}</p>
                    <p className="summary-card-meta hash">{item.reference}</p>
                  </article>
                ))
              ) : (
                <article className="summary-card">
                  <div className="summary-card-head">
                    <span className="section-kicker">No recent activity</span>
                  </div>
                  <h3>Nothing to show</h3>
                  <p>Recent project activity will appear here once overview data is available.</p>
                </article>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default OverviewPage
