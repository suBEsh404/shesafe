import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts'

export type BarPoint = {
  name: string
  value: number
}

export const BarChart = ({ data }: { data: BarPoint[] }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={220}>
        <ReBarChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <Tooltip
            cursor={{ fill: 'rgba(11,31,58,0.06)' }}
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #d8dee6',
              color: '#1f2937',
            }}
          />
          <Bar dataKey="value" fill="#0b1f3a" radius={[2, 2, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}
