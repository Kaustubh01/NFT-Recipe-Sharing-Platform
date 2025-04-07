import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../abi.json';
import { pinata } from '../utils/config';
import { Plus, Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function MintRecipe() {
    const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';
    const POLYGON_AMOY_CHAIN_ID = '0x13882';
    const MINT_PRICE = ethers.parseEther("0.001");

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [status, setStatus] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = setter => event => setter(event.target.value);

    const handleArrayChange = (index, setter, array) => event => {
        const newArray = [...array];
        newArray[index] = event.target.value;
        setter(newArray);
    };

    const addField = (setter, array) => () => setter([...array, '']);

    const changeHandler = event => {
        const files = event.target.files;
        setSelectedFiles(files);
        
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            
            reader.readAsDataURL(file);
        }
    };

    const uploadToPinata = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            toast.error('Please select a file before minting.');
            return null;
        }
        try {
            setStatus('Uploading image to Pinata...');
            const uploadImage = await pinata.upload.fileArray(selectedFiles);
            if (!uploadImage?.IpfsHash) return null;
            const imageUrl = `ipfs://${uploadImage.IpfsHash}`;

            const filename = selectedFiles[0].name;
            console.log("filename:", filename);

            const metadata = {
                name: title,
                description,
                image: imageUrl,
                filename: filename,
                attributes: [
                    { trait_type: "Ingredients", value: ingredients.join(", ") },
                    { trait_type: "Steps", value: steps.join(" | ") }
                ]
            };

            setStatus('Uploading metadata to Pinata...');
            const metadataResponse = await pinata.upload.json(metadata);
            return metadataResponse?.IpfsHash ? `ipfs://${metadataResponse.IpfsHash}` : null;
        } catch (error) {
            toast.error('File upload failed');
            return null;
        }
    };

    const switchToPolygonAmoy = async () => {
        if (!window.ethereum) {
            toast.error('MetaMask is required.');
            return false;
        }
        try {
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (currentChainId !== POLYGON_AMOY_CHAIN_ID) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: POLYGON_AMOY_CHAIN_ID }]
                });
            }
            return true;
        } catch {
            toast.error('Switch to Polygon Amoy manually in MetaMask.');
            return false;
        }
    };

    const mintNFT = async () => {
        if (!window.ethereum) {
            toast.error('Please install MetaMask.');
            return;
        }

        setIsMinting(true);
        setStatus('Checking network...');
        if (!(await switchToPolygonAmoy())) {
            setIsMinting(false);
            return;
        }

        setStatus('Uploading files...');
        const tokenURI = await uploadToPinata();
        if (!tokenURI) {
            setIsMinting(false);
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
            setStatus('Minting NFT...');
            const tx = await contract.mintNFT(tokenURI, { value: MINT_PRICE, gasLimit: 300000 });
            await tx.wait();
            toast.success('NFT Minted Successfully!');
            setStatus('NFT Minted Successfully!');
        } catch (error) {
            toast.error(`Error minting NFT: ${error.reason || error.message}`);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Mint Recipe NFT</h2>
                    
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Recipe Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter recipe title"
                                value={title}
                                onChange={handleChange(setTitle)}
                                disabled={isMinting}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                placeholder="Describe your recipe"
                                value={description}
                                onChange={handleChange(setDescription)}
                                disabled={isMinting}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                            />
                        </div>

                        {/* Ingredients */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Ingredients
                                </label>
                                <button
                                    type="button"
                                    onClick={addField(setIngredients, ingredients)}
                                    disabled={isMinting}
                                    className="p-1 text-orange-500 hover:text-orange-600 rounded-full hover:bg-orange-50"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {ingredients.map((ingredient, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Ingredient ${index + 1}`}
                                        value={ingredient}
                                        onChange={handleArrayChange(index, setIngredients, ingredients)}
                                        disabled={isMinting}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Steps */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Steps
                                </label>
                                <button
                                    type="button"
                                    onClick={addField(setSteps, steps)}
                                    disabled={isMinting}
                                    className="p-1 text-orange-500 hover:text-orange-600 rounded-full hover:bg-orange-50"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {steps.map((step, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Step ${index + 1}`}
                                        value={step}
                                        onChange={handleArrayChange(index, setSteps, steps)}
                                        disabled={isMinting}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recipe Image
                            </label>
                            <div className="flex items-center justify-center w-full">
                                {previewUrl ? (
                                    <div className="relative w-full">
                                        <div className="relative h-64 rounded-lg overflow-hidden">
                                            <img
                                                src={previewUrl}
                                                alt="Recipe preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                <div className="bg-white p-2 rounded-full">
                                                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewUrl(null);
                                                setSelectedFiles(null);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                                        >
                                            <XCircle className="h-6 w-6 text-gray-500" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={changeHandler}
                                            multiple
                                            disabled={isMinting}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Status and Mint Button */}
                        <div className="pt-4">
                            {status && (
                                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                                    <p className="text-sm text-orange-700">{status}</p>
                                </div>
                            )}
                            <button
                                onClick={mintNFT}
                                disabled={isMinting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isMinting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                                        Minting...
                                    </>
                                ) : (
                                    'Mint NFT'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MintRecipe;