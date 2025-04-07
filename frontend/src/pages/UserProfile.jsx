import React from 'react'
import {useUser} from "../contexts/UserContext"
import { OwnerNFTProvider } from '../contexts/OwnerNFTContext';
import OwnerNFTList from '../components/OwnerNFTList';
import { User, ChefHat, Wallet } from 'lucide-react';

const UserProfile = () => {
  const {user, loading, error} = useUser();
  const username = localStorage.getItem("username");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <OwnerNFTProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${username}&flip=false`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-orange-500"
                />
                <div className="absolute -bottom-2 -right-2 bg-orange-500 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ChefHat className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">{user.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wallet className="h-5 w-5 text-orange-500" />
                    <span className="font-mono text-sm">{user.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minted Recipes Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-orange-500" />
              Minted Recipes
            </h2>
            <OwnerNFTList />
          </div>
        </div>
      </div>
    </OwnerNFTProvider>
  )
}

export default UserProfile