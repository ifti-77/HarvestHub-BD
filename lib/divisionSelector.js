"use client"
import React, { useContext, useState } from 'react'

function divisionSelector({divisionName}) {
    const [division,SetDivision] = useState('Dhaka')
    const div = useContext()
  return (
    <div>divisionSelector</div>
  )
}

export default divisionSelector