'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { TrendingUp, Activity, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface PieChartProps {
  data: {
    up: number
    down: number
    flapping: number
  }
  className?: string
}

interface ChartSegment {
  label: string
  value: number
  color: string
  hoverColor: string
  icon: React.ReactNode
  percentage: number
  strokeDasharray: string
  strokeDashoffset: string
  delay: number
}

export function ModernPieChart({ data, className }: PieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [isAnimated, setIsAnimated] = useState(false)
  
  const total = data.up + data.down + data.flapping
  const radius = 90
  const strokeWidth = 16
  const circumference = 2 * Math.PI * radius

  // Trigger animation on mount - must be called before any early returns
  React.useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const segments = useMemo((): ChartSegment[] => {
    if (total === 0) return []

    const upPercentage = (data.up / total) * 100
    const downPercentage = (data.down / total) * 100
    const flappingPercentage = (data.flapping / total) * 100

    let currentOffset = 0

    return [
      {
        label: 'En ligne',
        value: data.up,
        color: 'rgb(34, 197, 94)', // green-500
        hoverColor: 'rgb(22, 163, 74)', // green-600
        icon: <Activity className="w-4 h-4" />,
        percentage: upPercentage,
        strokeDasharray: `${(upPercentage / 100) * circumference} ${circumference}`,
        strokeDashoffset: `-${(currentOffset / 100) * circumference}`,
        delay: 0
      },
      {
        label: 'Hors ligne',
        value: data.down,
        color: 'rgb(239, 68, 68)', // red-500
        hoverColor: 'rgb(220, 38, 38)', // red-600
        icon: <AlertTriangle className="w-4 h-4" />,
        percentage: downPercentage,
        strokeDasharray: `${(downPercentage / 100) * circumference} ${circumference}`,
        strokeDashoffset: `-${((currentOffset += upPercentage) / 100) * circumference}`,
        delay: 200
      },
      {
        label: 'Instable',
        value: data.flapping,
        color: 'rgb(234, 179, 8)', // yellow-500
        hoverColor: 'rgb(202, 138, 4)', // yellow-600
        icon: <TrendingUp className="w-4 h-4" />,
        percentage: flappingPercentage,
        strokeDasharray: `${(flappingPercentage / 100) * circumference} ${circumference}`,
        strokeDashoffset: `-${((currentOffset += downPercentage) / 100) * circumference}`,
        delay: 400
      }
    ].filter(segment => segment.value > 0)
  }, [data, total, circumference])

  if (total === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Répartition des site(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-3">
            <div className="w-16 h-16 rounded-full border-4 border-border animate-pulse bg-muted/20"></div>
            <div className="text-sm">Aucun site détecté</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full transition-all duration-300 hover:shadow-lg", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Répartition des sites
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {total} site{total > 1 ? 's' : ''} au total
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          {/* SVG Pie Chart */}
          <div className="relative group">
            <svg 
              width="220" 
              height="220" 
              viewBox="0 0 220 220"
              className="transform -rotate-90 transition-transform duration-300 group-hover:scale-105"
            >
              {/* Background circle */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="rgb(241, 245, 249)" // slate-100
                strokeWidth={strokeWidth}
                className="dark:stroke-slate-800"
              />
              
              {/* Animated segments */}
              {segments.map((segment) => (
                <circle
                  key={segment.label}
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke={hoveredSegment === segment.label ? segment.hoverColor : segment.color}
                  strokeWidth={hoveredSegment === segment.label ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer drop-shadow-lg"
                  style={{
                    strokeDashoffset: isAnimated ? segment.strokeDashoffset : circumference,
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: `${segment.delay}ms`
                  }}
                  onMouseEnter={() => setHoveredSegment(segment.label)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              ))}
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-3xl font-bold text-foreground transition-all duration-300 group-hover:scale-110">
                {total}
              </div>
              <div className="text-sm text-muted-foreground">site(s)</div>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-3">
            {segments.map((segment) => (
              <div
                key={segment.label}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer",
                  "hover:bg-accent/50 border border-transparent",
                  hoveredSegment === segment.label && "bg-accent border-border shadow-sm"
                )}
                onMouseEnter={() => setHoveredSegment(segment.label)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full transition-all duration-200"
                    style={{ 
                      backgroundColor: hoveredSegment === segment.label ? segment.hoverColor : segment.color,
                      boxShadow: hoveredSegment === segment.label ? `0 0 12px ${segment.color}` : 'none'
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{segment.icon}</span>
                    <span className="font-medium">{segment.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {segment.percentage.toFixed(1)}%
                  </Badge>
                  <span className="font-semibold text-lg min-w-[2ch] text-right">
                    {segment.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 