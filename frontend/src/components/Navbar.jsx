import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <Link to='/mint-recipe'>Mint Your Recipe</Link>

        <Link to='/profile'>Profile</Link>

    </div>
  )
}

export default Navbar