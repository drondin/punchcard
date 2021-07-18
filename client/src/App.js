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
import Loader from "react-loader-spinner";

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
    fileContent: null,
    sendAddress: null,
    loading: false,
    walletConnected: false,
  };

  componentDidMount = async () => {
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
    const { accounts, punchcard, selectedPunchcard } = this.state;

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
        .getContent(i)
        .call({ from: accounts[0] });
      const nftContentSet = await punchcard.methods
        .contentIsSet(i)
        .call({ from: accounts[0] });

      const newPunchcard = {
        id: nftID,
        content: nftContent,
        isSet: nftContentSet,
      };
      if (initialPunchcard && initialPunchcard.id === nftID) {
        initialPunchcard = newPunchcard;
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
      loading: false,
    });
  };

  loadInitialContracts = async () => {
    if (this.state.chainid <= 42) {
      // Wrong Network!
      return;
    }

    const punchcard = await this.loadContract("dev", "Punchcard");

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

    if(this.state.accounts.length>0){
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
    const { accounts, punchcard } = this.state;
    e.preventDefault();
    await punchcard.methods
      .claimFreeToken()
      .send({ from: accounts[0] })
      .on("receipt", async () => {
        console.log("minted free");
        this.setState({
          mintValue: 1,
          loading: true,
        });
        this.loadData();
      });
  };

  mintPunchcards = async (e) => {
    const { accounts, punchcard, mintValue, web3 } = this.state;
    e.preventDefault();
    await punchcard.methods
      .mintTokens(mintValue)
      .send({
        from: accounts[0],
        value: mintValue * web3.utils.toWei("0.01", "ether"),
      })
      .on("receipt", async () => {
        console.log("minted punchards");
        this.setState({
          mintValue: 1,
          loading: true,
        });
        this.loadData();
      });
  };

  sendPunchcard = async (e) => {
    const {
      accounts,
      punchcard,
      selectedPunchcard,
      sendAddress,
      ownedPunchcards,
    } = this.state;
    e.preventDefault();
    await punchcard.methods
      .transferFrom(accounts[0], sendAddress, selectedPunchcard.id)
      .send({ from: accounts[0] })
      .on("receipt", async () => {
        console.log("content set");
        this.setState({
          sendAddress: "",
          loading: true,
        });
        this.loadData();
      });
  };

  uploadTextIPFS = async (e) => {
    const { ipfsclient, contentValue, accounts, punchcard, selectedPunchcard } =
      this.state;
    const ipfsCID = await ipfsclient.add(contentValue);
    await punchcard.methods
      .setContent(selectedPunchcard.id, ipfsCID.path)
      .send({ from: accounts[0] })
      .on("receipt", async () => {
        this.setState({
          contentValue: "",
          loading: true,
        });
        this.loadData();
      });
  };

  uploadFileIPFS = async (e) => {
    const { ipfsclient, accounts, punchcard, selectedPunchcard, fileContent } =
      this.state;

    const ipfsCID = await ipfsclient.add(fileContent);
    await punchcard.methods
      .setContent(selectedPunchcard.id, ipfsCID.path)
      .send({ from: accounts[0] })
      .on("receipt", async () => {
        this.setState({
          contentValue: "",
          loading: true,
        });
        this.loadData();
      });
  };

  render() {
    const {
      web3,
      accounts,
      chainid,
      punchcard,
      mintedFree,
      ownedPunchcards,
      mintValue,
      contentValue,
      selectedPunchcard,
      ipfsBaseUri,
      sendAddress,
      walletConnected,
    } = this.state;

    if (this.state.loading) {
      return (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Container rounded>
            <Loader style={{marginLeft: "35px"}} type="TailSpin" color="#00BFFF" height={100} width={100} />

            {accounts ? <strong>Connect with Metamask.</strong> : null}
          </Container>
        </div>
      );
    }

    if (!web3) {
      return <div>Loading Web3, accounts, and contracts...</div>;
    }

    if (isNaN(chainid) || chainid <= 42) {
      return (
        <div>
          Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3
          provider (e.g. Metamask)
        </div>
      );
    }

    if (!punchcard) {
      return (
        <div>
          Could not find a deployed contract. Check console for details.
        </div>
      );
    }

    const punchcardList = ownedPunchcards.map((d) => (
      <li
        key={d.id}
        onClick={(e) => {
          this.setState({ selectedPunchcard: d });
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
        </Container>
        <br></br>
        {(!walletConnected || accounts.length==0)? (
          <Container rounded>
            <strong>Connect with Metamask.</strong>
          </Container>
        ) : (
          <div>
            <Container rounded>
              <strong>Connected with account {accounts[0]}.</strong>
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
            <Row>
              <Col>
                <Container rounded title="My Punchcards">
                  {punchcardList}
                </Container>
              </Col>
              <Col>
                <Container rounded title="Content">
                  {selectedPunchcard && selectedPunchcard.content == false && (
                    <TextArea
                      value={contentValue}
                      onChange={(e) =>
                        this.setState({ contentValue: e.target.value })
                      }
                      rows="8"
                    />
                  )}
                  <br></br>
                  {selectedPunchcard && selectedPunchcard.content && (
                    <div>
                      <a
                        href={ipfsBaseUri + selectedPunchcard.content}
                        target="_blank"
                      >
                        IPFS URL
                      </a>
                      <br></br>
                      <br></br>
                      <span style={{ color: "orange" }}>
                        Be careful with unknown links
                      </span>
                      <br></br>
                      <br></br>
                    </div>
                  )}
                  {selectedPunchcard && selectedPunchcard.isSet == false && (
                    <div>
                      <Button
                        warning
                        onClick={(e) =>
                          selectedPunchcard.isSet == false &&
                          this.uploadTextIPFS(e)
                        }
                        disabled={selectedPunchcard && selectedPunchcard.isSet}
                      >
                        Upload Text
                      </Button>
                      <br></br>
                      <br></br>
                      <span>------ or ------</span>
                      <br></br>
                      <br></br>
                      <Row>
                        <Col>
                          <input
                            type="file"
                            onChange={(e) =>
                              this.setState({ fileContent: e.target.files[0] })
                            }
                          />
                        </Col>
                        <Col>
                          <Button
                            warning
                            style={{ "margin-top": "20px" }}
                            onClick={(e) =>
                              selectedPunchcard.isSet == false &&
                              this.uploadFileIPFS(e)
                            }
                            disabled={
                              selectedPunchcard && selectedPunchcard.isSet
                            }
                          >
                            Upload File
                          </Button>
                        </Col>
                      </Row>
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
          </div>
        )}
      </div>
    );
  }
}

export default App;
