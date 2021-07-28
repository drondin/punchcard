#!/usr/bin/python3

from brownie import Punchcard, accounts, config
import os

def main():
    network = accounts.add(os.getenv(config['wallets']['from_key']))
    punchcard = Punchcard.deploy("https://ipfs.io/ipfs/", {'from': network}, publish_source=True)
    return punchcard