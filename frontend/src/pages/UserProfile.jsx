import React from 'react'
import {useUser} from "../contexts/UserContext"
import { OwnerNFTProvider } from '../contexts/OwnerNFTContext';
import OwnerNFTList from '../components/OwnerNFTList';

const UserProfile = () => {
  const {user, loading, error} = useUser();

  if (loading) return <p>Loading user data</p>
  if (error) return <p>Error : {error}</p>

  return (
    <OwnerNFTProvider>
      <h2>{user.name}</h2><br />
      <h4>Role</h4>
      <p>{user.type}</p> <br />
      <p>Public Address: {user.address}</p>

      <h2>Minted Recipes</h2>
      <OwnerNFTList/>
    </OwnerNFTProvider>
  )
}

export default UserProfile