

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ABI from './ABI';
import Address from './Address';

const Home = (props) => {
  const [account, setAccount] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  const connectToPolygonMumbai = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request Metamask to connect to Polygon Mumbai Testnet
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13881', // Mumbai Testnet Chain ID
              chainName: 'Polygon Mumbai Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            },
          ],
        });
        await loadWeb3Data(); // Reload web3 data after connecting to the testnet
      } catch (error) {
        console.log('Metamask connection error:', error);
      }
    } else {
      console.log('Metamask not detected.');
    }
  };

  const loadWeb3Data = async () => {
    let { ethereum } = window;

    try {
      let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const web3 = new Web3(window.ethereum);
      let contract = new web3.eth.Contract(ABI, Address);
      setContractAddress(contract.options.address);
      // Write the code here for calling your data
    } catch (error) {
      console.log('Error loading web3 data:', error);
    }
  };

  useEffect(() => {
    let { ethereum } = window;

    async function Connection() {
      if (ethereum) {
        try {
          await ethereum.request({ method: 'eth_requestAccounts' });
          await loadWeb3Data();
        } catch (error) {
          console.log('Error connecting to Metamask:', error);
        }
      } else {
        console.log('Metamask not detected.');
      }
    }

    Connection();
  }, []);

  return (
    <>
      <div className="container-fluid text-center mt-3">
        <h3>Welcome, {props.usertype}!</h3>
        <br />
        {contractAddress && (
          <div className="container-fluid text-center mt-1">
            <p>Contract address: {contractAddress}</p>
          </div>
        )}
        <p>Wallet: {account}</p>
        {props.usertype === 'user' && <p>A user can download deployed patches.</p>}
        {props.usertype === 'labeller' && <p>A labeller can report bugs and prioritize them.</p>}
        {props.usertype === 'qc' && <p>A QC can approve an upload made by a developer.</p>}
        {props.usertype === 'developer' && (
          <p>A developer can view patch requests and upload patches to the IPFS.</p>
        )}
        {props.usertype === 'admin' && (
          <p>
            An admin can create other user accounts.<br /> An admin can request a developer for a patch and deploy an approved patch.<br /> Admin also has QC and Labeller permissions.
          </p>
        )}

        <div className="container">
          <div className="card mt-5 w-50 mx-auto">
            <div className="card-body">
              <h5 className="card-title">IMPORTANT</h5>
              <p className="card-text">
                Make sure your MetaMask wallet is connected to the Polygon Mumbai testnet.
              </p>
              <button type="button" className="btn btn-info" onClick={connectToPolygonMumbai}>
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
