import { ethers } from './ethers-5.2.esm.min.js'
import { abi } from './constants.js'
import { contractAddress } from './constants.js'
const connectButton = document.getElementById('connectButton')
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")


connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}
async function getBalance() {
    try {
        if (typeof window.ethereum != "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const balance = await provider.getBalance(contractAddress)
            console.log(ethers.utils.formatEther(balance))
        }
    }
    catch (error) {
        console.log(error)
    }

}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding Amount will be ${ethAmount}`)
    if (typeof window.ethereum != "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            console.log(signer)
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        }
        catch (error) {
            console.log(error)
        }


    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done Withdrawing!!")
        }
        catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmation`)
            resolve()
        })
    })

}