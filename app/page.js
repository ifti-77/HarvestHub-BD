"use client"
import Commodity from "./Component/Commodity"
import { useEffect, useState } from "react"
import StaticBDMap from "./Component/StaticBDMap"

export default function Home() {
  const [divisonValue, setDivisonValue] = useState("")
  const [maxCount, setMaxCount] = useState(5)
  const [searchItem, setSearchItem] = useState({ ItemName: "" })
  const [commodites, setCommodites] = useState([])
  const [onDIsplayCommidites, setOnDIsplayCommidites] = useState([])
  const [showAllCommodities, setshowAllCommodities] = useState(false)

  useEffect(() => {
    fetchCommodities()
  }, [])

  const fetchCommodities = async () => {
    const res = await fetch("/api/commodity_actions", {
      method: "GET",
      headers: { "content-type": "application/json" },
      body: JSON.stringify()
    })
    if (res.status === 200) {
      const data = await res.json()
      setCommodites(data)
    }
  }

  const handleSearchChange = (e) => {
    setSearchItem({ ...searchItem, [e.target.name]: e.target.value })
  }

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("search is on: ", searchItem.ItemName)
    }
  }

  const ReceiveDvisionValueFormMap = (value) => {
    setDivisonValue(value)
  }
  const SetOnDisplayValue = (value) =>{
    setOnDIsplayCommidites(value)
  }

  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome to HarvestHub-BD</h3>
                <p className="text-sm text-gray-500">Here you can find authentic price for today&apos;s market</p>
              </div>
              <div className="w-full md:w-96">
                <div className="relative">
                  <input
                    type="search"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 pl-10 text-gray-700 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    placeholder="Search Bar"
                    name="ItemName"
                    value={searchItem.ItemName}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearch}
                  />
                  <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {commodites.length > 0 ? (
            <div className="rounded-3xl border bg-white shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Showing</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-900 text-white">
                    {divisonValue ? divisonValue : "Latest"}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Total {commodites.length} items</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {(() => {
                  let filteredCommodities =
                    divisonValue !== ""
                      ? commodites.filter((c) => c.division === divisonValue ).slice(0,showAllCommodities?commodites.length:6)
                      : (!showAllCommodities?commodites.slice(0, 6): commodites)

                      // divisonValue !== ""
                      // ? (searchItem.ItemName===""?commodites.filter((c) => c.division === divisonValue ).slice(0,showAllCommodities?commodites.length:(6)):
                      //   commodites.filter((c) => c.division === divisonValue && c.name.match(new RegExp(searchItem.ItemName,'i'))).slice(0,showAllCommodities?commodites.length:(maxCount+1)))
                      // : (!showAllCommodities?commodites.slice(0, 6): commodites)

                    filteredCommodities = searchItem.ItemName!==''? filteredCommodities.filter((fc)=>fc.name.match(new RegExp(searchItem.ItemName,'i'))): filteredCommodities
                      if (divisonValue !== "" && filteredCommodities.length === 0) {
                    return (
                      <p className="col-span-full text-gray-500 text-center py-10">
                        No commodities found for <span className="font-semibold">{divisonValue}</span>.
                      </p>
                    )
                  }


                    return (
                      <>
                        {filteredCommodities.map((commodity, index) => (
                          <Commodity key={index} itemDetails={commodity} />
                        ))}
                        {filteredCommodities.length > 6 && (
                          <div className="col-span-full flex justify-center">
                            <button onClick={() => setshowAllCommodities(!showAllCommodities)}>
                              <span className="text-blue-600 mt-2 text-sm cursor-pointer py-1 px-4 border border-blue-200 rounded-full bg-blue-50 hover:bg-blue-100 transition">
                                {!showAllCommodities ? 'View More' : 'Hide All'}
                              </span>
                            </button>
                          </div>
                        )}
                      </>
                    )
                  
                })()}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border bg-white shadow-sm p-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin" />
              </div>
              <p className="mt-4 text-gray-600">No commodities available.</p>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
            <div className="relative min-h-[520px] rounded-3xl border bg-white shadow-sm p-3">
              <StaticBDMap valueToSend={ReceiveDvisionValueFormMap} />
              <button
                onClick={() => setDivisonValue("")}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-2xl bg-gray-900 text-white px-5 py-2 shadow-lg hover:opacity-90 active:scale-[.98] transition"
              >
                Show ALL
              </button>
            </div>
            <aside className="rounded-3xl border bg-white shadow-sm p-4">
              <div className="h-full w-full rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                Statistics Graph
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
