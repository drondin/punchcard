import React, { Component } from "react";
import "./App.css";
import { getWeb3Eth, getWeb3Dai, getWeb3Matic } from "./getWeb3";
import map from "./artifacts/deployments/map.json";
import { create } from "ipfs-http-client";
import { Container, Button, Icon, TextArea } from "nes-react";
import { Link } from "react-router-dom";

import Row from "./Row";
import Col from "./Col";

class Wallet extends Component {
  state = {
    web3eth: null,
    web3dai: null,
    web3matic: null,
    punchcardEth: null,
    punchcardDai: null,
    punchcardMatic: null,
    ipfsBaseUri: null,
    ownedPunchcardsEth: [],
    ownedPunchcardsDai: [],
    ownedPunchcardsMatic: [],
    account: null,
    fileContent: "",
  };

  componentDidMount = async () => {
    this.initApp();
  };

  initApp = async () => {
    // Get network provider and web3 instance.
    const web3eth = await getWeb3Eth();
    const web3dai = await getWeb3Dai();
    const web3matic = await getWeb3Matic();

    this.setState(
      {
        web3eth,
        web3dai,
        web3matic,
      },
      await this.loadInitialContracts
    );
  };

  loadData = async () => {
    const { punchcardEth, punchcardDai, punchcardMatic, account } = this.state;

    const nOwnedPunchcardsEth = await punchcardEth.methods
      .balanceOf(account)
      .call();
    const ownedPunchcardsEth = [];

    for (let i = 0; i < nOwnedPunchcardsEth; i++) {
      const nftID = await punchcardEth.methods
        .tokenOfOwnerByIndex(account, i)
        .call();
      const nftContent = await punchcardEth.methods.getContent(nftID).call();

      const newPunchcard = {
        id: nftID,
        content: nftContent,
      };
      ownedPunchcardsEth.push(newPunchcard);
    }

    const nOwnedPunchcardsDai = await punchcardDai.methods
      .balanceOf(account)
      .call();
    const ownedPunchcardsDai = [];

    for (let i = 0; i < nOwnedPunchcardsDai; i++) {
      const nftID = await punchcardDai.methods
        .tokenOfOwnerByIndex(account, i)
        .call();
      const nftContent = await punchcardDai.methods.getContent(nftID).call();

      const newPunchcard = {
        id: nftID,
        content: nftContent,
      };
      ownedPunchcardsDai.push(newPunchcard);
    }

    const nOwnedPunchcardsMatic = await punchcardMatic.methods
      .balanceOf(account)
      .call();
    const ownedPunchcardsMatic = [];

    for (let i = 0; i < nOwnedPunchcardsMatic; i++) {
      const nftID = await punchcardMatic.methods
        .tokenOfOwnerByIndex(account, i)
        .call();
      const nftContent = await punchcardMatic.methods.getContent(nftID).call();

      const newPunchcard = {
        id: nftID,
        content: nftContent,
      };
      ownedPunchcardsMatic.push(newPunchcard);
    }

    this.setState({
      ownedPunchcardsEth,
      ownedPunchcardsDai,
      ownedPunchcardsMatic,
    });
  };

  loadInitialContracts = async () => {
    const { web3eth, web3dai, web3matic } = this.state;

    const punchcardEth = await this.loadContract("1", "Punchcard", web3eth);
    const punchcardDai = await this.loadContract("100", "Punchcard", web3dai);
    const punchcardMatic = await this.loadContract(
      "137",
      "Punchcard",
      web3matic
    );

    const ipfsBaseUri = await punchcardEth.methods.baseURI().call();

    this.setState({
      punchcardEth,
      punchcardDai,
      punchcardMatic,
      ipfsBaseUri,
    });
  };

  loadContract = async (chain, contractName, web3) => {
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

  render() {
    const {
      ipfsBaseUri,
      ownedPunchcardsEth,
      ownedPunchcardsDai,
      ownedPunchcardsMatic,
      fileContent,
      account,
    } = this.state;

    const punchcardListEth = ownedPunchcardsEth.map((d) => (
      <li
        key={d.id}
        onClick={(e) => {
          this.setState({ selectedPunchcard: "e" + d });

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
        style={{ margin: "1rem", color: "#007bff" }}
      >
        ETH Punched Card {d.id} -{" "}
        <Icon icon="star" empty={d.content === ""} small />
      </li>
    ));

    const punchcardListDai = ownedPunchcardsDai.map((d) => (
      <li
        key={d.id}
        onClick={(e) => {
          this.setState({ selectedPunchcard: "d" + d });

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
        style={{ margin: "1rem", color: "#007bff" }}
      >
        DAI Punched Card {d.id} -{" "}
        <Icon icon="star" empty={d.content === ""} small />
      </li>
    ));

    const punchcardListMatic = ownedPunchcardsMatic.map((d) => (
      <li
        key={d.id}
        onClick={(e) => {
          this.setState({ selectedPunchcard: "m" + d });

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
        style={{ margin: "1rem", color: "#007bff" }}
      >
        Matic Punched Card {d.id} -{" "}
        <Icon icon="star" empty={d.content === ""} small />
      </li>
    ));

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

        <h2>Punchedcard.eth.link</h2>
        <br></br>
        <Container rounded>
          <Link to="/">
            <Button primary>View my wallet</Button>
          </Link>
        </Container>
        <br></br>
        <Container rounded>
          <Row>
            <Col>
              <TextArea
                label="Enther Address"
                type="text"
                value={account}
                onChange={(e) => this.setState({ account: e.target.value })}
              />
            </Col>
            <Col>
              <Button
                error
                style={{ marginTop: "50px" }}
                onClick={(e) => this.loadData(e)}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Container>
        <br></br>
        <Container rounded title="Punched Cards">
          <Row>
            <Col>
              {punchcardListEth}
              {punchcardListDai}
              {punchcardListMatic}
            </Col>
            <Col>
              <TextArea
                label="Content"
                type="text"
                value={fileContent}
                disabled
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Wallet;
