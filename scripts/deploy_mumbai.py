#!/usr/bin/python3

from brownie import Punchcard, accounts, config
import os

def main():
    mumbai = accounts.add(os.getenv(config['wallets']['from_key']))
    punchcard = Punchcard.deploy("https://ipfs.io/ipfs/", {'from': mumbai})
    return punchcard