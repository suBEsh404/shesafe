import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

export type PiePoint = {
  name: string
  value: number
}

const colors = ['#38bdf8', '#22c55e', '#f59e0b', '#ef4444']

export const PieChart = ({ data }: { data: PiePoint[] }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={220}>
        <RePieChart>
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #d8dee6',
              color: '#1f2937',
            }}
          />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </RePieChart>
      </ResponsiveContainer>
    </div>
  )
}
