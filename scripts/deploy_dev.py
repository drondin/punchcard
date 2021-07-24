#!/usr/bin/python3

from brownie import Punchcard, accounts

def main():
    punchcard = Punchcard.deploy("https://ipfs.io/ipfs/", {'from': accounts[0]})
    return punchcard