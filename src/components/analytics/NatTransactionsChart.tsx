"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface NatFusion {
  timestamp: string;
  point_de_vente: string;
}

interface ChartData {
  site: string;
  count: number;
}

function parseTimestamp(timestamp: string): number {
  // Remove timezone info for simplicity
  return new Date(timestamp.replace('+00:00', '').replace('Z', '')).getTime();
}

function isSameDay(ts: number, now: number): boolean {
  const d1 = new Date(ts);
  const d2 = new Date(now);
  return d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate();
}

function isWithinLast7Days(ts: number, now: number): boolean {
  return now - ts < 7 * 24 * 3600 * 1000;
}

function isDistinctTransaction(tx1: NatFusion, tx2: NatFusion): boolean {
  // For fusion endpoint, we only have one port per record, so use timestamp diff
  const t1 = parseTimestamp(tx1.timestamp);
  const t2 = parseTimestamp(tx2.timestamp);
  if (Math.abs(t1 - t2) > 30000) return true;
  return false;
}

function countDistinctTransactions(transactions: NatFusion[]): Record<string, number> {
  const grouped: Record<string, NatFusion[]> = {};
  transactions.forEach(tx => {
    if (!tx.point_de_vente || tx.point_de_vente.trim() === "") return;
    if (!grouped[tx.point_de_vente]) grouped[tx.point_de_vente] = [];
    grouped[tx.point_de_vente].push(tx);
  });
  const result: Record<string, number> = {};
  Object.entries(grouped).forEach(([site, txs]) => {
    const distinct: NatFusion[] = [];
    txs.forEach(current => {
      let isDistinct = true;
      for (const prev of distinct) {
        if (!isDistinctTransaction(current, prev)) {
          isDistinct = false;
          break;
        }
      }
      if (isDistinct) distinct.push(current);
    });
    result[site] = distinct.length;
  });
  return result;
}

// Blue gradient colors for top 10
const blueGradients = [
  '#2563eb', // blue-600
  '#3b82f6', // blue-500
  '#60a5fa', // blue-400
  '#93c5fd', // blue-300
  '#bfdbfe', // blue-200
  '#1e40af', // blue-800
  '#1d4ed8', // blue-700
  '#38bdf8', // sky-400
  '#0ea5e9', // sky-500
  '#0284c7', // sky-700
];
// Red gradient colors for histogram
const redGradients = [
  '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fee2e2', '#991b1b', '#b91c1c', '#f43f5e', '#be123c', '#e11d48',
  '#fb7185', '#fda4af', '#fecdd3', '#7f1d1d', '#9f1239', '#881337', '#fbbf24', '#f59e42', '#f87171', '#f43f5e',
];

function formatDateUTC(date: Date): string {
  return date.toLocaleDateString('fr-FR', { timeZone: 'UTC' });
}

export function NatTransactionsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [histogramData, setHistogramData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const histogramTimer = useRef<NodeJS.Timeout | null>(null);

  // Get the current time in UTC to use for all comparisons
  const nowUTC = new Date().getTime();

  // Top 10 chart: refresh every 60s
  const fetchTop10 = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch('https://monitor.linkafric.com/api/nat_tpe_fusion');
      const json = await res.json();
      const txs: NatFusion[] = json.data || [];
      // Top 10 for current day only, compared against a stable UTC timestamp
      const txsToday = txs.filter(tx => tx.point_de_vente && tx.point_de_vente.trim() !== "" && isSameDay(parseTimestamp(tx.timestamp), nowUTC));
      const countsToday = countDistinctTransactions(txsToday);
      const chartData = Object.entries(countsToday)
        .map(([site, count]) => ({ site, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setData(chartData);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Histogram: refresh every 1h
  const fetchHistogram = useCallback(async () => {
    try {
      const res = await fetch('https://monitor.linkafric.com/api/nat_tpe_fusion');
      const json = await res.json();
      const txs: NatFusion[] = json.data || [];
      // Histogram for last 7 days (cumulative), compared against a stable UTC timestamp
      const txs7d = txs.filter(tx => tx.point_de_vente && tx.point_de_vente.trim() !== "" && isWithinLast7Days(parseTimestamp(tx.timestamp), nowUTC));
      const counts7d = countDistinctTransactions(txs7d);
      const histoData = Object.entries(counts7d)
        .map(([site, count]) => ({ site, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      setHistogramData(histoData);
    } catch {
      // Do not set global error/loading for histogram
    }
  }, []);

  useEffect(() => {
    fetchTop10();
    const interval = setInterval(fetchTop10, 60000); // 60s polling
    return () => clearInterval(interval);
  }, [fetchTop10]);

  useEffect(() => {
    fetchHistogram();
    if (histogramTimer.current) clearInterval(histogramTimer.current);
    histogramTimer.current = setInterval(fetchHistogram, 3600000); // 1h polling
    return () => {
      if (histogramTimer.current) clearInterval(histogramTimer.current);
    };
  }, [fetchHistogram]);

  const todayUTC = formatDateUTC(new Date());

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full h-96 bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">TOP 10 sites TPE par tentatives de transactions — {todayUTC}</h2>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">Chargement...</div>
        ) : hasError ? (
          <div className="flex-1 flex items-center justify-center text-red-500">Erreur lors du chargement des données</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 16, right: 32, left: 32, bottom: 16 }}
            >
              <XAxis type="number" allowDecimals={false} label={{ value: 'Transactions', position: 'insideBottomRight', offset: -5 }} />
              <YAxis type="category" dataKey="site" width={200} />
              <Tooltip />
              <Bar dataKey="count">
                {data.map((entry, idx) => (
                  <Cell key={`cell-b-${idx}`} fill={blueGradients[idx % blueGradients.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Histogram for last 7 days (vertical, site names on x-axis) */}
      <div className="w-full h-96 bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">TOP 20 sites TPE — cumul sur 7 jours</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={histogramData}
            layout="horizontal"
            margin={{ top: 16, right: 32, left: 32, bottom: 80 }}
          >
            <XAxis type="category" dataKey="site" interval={0} angle={-90} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
            <YAxis type="number" allowDecimals={false} label={{ value: 'Transactions', angle: -90, position: 'insideLeft', offset: 0 }} />
            <Tooltip />
            <Bar dataKey="count">
              {histogramData.map((entry, idx) => (
                <Cell key={`cell-h-${idx}`} fill={redGradients[idx % redGradients.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 