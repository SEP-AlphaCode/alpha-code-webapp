"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  type ChartConfig,
} from "@/components/ui/chart"

interface BarChartComponentProps {
  data: any[]
  config: ChartConfig
  className?: string
  xAxisKey?: string
  yAxisKey?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
}

export function BarChartComponent({
  data,
  config,
  className,
  xAxisKey = "name",
  yAxisKey = "value",
  showGrid = true,
  showTooltip = true,
  showLegend = false,
}: BarChartComponentProps) {
  return (
    <ChartContainer config={config} className={className}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis hide />
        {showTooltip && (
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        )}
        {Object.keys(config).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            radius={8}
          />
        ))}
        {showLegend && <Legend />}
      </BarChart>
    </ChartContainer>
  )
}
