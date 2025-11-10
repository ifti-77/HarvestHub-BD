'use client'
import { signOut, useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'

function AdminDashboard() {
  const { data: session } = useSession()

  const today = new Date().toLocaleDateString();
  const [postCommodityActionElement, setPostCommodityActionElement] = useState(true)
  const [commodity, setCommodity] = useState({
    name: "",
    division: "",
    price: [{ date: today, rate: '', unit: "" }],
    updatedDate: today,
  })
  const [commodities, setCommodities] = useState([])
  const [updateBtnClicked, setUpdateBtnClicked] = useState(true)

  useEffect(() => {
    commodities.length === 0 && fetchCommodites()
  }, [])

  const fetchCommodites = async () => {
    const res = await fetch('/api/commodity_actions', {
      method: "GET",
    })

    if (res.status === 200) {
      const data = await res.json()
      setCommodities(data)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-50 p-6">
        <div className="max-w-xl w-full text-center bg-white p-8 rounded-2xl shadow">
          <p className="text-gray-700 text-lg font-medium">No Page found!</p>
        </div>
      </div>
    )
  }



  const returnCommodityActionElement = () => {

    const handleCommodityInputs = (e) => {
      if (e.target.name === 'price') {
        setCommodity({ ...commodity, [e.target.name]: [{ ...commodity.price[commodity.price.length - 1], rate: e.target.value }] })
      }
      else if (e.target.name === 'unit') {
        setCommodity({ ...commodity, price: [{ ...commodity.price[commodity.price.length - 1], [e.target.name]: e.target.value }] })
      }
      else {
        setCommodity({ ...commodity, [e.target.name]: e.target.value })
      }

      console.log(commodity);
    }

    if (postCommodityActionElement) {

      const handleCommoditySubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('/api/commodity_actions', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(commodity)
        })
        if (res.status === 200) {
          alert("Commodity created successfully")
          const result = await res.json()
          setCommodities(prev => [...prev, result])
          console.log(result)
        }
        else
          alert("failed to create Commodity")
      }


      return (
        <>
          <form className='flex flex-wrap items-center gap-3 justify-center p-6 bg-white rounded-xl shadow-md border border-gray-100'
            onSubmit={handleCommoditySubmit}>
            <input type='text' placeholder='Item-Name' name='name' onChange={handleCommodityInputs} value={commodity.name}
              className='w-44 px-3 py-2 border rounded-md shadow-sm text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm' />
            <select name='division' onChange={handleCommodityInputs}
              className='w-44 px-3 py-2 border rounded-md shadow-sm bg-white text-indigo-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'>
              <option hidden>Select Division</option>
              <option value={'Dhaka'}>Dhaka</option>
              <option value={'Sylhet'}>Sylhet</option>
              <option value={'Chittagong'}>Chittagong</option>
              <option value={'Barisal'}>Barisal</option>
              <option value={'Khulna'}>Khulna</option>
              <option value={'Rajshahi'}>Rajshahi</option>
              <option value={'Rangpur'}>Rangpur</option>
            </select>
            <select name='unit' onChange={handleCommodityInputs}
              className='w-44 px-3 py-2 border rounded-md shadow-sm bg-white text-indigo-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'>
              <option hidden>Select Unit</option>
              <option value="g">Gram (g)</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="mg">Milligram (mg)</option>
              <option value="lb">Pound (lb)</option>
              <option value="oz">Ounce (oz)</option>
              <option value="ml">Milliliter (ml)</option>
              <option value="l">Liter (L)</option>
              <option value="pcs">Pieces (pcs)</option>
              <option value="pkt">Packet</option>
              <option value="dozen">Dozen</option>
              <option value="bottle">Bottle</option>
              <option value="bag">Bag</option>
              <option value="box">Box</option>
              <option value="can">Can</option>
              <option value="bundle">Bundle</option>
              <option value="jar">Jar</option>
              <option value="sachet">Sachet</option>
            </select>
            <input type='number' min={1} placeholder='Price-BDT' name='price' onChange={handleCommodityInputs} value={commodity.price[commodity.price.length - 1].rate}
              className='w-36 px-3 py-2 border rounded-md shadow-sm text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm' />
            <button type='submit'
              className='ml-2 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition'>
              Create Commodity
            </button>
          </form>
        </>
      )
    }
    else {

      const handleUpdateCommodity = async (e) => {
        e.preventDefault()
        const res = await fetch('/api/commodity_actions', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(commodity)
        })

        res.status === 200 ? alert('Commodity has been updated') : alert('failed to update Commodity')
        res.status === 200 && setUpdateBtnClicked(true)
        if (res.status === 200) {
          setCommodities(prev => prev.map(com => {
            if (com.uniqueID === commodity.uniqueID) {
              return {
                ...com,
                name: commodity.name,
                division: commodity.division,
                price: [...com.price, ...commodity.price],
                updatedDate: commodity.updatedDate
              }
            }
            return com
          }))

        }
      }
      const handleDeleteProccess = async (commo) => {
        const res = await fetch('/api/commodity_actions', {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(commo)
        })
        if (res.status === 200) {
          setCommodities(prev => prev.filter(c => c.uniqueID !== commo.uniqueID))
        }
      }

      const UpdateOperation = (commo) => {
        setCommodity(commo)
        setUpdateBtnClicked(false)

      }

      return (
        <>
          <div className='mt-5'>
            {updateBtnClicked ? (<div className='overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100 p-4'>
              <table className='min-w-full divide-y divide-gray-200 table-auto'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Unique ID</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Item Name</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Item Division</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Current Price</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Update Date</th>
                    <th className='px-4 py-3 text-center text-sm font-semibold text-gray-700' colSpan={2}>Actions</th>
                    {/* <th className='px-4 py-3'></th> */}
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-100'>
                  {commodities.length !== 0 && commodities.map(c => (
                    <tr key={c.uniqueID} className='hover:bg-gray-50'>
                      <td className='px-4 py-3 text-sm text-gray-600'>{c.uniqueID}</td>
                      <td className='px-4 py-3 text-sm text-gray-600'>{c.name}</td>
                      <td className='px-4 py-3 text-sm text-gray-600'>{c.division}</td>
                      <td className='px-4 py-3 text-sm text-gray-600'>{c.price[c.price.length - 1].rate}</td>
                      <td className='px-4 py-3 text-sm text-gray-600'>{c.updatedDate}</td>
                      <td className='px-4 py-3'>
                        <button className='px-3 py-1 rounded-md bg-amber-500 text-white hover:brightness-95 transition' onClick={() => UpdateOperation(c)}>Update</button>
                      </td>
                      <td className='px-4 py-3'>
                        <button className='px-3 py-1 rounded-md bg-red-500 text-white hover:brightness-95 transition' onClick={() => handleDeleteProccess(c)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>) : (<div className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
              <form className='flex flex-wrap gap-3 items-center justify-center' onSubmit={handleUpdateCommodity}>
                <input type='text' placeholder='name' name='name' onChange={handleCommodityInputs} value={commodity.name}
                  className='w-64 px-3 py-2 border rounded-md shadow-sm text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm' />
                <select name='division' onChange={handleCommodityInputs} value={commodity.division}
                  className='w-44 px-3 py-2 border rounded-md shadow-sm bg-white text-sm text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                  <option hidden>{commodity.division}</option>
                  <option value={'Dhaka'}>Dhaka</option>
                  <option value={'Sylhet'}>Sylhet</option>
                  <option value={'Chittagong'}>Chittagong</option>
                  <option value={'Barisal'}>Barisal</option>
                  <option value={'Khulna'}>Khulna</option>
                  <option value={'Rajshahi'}>Rajshahi</option>
                  <option value={'Rangpur'}>Rangpur</option>
                </select>
                <select name='unit' onChange={handleCommodityInputs}
                  className='w-44 px-3 py-2 border rounded-md shadow-sm bg-white text-indigo-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                  <option hidden>{commodity.price[commodity.price.length - 1].unit}</option>
                  <option value="g">Gram (g)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="mg">Milligram (mg)</option>
                  <option value="lb">Pound (lb)</option>
                  <option value="oz">Ounce (oz)</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="l">Liter (L)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="pkt">Packet</option>
                  <option value="dozen">Dozen</option>
                  <option value="bottle">Bottle</option>
                  <option value="bag">Bag</option>
                  <option value="box">Box</option>
                  <option value="can">Can</option>
                  <option value="bundle">Bundle</option>
                  <option value="jar">Jar</option>
                  <option value="sachet">Sachet</option>
                </select>
                <input type='number' placeholder='price' name='price' onChange={handleCommodityInputs} value={commodity.price[commodity.price.length - 1].rate}
                  className='w-40 px-3 py-2 border rounded-md shadow-sm text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm' />
                <div className='flex items-center gap-2'>
                  <button type='submit' className='inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition'>Update</button>
                  <button type='button' onClick={() => {
                    setUpdateBtnClicked(true)
                    setCommodity(
                      {
                        name: "",
                        division: "",
                        price: [{ date: today, rate: 0 }],
                        updatedDate: today,
                      }
                    )
                  }} className='inline-flex items-center gap-2 bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition'>Cancel</button>
                </div>
              </form>
            </div>)}

          </div>
        </>
      )
    }

  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <p className='text-lg text-gray-700'>Welcome Admin- <span className='font-semibold text-indigo-600'>@{session.user.id}</span></p>
          <div className='flex gap-4'>
            <button onClick={() => setPostCommodityActionElement(true)} className={`px-4 py-2 ${postCommodityActionElement ? "bg-indigo-600" : "bg-white"}  border border-gray-200 rounded-md 
            hover:${postCommodityActionElement ? "bg-indigo-700" : "bg-gray-50"} 
            ${!postCommodityActionElement && "text-indigo-300"} transition text-sm`}>Post Commodities</button>
            <button onClick={() => setPostCommodityActionElement(false)} className={`px-4 py-2 ${postCommodityActionElement ? "bg-white" : "bg-indigo-600"} border border-gray-200 rounded-md 
            hover:${postCommodityActionElement ? "bg-gray-50" : "bg-indigo-700"} 
            ${postCommodityActionElement && "text-indigo-300"} transition text-sm`}>Show Commodities</button>
          </div>
          <button onClick={() => { signOut({ callbackUrl: '/signin' }) }} className={`px-4 py-2 bg-red-400 border border-gray-200 rounded-md 
            hover:bg-red-500 text-white transition text-sm`}>Signout</button>
        </div>
        <div>
          {returnCommodityActionElement()}
        </div>
      </div>
    </div>
  )
}
export default AdminDashboard
