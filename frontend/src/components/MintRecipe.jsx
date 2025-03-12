import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../abi.json';
import { pinata } from '../utils/config';
import "../styles/components/mintRecipe.css"

function MintRecipe() {
    const CONTRACT_ADDRESS = '0xeDF89bD8674026E5b696C1E1843C262b16DAaCA0';
    const POLYGON_AMOY_CHAIN_ID = '0x13882';
    const MINT_PRICE = ethers.parseEther("0.001");

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [status, setStatus] = useState('');

    const handleChange = setter => event => setter(event.target.value);

    const handleArrayChange = (index, setter, array) => event => {
        const newArray = [...array];
        newArray[index] = event.target.value;
        setter(newArray);
    };

    const addField = (setter, array) => () => setter([...array, '']);

    const changeHandler = event => setSelectedFiles(event.target.files);

    const uploadToPinata = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            alert('Please select a file before minting.');
            return null;
        }
        try {
            setStatus('Uploading image to Pinata...');
            const uploadImage = await pinata.upload.fileArray(selectedFiles);
            if (!uploadImage?.IpfsHash) return null;
            const imageUrl = `ipfs://${uploadImage.IpfsHash}`;

            const metadata = {
                name: title,
                description,
                image: imageUrl,
                attributes: [
                    { trait_type: "Ingredients", value: ingredients.join(", ") },
                    { trait_type: "Steps", value: steps.join(" | ") }
                ]
            };

            setStatus('Uploading metadata to Pinata...');
            const metadataResponse = await pinata.upload.json(metadata);
            return metadataResponse?.IpfsHash ? `ipfs://${metadataResponse.IpfsHash}` : null;
        } catch (error) {
            alert('File upload failed');
            return null;
        }
    };

    const switchToPolygonAmoy = async () => {
        if (!window.ethereum) {
            alert('MetaMask is required.');
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
            alert('Switch to Polygon Amoy manually in MetaMask.');
            return false;
        }
    };

    const mintNFT = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask.');
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
            alert('NFT Minted Successfully!');
            setStatus('NFT Minted Successfully!');
        } catch (error) {
            alert(`Error minting NFT: ${error.reason || error.message}`);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="mintrecipepage">
            <div className='form'>

                <h2>Mint Recipe NFT</h2>
                <input type="text" placeholder="Recipe Title" value={title} onChange={handleChange(setTitle)} disabled={isMinting} />
                <textarea placeholder="Description" value={description} onChange={handleChange(setDescription)} disabled={isMinting} />

                <h3>Ingredients</h3>
                <div className="ingredients">
                
                {ingredients.map((ingredient, index) => (
                    <input key={index} type="text" placeholder={`Ingredient ${index + 1}`} value={ingredient} onChange={handleArrayChange(index, setIngredients, ingredients)} disabled={isMinting} />
                ))}
                <button type="button" onClick={addField(setIngredients, ingredients)} className='add'>+</button>
                </div>

                <h3>Steps</h3>
                <div className="steps">
                {steps.map((step, index) => (
                    <input key={index} type="text" placeholder={`Step ${index + 1}`} value={step} onChange={handleArrayChange(index, setSteps, steps)} disabled={isMinting} />
                ))}
                <button type="button" onClick={addField(setSteps, steps)} className='add'>+</button>
                </div>


                <input type="file" onChange={changeHandler} multiple disabled={isMinting} />
                <button onClick={mintNFT} className='mint' disabled={isMinting}>{isMinting ? 'Minting...' : 'Mint NFT'}</button>
                {status && <p>{status}</p>}
            </div>
        </div>
    );
}

export default MintRecipe;