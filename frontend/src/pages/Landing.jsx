import React from 'react'
import img1 from "../assets/landing/2.jpg"
import "../styles/pages/landing.css"
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className='container'>
        <div className='text'>
            <h1>NFT based Recipe</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis placeat, dolorum quidem iusto animi quos ipsum, est temporibus omnis asperiores eveniet dolore officiis velit eos itaque soluta repudiandae? Asperiores, at?</p>
            <div className='actions'>
                <Link to="/store" className='browse'>Browse Menu</Link>
                <Link to="/mint-recipe" className='create'>Create Recipe</Link>
            </div>
        </div>
        <div className='image'>
            <img src = {img1}  alt="" />
        </div>
    </div>
  )
}

export default Landing