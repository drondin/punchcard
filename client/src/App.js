import React, {Component} from "react"
import './App.css'
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"

class App extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        punchcard: null,
        mintedFree: false,
        nOwnedPunchcards: 0,
        ownedPunchcards: [],
        mintValue: 1
    }

    componentDidMount = async () => {

        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum()
            ethereum.enable()
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`)
            console.log(e)
        }

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts()

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId())

        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload();
        });

        this.setState({
            web3,
            accounts,
            chainid
        }, await this.loadInitialContracts)

    }

    loadData = async () => {
        const {
            accounts, punchcard
        } = this.state

        const mintedFree = await punchcard.methods.callerHasClaimedFreeToken().call({from: accounts[0]})
        const nOwnedPunchcards = await punchcard.methods.balanceOf(accounts[0]).call({from: accounts[0]})
        const ownedPunchcards = [];

        for (let i = 0; i < nOwnedPunchcards; i++) {
            const nftID = await punchcard.methods.tokenOfOwnerByIndex(accounts[0], i).call({from: accounts[0]})
            ownedPunchcards.push(nftID)
        };

        this.setState({
            mintedFree,
            nOwnedPunchcards,
            ownedPunchcards
        })
    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }

        const punchcard = await this.loadContract("dev", "Punchcard")

        if (!punchcard) {
            return
        }

        this.setState({
            punchcard
        })

        this.loadData()
    }

    loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        const {web3} = this.state

        // Get the address of the most recent deployment from the deployment map
        let address
        try {
            address = map[chain][contractName][0]
        } catch (e) {
            console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`)
            return undefined
        }

        // Load the artifact with the specified address
        let contractArtifact
        try {
            contractArtifact = await import(`./artifacts/deployments/${chain}/${address}.json`)
        } catch (e) {
            console.log(`Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`)
            return undefined
        }

        return new web3.eth.Contract(contractArtifact.abi, address)
    }

    mintFree = async (e) => {
        const {accounts, punchcard} = this.state
        e.preventDefault()
        await punchcard.methods.claimFreeToken().send({from: accounts[0]})
            .on('receipt', async () => {
                console.log("minted free")
                this.loadData()
            })
    }

    mintPunchcards = async (e) => {
        const {accounts, punchcard, mintValue, web3} = this.state
        e.preventDefault()
        await punchcard.methods.mintTokens(mintValue).send({from: accounts[0], value: mintValue*web3.utils.toWei('0.01', 'ether')})
            .on('receipt', async () => {
                console.log("minted punchards")
                this.loadData()
                this.setState({
                    mintValue: 1
                })
            })
    }

    render() {
        const {
            web3, accounts, chainid,
            punchcard, mintedFree, nOwnedPunchcards, ownedPunchcards,
            mintValue
        } = this.state

        debugger;

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!punchcard) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const punchcardList = ownedPunchcards.map((d) => <li key={d}>{d}</li>);
        const isAccountsUnlocked = accounts ? accounts.length > 0 : false

        return (<div className="App">
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
            <h2>Punchcard</h2>

            <div>Owned Punchcards: {nOwnedPunchcards}</div>
            <br></br>
            <div>
                {punchcardList}
            </div>
            <br></br>
            <form onSubmit={(e) => this.mintFree(e)}>
                <div>
                    <label>Mint Free Punchcards {mintedFree.toString()}</label>
                    <button type="submit" disabled={!isAccountsUnlocked || mintedFree}>Mint Free</button>
                </div>
            </form>
            <br></br>
            <form onSubmit={(e) => this.mintPunchcards(e)}>
                <div>
                    <label>Mint Punchcards: </label>
                    <br/>
                    <input
                        name="mintValue"
                        type="number"
                        value={mintValue}
                        onChange={(e) => this.setState({mintValue: e.target.value})}
                    />
                    <br/>
                    <button type="submit" disabled={!isAccountsUnlocked}>Mint {mintValue} punchcards</button>

                </div>
            </form>
        </div>)
    }
}

export default App
