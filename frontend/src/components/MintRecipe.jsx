import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../abi.json';
import { pinata } from '../utils/config';

function MintRecipe() {
    const CONTRACT_ADDRESS = '0xa09F60B2B42369b1d4d952D31B08386A3B1E413A';
    const POLYGON_AMOY_CHAIN_ID = '0x13882';
    const MINT_PRICE = ethers.parseEther("0.01");
    
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [status, setStatus] = useState('');

    const changeHandler = (event) => {
        setSelectedFiles(event.target.files);
    };

    const uploadToPinata = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            alert('Please select a file before minting.');
            return null;
        }
        
        try {
            setStatus('Uploading file to Pinata...');
            const upload = await pinata.upload.fileArray(selectedFiles);
            console.log('Uploaded to Pinata:', upload);
            return upload;
        } catch (error) {
            console.error('Error uploading to Pinata:', error);
            alert('File upload failed');
            return null;
        }
    };

    const switchToPolygonAmoy = async () => {
        if (!window.ethereum) {
            alert('MetaMask is required to switch networks.');
            return false;
        }

        try {
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (currentChainId !== POLYGON_AMOY_CHAIN_ID) {
                setStatus('Switching to Polygon Amoy testnet...');
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: POLYGON_AMOY_CHAIN_ID }]
                });
                setStatus('Switched to Polygon Amoy.');
            }
            return true;
        } catch (error) {
            console.error('Error switching network:', error);
            alert('Please switch to Polygon Amoy manually in MetaMask.');
            return false;
        }
    };

    const mintNFT = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask to mint NFTs.');
            return;
        }

        try {
            setIsMinting(true);
            setStatus('Checking network...');
            
            const isCorrectNetwork = await switchToPolygonAmoy();
            if (!isCorrectNetwork) {
                setIsMinting(false);
                return;
            }

            setStatus('Uploading file...');
            const pinataResponse = await uploadToPinata();
            if (!pinataResponse || !pinataResponse.IpfsHash) {
                setIsMinting(false);
                return;
            }
            const tokenURI = `ipfs://${pinataResponse.IpfsHash}`;

            setStatus('Connecting to MetaMask...');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            console.log('Minting NFT on Polygon Amoy...');
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
            const tx = await contract.mintNFT(tokenURI, { value: MINT_PRICE, gasLimit: 300000 });
            
            console.log('Transaction sent:', tx.hash);
            setStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
            await tx.wait();
            
            console.log('NFT Minted Successfully');
            alert('NFT Minted Successfully!');
            setStatus('NFT Minted Successfully!');
        } catch (error) {
            console.error('Error minting NFT:', error);
            alert(`Error minting NFT: ${error.reason || error.message}`);
            setStatus('Minting failed. Please try again.');
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div>
            <h2>Mint Recipe NFT</h2>
            <label>Choose File</label>
            <input type="file" onChange={changeHandler} multiple disabled={isMinting} />
            <button onClick={mintNFT} disabled={isMinting}>
                {isMinting ? 'Minting...' : 'Mint NFT'}
            </button>
            {status && <p>{status}</p>}
        </div>
    );
}

export default MintRecipe;
