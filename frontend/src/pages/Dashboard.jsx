import React from 'react'
import { NFTProvider } from '../contexts/NFTContext'
import NFTList from '../components/NFTList'

function Dashboard() {
  return (
    <div>
      Dashboard
      <NFTList />
    </div>
  )
}

export default Dashboard