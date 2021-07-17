#!/usr/bin/python3

from brownie import Punchcard, accounts
import time

def main():
    punchcard = Punchcard.deploy(time.time(), "https://ipfs.io/ipfs/", {'from': accounts[0]})
    return punchcard