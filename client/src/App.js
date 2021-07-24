import React, { Component } from "react";
import "./App.css";
import { getWeb3 } from "./getWeb3";
import map from "./artifacts/deployments/map.json";
import { getEthereum } from "./getEthereum";
import { create } from "ipfs-http-client";
import {
  Container,
  Button,
  TextInput,
  TextArea,
  Balloon,
  Icon,
  Sprite,
} from "nes-react";

import Row from "./Row";
import Col from "./Col";

class App extends Component {
  state = {
    web3: null,
    ipfsclient: null,
    accounts: null,
    chainid: null,
    punchcard: null,
    mintedFree: true,
    nOwnedPunchcards: 0,
    ownedPunchcards: [],
    mintValue: 1,
    contentValue: "",
    selectedPunchcard: null,
    ipfsBaseUri: null,
    fileContent: "",
    sendAddress: null,
    walletConnected: false,
    pendingTx: [],
  };

  componentDidMount = async () => {
    if (typeof web3 === "undefined") {
      console.log("not connected");
    } else {
      this.initApp();
    }
  };

  initApp = async () => {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();
    let walletConnected = false;
    // Try and enable accounts (connect metamask)
    try {
      const ethereum = await getEthereum();
      ethereum.enable();
      walletConnected = true;
    } catch (e) {
      console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`);
      console.log(e);
    }

    // Use web3 to get the user's accounts
    const accounts = await web3.eth.getAccounts();

    // Get the current chain id
    const chainid = parseInt(await web3.eth.getChainId());

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts) {
        window.location.reload();
      });
    }

    this.setState(
      {
        web3,
        accounts,
        chainid,
        walletConnected,
      },
      await this.loadInitialContracts
    );
  };

  loadData = async () => {
    const { accounts, punchcard, selectedPunchcard, ipfsBaseUri } = this.state;

    const mintedFree = await punchcard.methods
      .callerHasClaimedFreeToken()
      .call({ from: accounts[0] });
    const nOwnedPunchcards = await punchcard.methods
      .balanceOf(accounts[0])
      .call({ from: accounts[0] });
    const ownedPunchcards = [];

    let initialPunchcard = selectedPunchcard;
    let found = false;

    for (let i = 0; i < nOwnedPunchcards; i++) {
      const nftID = await punchcard.methods
        .tokenOfOwnerByIndex(accounts[0], i)
        .call({ from: accounts[0] });
      const nftContent = await punchcard.methods
        .getContent(nftID)
        .call({ from: accounts[0] });
      const nftContentSet = await punchcard.methods
        .contentIsSet(nftID)
        .call({ from: accounts[0] });

      const newPunchcard = {
        id: nftID,
        content: nftContent,
        isSet: nftContentSet,
      };

      if (initialPunchcard && initialPunchcard.id === newPunchcard.id) {
        initialPunchcard = newPunchcard;

        fetch(ipfsBaseUri + newPunchcard.content)
          .then((res) => res.text())
          .then((result) => {
            this.setState({
              fileContent: result,
            });
          });

        found = true;
      }
      ownedPunchcards.push(newPunchcard);
    }

    if (
      (initialPunchcard === null || found === false) &&
      nOwnedPunchcards > 0
    ) {
      initialPunchcard = ownedPunchcards[0];
    } else if (nOwnedPunchcards == 0) {
      initialPunchcard = null;
    }

    this.setState({
      mintedFree,
      nOwnedPunchcards,
      ownedPunchcards,
      selectedPunchcard: initialPunchcard,
    });
  };

  loadInitialContracts = async () => {
    if (this.state.chainid <= 42) {
      // Wrong Network!
      return;
    }

    //mumbai
    const punchcard = await this.loadContract("80001", "Punchcard");
    //const punchcard = await this.loadContract("dev", "Punchcard");

    if (!punchcard) {
      return;
    }

    const ipfsBaseUri = await punchcard.methods.baseURI().call();
    const ipfsclient = create("https://ipfs.infura.io:5001/api/v0");

    this.setState({
      punchcard,
      ipfsclient,
      ipfsBaseUri,
    });

    if (this.state.accounts.length > 0) {
      this.loadData();
    }
  };

  loadContract = async (chain, contractName) => {
    // Load a deployed contract instance into a web3 contract object
    const { web3 } = this.state;

    // Get the address of the most recent deployment from the deployment map
    let address;
    try {
      address = map[chain][contractName][0];
    } catch (e) {
      console.log(
        `Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`
      );
      return undefined;
    }

    // Load the artifact with the specified address
    let contractArtifact;
    try {
      contractArtifact = await import(
        `./artifacts/deployments/${chain}/${address}.json`
      );
    } catch (e) {
      console.log(
        `Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`
      );
      return undefined;
    }

    return new web3.eth.Contract(contractArtifact.abi, address);
  };

  mintFree = async (e) => {
    const { accounts, punchcard, pendingTx } = this.state;
    await punchcard.methods
      .claimFreeToken()
      .send({ from: accounts[0] })
      .on("transactionHash", async (transactionHash) => {
        let newPendingTx = pendingTx;

        newPendingTx.push({
          tx: transactionHash,
          msg: "Minting free punchcard",
        });

        this.setState({
          pendingTx: newPendingTx,
        });
      })
      .on("receipt", async (receipt) => {
        let newPendingTx = pendingTx.filter(function (itm) {
          return itm.tx != receipt.transactionHash;
        });

        this.setState({
          pendingTx: newPendingTx,
        });
        this.loadData();
      });
  };

  mintPunchcards = async (e) => {
    const { accounts, punchcard, mintValue, pendingTx, web3 } = this.state;

    await punchcard.methods
      .mintTokens(mintValue)
      .send({
        from: accounts[0],
        value: mintValue * web3.utils.toWei("0.01", "ether"),
      })
      .on("transactionHash", async (transactionHash) => {
        let newPendingTx = pendingTx;

        newPendingTx.push({
          tx: transactionHash,
          msg: "Minting punchcards",
        });

        this.setState({
          pendingTx: newPendingTx,
        });
      })
      .on("receipt", async (receipt) => {
        console.log("minted punchards");

        let newPendingTx = pendingTx.filter(function (itm) {
          return itm.tx != receipt.transactionHash;
        });

        this.setState({
          pendingTx: newPendingTx,
          mintValue: 1,
        });
        this.loadData();
      });
  };

  sendPunchcard = async (e) => {
    const { accounts, punchcard, selectedPunchcard, pendingTx, sendAddress } = this.state;

    await punchcard.methods
      .transferFrom(accounts[0], sendAddress, selectedPunchcard.id)
      .send({ from: accounts[0] })
      .on("transactionHash", async (transactionHash) => {
        let newPendingTx = pendingTx;

        newPendingTx.push({
          tx: transactionHash,
          msg: "Sending punchcard",
        });

        this.setState({
          pendingTx: newPendingTx,
        });
      })
      .on("receipt", async (receipt) => {
        let newPendingTx = pendingTx.filter(function (itm) {
          return itm.tx != receipt.transactionHash;
        });

        this.setState({
          sendAddress: "",
          pendingTx: newPendingTx
        });
        this.loadData();
      });
  };

  uploadTextIPFS = async (e) => {
    const { ipfsclient, contentValue, accounts, punchcard, pendingTx, selectedPunchcard } =
      this.state;
    const ipfsCID = await ipfsclient.add(contentValue);

    await punchcard.methods
      .setContent(selectedPunchcard.id, ipfsCID.path)
      .send({ from: accounts[0] })
      .on("transactionHash", async (transactionHash) => {
        let newPendingTx = pendingTx;

        newPendingTx.push({
          tx: transactionHash,
          msg: "Sending punchcard",
        });

        this.setState({
          pendingTx: newPendingTx,
        });
      })
      .on("receipt", async (receipt) => {
        let newPendingTx = pendingTx.filter(function (itm) {
          return itm.tx != receipt.transactionHash;
        });

        this.setState({
          contentValue: "",
          pendingTx: newPendingTx
        });
        this.loadData();
      });
  };

  render() {
    const {
      accounts,
      mintedFree,
      nOwnedPunchcards,
      ownedPunchcards,
      mintValue,
      contentValue,
      selectedPunchcard,
      ipfsBaseUri,
      sendAddress,
      walletConnected,
      fileContent,
      pendingTx,
    } = this.state;

    const transactionList = pendingTx.map((d) => (
      <li key={d.tx}>
        <a target="_blank" href={"https://etherscan.io/tx/" + d.tx}>{d.msg}</a>
      </li>
    ));

    const punchcardList = ownedPunchcards.map((d) => (
      <li
        key={d.id}
        onClick={(e) => {
          this.setState({ selectedPunchcard: d });

          if (d.content) {
            fetch(ipfsBaseUri + d.content)
              .then((res) => res.text())
              .then((result) => {
                this.setState({
                  fileContent: result,
                });
              });
          }
        }}
        style={{ margin: "1rem", color: d === selectedPunchcard && "#007bff" }}
      >
        Punchcard {d.id} - <Icon icon="star" empty={d.isSet === false} small />
      </li>
    ));

    const isAccountsUnlocked = accounts ? accounts.length > 0 : false;

    return (
      <div
        className="App"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 15,
          width: 1024,
        }}
      >
        <link
          href="https://fonts.googleapis.com/css?family=Press+Start+2P"
          rel="stylesheet"
        />

        <h2>Punchcard.eth</h2>
        <br></br>
        <Container dark title="What is this?">
          You ever wanted to send a message to another wallet or save a document
          forever? <br></br> <br></br> You are in the right place.{" "}
          <Icon icon="heart" />
          <br></br>
          <br></br>
          Made by <a target="_blank" href="https://twitter.com/drondin0x">@drondin0x</a>{" "}
          repository{" "}
          <a target="_blank" href="https://github.com/drondin/punchcard">Punchcard</a>
        </Container>
        <br></br>
        {!walletConnected || accounts.length == 0 ? (
          <Container rounded>
            <Button success onClick={(e) => this.initApp()}>
              Connect with Metamask.
            </Button>
          </Container>
        ) : (
          <div>
            <Container rounded>
              <strong>
                Connected with account{" "}
                <a target="_blank" href={"https://etherscan.io/address/" + accounts[0]}>
                  {" "}
                  {accounts[0]}{" "}
                </a>
              </strong>
            </Container>
            <br></br>
            <Container rounded title="Mint Punchcard">
              <Row>
                <Col>
                  {!isAccountsUnlocked || mintedFree ? (
                    <div style={{ display: "flex" }}>
                      <Sprite
                        sprite="bcrikko"
                        style={{ alignSelf: "flex-end" }}
                      />
                      <Balloon
                        style={{ margin: "2rem", maxWidth: "400px" }}
                        fromLeft
                      >
                        <TextInput
                          label="How many Punchcards do you want?"
                          placeholder="Text placeholder"
                          type="number"
                          value={mintValue}
                          onChange={(e) =>
                            this.setState({ mintValue: e.target.value })
                          }
                        />
                        <br></br>
                        <Button success onClick={(e) => this.mintPunchcards(e)}>
                          Mint {mintValue} punchcards
                        </Button>
                      </Balloon>
                    </div>
                  ) : (
                    <div style={{ display: "flex" }}>
                      <Sprite
                        sprite="bcrikko"
                        style={{ alignSelf: "flex-end" }}
                      />
                      <Balloon
                        style={{ margin: "2rem", maxWidth: "400px" }}
                        fromLeft
                      >
                        <span>
                          Welcome, the first punchard is on the house!
                        </span>
                        <br></br>
                        <br></br>
                        <Button success onClick={(e) => this.mintFree(e)}>
                          Mint free punchcard
                        </Button>
                      </Balloon>
                    </div>
                  )}
                </Col>
                <Col style={{ textAlign: "left" }}>
                  <p>Rules</p>
                  <div style={{ textAlign: "left" }}>
                    <Icon icon="like" small />
                    <span style={{ marginLeft: "5px" }}>
                      You can mint as many punchcards as you want
                    </span>
                    <br></br>
                    <br></br>
                    <Icon icon="like" small />
                    <span style={{ marginLeft: "5px" }}>
                      Each Punchcard costs 0.01 Ether
                    </span>
                    <br></br>
                    <br></br>
                    <Icon icon="like" small />
                    <span style={{ marginLeft: "5px" }}>
                      You can set the content of a punchcard only 1 time
                    </span>
                    <br></br>
                    <br></br>
                    <Icon icon="like" small />
                    <span style={{ marginLeft: "5px" }}>
                      The content is public and accessible by anyone
                    </span>
                  </div>
                </Col>
              </Row>
            </Container>
            <br></br>

            {nOwnedPunchcards > 0 || pendingTx.length > 0 ? (
              <Row>
                <Col>
                  <Container rounded title="My Punchcards">
                    {punchcardList}
                  </Container>
                  <br></br>
                  {pendingTx.length > 0 ? (
                    <Container rounded title="Transactions">
                      {transactionList}
                    </Container>
                  ) : null}
                </Col>
                <Col>
                  <Container rounded title="Content">
                    {selectedPunchcard &&
                      selectedPunchcard.content == false && (
                        <TextArea
                          value={contentValue}
                          onChange={(e) =>
                            this.setState({ contentValue: e.target.value })
                          }
                          rows="8"
                        />
                      )}
                    {selectedPunchcard && selectedPunchcard.content && (
                      <div>
                        <TextArea value={fileContent} disabled rows="8" />
                        <br></br>
                        <br></br>
                        <a
                          href={ipfsBaseUri + selectedPunchcard.content}
                          target="_blank"
                        >
                          IPFS URL
                        </a>
                        <br></br>
                        <br></br>
                      </div>
                    )}
                    {selectedPunchcard && selectedPunchcard.isSet == false && (
                      <div>
                        <br></br>
                        <Button
                          warning
                          onClick={(e) =>
                            selectedPunchcard.isSet == false &&
                            this.uploadTextIPFS(e)
                          }
                          disabled={
                            selectedPunchcard && selectedPunchcard.isSet
                          }
                        >
                          Upload Text
                        </Button>
                        <br></br>
                        <br></br>
                      </div>
                    )}
                  </Container>
                  <br></br>
                  {selectedPunchcard && (
                    <Container rounded title="Send Punchcard">
                      <TextArea
                        label="Enther Address"
                        type="text"
                        value={sendAddress}
                        onChange={(e) =>
                          this.setState({ sendAddress: e.target.value })
                        }
                      />
                      <Button
                        error
                        style={{ "margin-top": "20px" }}
                        onClick={(e) => this.sendPunchcard(e)}
                      >
                        Send Punchcard
                      </Button>
                    </Container>
                  )}
                </Col>
              </Row>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;