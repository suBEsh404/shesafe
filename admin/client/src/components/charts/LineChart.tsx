import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  Tooltip,
} from 'recharts'

export type LinePoint = {
  name: string
  value: number
}

export const LineChart = ({ data }: { data: LinePoint[] }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={220}>
        <ReLineChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <Tooltip
            cursor={{ stroke: '#0b1f3a' }}
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #d8dee6',
              color: '#1f2937',
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#0b1f3a" strokeWidth={2} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
