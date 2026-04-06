import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { BlockCard } from './components/BlockCard'
import { NetworkStatus } from './components/NetworkStatus'
import { TransactionList } from './components/TransactionList'
import { PieChart } from '../../components/charts/PieChart'
import { loadBlockchain } from './blockchainSlice'
import { Loader } from '../../components/ui/Loader'
import { ErrorState } from '../../components/shared/ErrorState'

export const BlockchainPage = () => {
  const dispatch = useAppDispatch()
  const { status, latestBlocks, transactions, loadStatus, error } =
    useAppSelector((state) => state.blockchain)
  const statusBreakdown = [
    {
      name: 'Confirmed',
      value: transactions.filter((t) => t.status === 'confirmed').length,
    },
    {
      name: 'Pending',
      value: transactions.filter((t) => t.status === 'pending').length,
    },
  ]

  useEffect(() => {
    if (loadStatus === 'idle') {
      dispatch(loadBlockchain())
    }
  }, [dispatch, loadStatus])

  return (
    <div className="content">
      <section className="page-title">
        <div>
          <h1>Blockchain Monitor</h1>
          <p>Validator activity and chain health in near real time.</p>
        </div>
        <NetworkStatus status={status} />
      </section>

      {loadStatus === 'loading' && <Loader />}
      {loadStatus === 'failed' && (
        <ErrorState message={error ?? 'Unable to load blockchain data.'} />
      )}
      {loadStatus === 'succeeded' && (
        <>
          <section className="grid-2">
            {latestBlocks.map((block) => (
              <BlockCard key={block.id} block={block} />
            ))}
            <div className="panel small-card">
              <p className="panel-title">Average Gas</p>
              <p className="kpi-value">14.2</p>
              <p className="panel-sub">Gwei last 30 mins</p>
            </div>
            <div className="panel">
              <div className="panel-header">
                <div>
                  <p className="panel-title">Tx Status Mix</p>
                  <p className="panel-sub">Last 30 minutes</p>
                </div>
              </div>
              <PieChart data={statusBreakdown} />
            </div>
          </section>

          <section className="panel table-panel">
            <div className="panel-header">
              <div>
                <p className="panel-title">Latest Transactions</p>
                <p className="panel-sub">Validator-confirmed events</p>
              </div>
            </div>
            <TransactionList items={transactions} />
          </section>
        </>
      )}
    </div>
  )
}

export default BlockchainPage
