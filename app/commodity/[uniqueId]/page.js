"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  ReferenceLine
} from "recharts"

function fmtDate(d) {
  try {
    const opt = { month: "short", day: "numeric" }
    return new Date(d).toLocaleDateString(undefined, opt)
  } catch {
    return d
  }
}

function numberize(val) {
  const n = Number(val)
  if (Number.isNaN(n)) return 0
  return n
}

function calcStats(data) {
  const rates = data.map(d => numberize(d.rate))
  if (rates.length === 0) 
  {
    return { avg: 0, min: 0, max: 0, std: 0 }
  }
  const sum = rates.reduce((a, b) => a + b, 0)
  const avg = sum / rates.length
  const min = Math.min(...rates)
  const max = Math.max(...rates)
  const variance = rates.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / rates.length
  const std = Math.sqrt(variance)
  return { avg, min, max, std }
}

export default function CommodityView() {
  const params = useParams()
  const router = useRouter()
  const uniqueID = params?.uniqueId
  const [commodity, setCommodity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState("30")
  const [err, setErr] = useState("")

  useEffect(() => {
    if (!uniqueID) return
    const fetchData = async () => {
      setLoading(true)
      setErr("")
      try {
        const res = await fetch(`/api/commodity_actions/returnOne?uniqueId=${uniqueID}`, { method: "GET", cache: "no-store" })
        if (res.status === 200) {
          const data = await res.json()
          setCommodity(data)
        } else {
          setErr("Not found")
        }
      } catch {
        setErr("Failed to load")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [uniqueID])

  const prices = commodity?.price ?? []

  const filtered = useMemo(() => {
    if (!prices.length) return []
    if (range === "all") return prices
    const n = Number(range)
    return prices.slice(-n)
  }, [prices, range])

  const latest = filtered[filtered.length - 1]
  const prev = filtered[filtered.length - 2]
  const latestRate = numberize(latest?.rate)
  const prevRate = numberize(prev?.rate)
  const delta = latest && prev ? latestRate - prevRate : 0
  const pct = latest && prev ? ((latestRate - prevRate) / (prevRate || 1)) * 100 : 0

  const statsAll = useMemo(() => calcStats(filtered), [filtered])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="h-8 w-40 rounded-lg bg-gray-200 animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
                <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
              </div>
            ))}
          </div>
          <div className="h-[360px] rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
            <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (err || !commodity) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-gray-800 font-semibold text-lg">No Page Found</p>
          <button onClick={() => router.push("/")} className="mt-3 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:opacity-90">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <button onClick={() => router.back()} className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100">
                Back
              </button>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${pct > 0 ? "bg-green-100 text-green-700" : pct < 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                {pct > 0 ? "Rising" : pct < 0 ? "Falling" : "Stable"}
              </span>
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{commodity.name}</h1>
            <p className="text-gray-500 text-sm">{commodity.division} • Updated {commodity.updatedDate}</p>
          </div>
          <div className="flex items-end gap-6">
            <div className="text-right">
              <div className="text-xs text-gray-500">Latest Rate</div>
              <div className="text-3xl font-extrabold text-gray-900">{latestRate?.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-base font-semibold text-gray-500">BDT/kg</span></div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Change</div>
              <div className={`text-lg font-semibold ${delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-gray-700"}`}>
                {delta > 0 && "+"}{delta.toFixed(2)} ({pct > 0 && "+"}{pct.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {["7", "30", "90", "all"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-xl text-sm border ${range === r ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              {r === "all" ? "All" : `${r}d`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filtered.map(d => ({ ...d, dateLabel: fmtDate(d.date) }))} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                  <defs>
                    <linearlinear id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearlinear>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dateLabel" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} width={60} />
                  <Tooltip
                    formatter={(val, name) => [`${Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 })} BDT/kg`, "Rate"]}
                    labelFormatter={(l) => `Date: ${l}`}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
                  />
                  <ReferenceLine y={statsAll.avg} stroke="#9ca3af" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="rate" stroke="#2563eb" fill="url(#g1)" strokeWidth={2} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-rows-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs text-gray-500">Average</div>
              <div className="text-2xl font-bold text-gray-900">{statsAll.avg.toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{`BDT/${commodity.price[0].unit}`}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs text-gray-500">24h Change</div>
              <div className={`text-2xl font-bold ${delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-gray-900"}`}>
                {delta > 0 && "+"}{delta.toFixed(2)}
              </div>
              <div className="text-gray-500 text-xs">{pct > 0 && "+"}{pct.toFixed(2)}%</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs text-gray-500">High</div>
              <div className="text-2xl font-bold text-gray-900">{statsAll.max.toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{`BDT/${commodity.price[0].unit}`}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs text-gray-500">Low</div>
              <div className="text-2xl font-bold text-gray-900">{statsAll.min.toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{`BDT/${commodity.price[0].unit}`}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-900">Momentum</div>
              <span className="text-xs text-gray-500">Last {range === "all" ? filtered.length : range}d</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filtered.map(d => ({ ...d, dateLabel: fmtDate(d.date) }))}>
                  <XAxis dataKey="dateLabel" hide />
                  <YAxis hide />
                  <Tooltip
                    formatter={(val) => [`${Number(val).toFixed(2)} BDT/kg`, "Rate"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#111827" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-gray-600">Volatility σ {statsAll.std.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-900">Recent Prices</div>
              <span className="text-xs text-gray-500">Most recent 10</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">{`Rate (BDT/${commodity.price[0].unit})`}</th>
                    <th className="py-2">Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.slice(-10).map((row, idx, arr) => {
                    const prev = arr[idx - 1]
                    const d = prev ? numberize(row.rate) - numberize(prev.rate) : 0
                    return (
                      <tr key={row.date + idx} className="border-t border-gray-100">
                        <td className="py-2 pr-4 text-gray-800">{fmtDate(row.date)}</td>
                        <td className="py-2 pr-4 font-medium text-gray-900">{numberize(row.rate).toFixed(2)}</td>
                        <td className={`py-2 ${d > 0 ? "text-green-600" : d < 0 ? "text-red-600" : "text-gray-500"}`}>
                          {d > 0 && "+"}{d.toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="text-xs text-gray-500">ID {commodity.uniqueID}</div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:opacity-90"
          >
            Browse All Commodities
          </button>
        </div>
      </div>
    </div>
  )
}
