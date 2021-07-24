#!/usr/bin/python3

import brownie

def test_freemint(punchcard, accounts):
    punchcard.claimFreeToken({'from': accounts[0]})
    assert punchcard.balanceOf(accounts[0]) == 1

def test_freemint(punchcard, accounts):
    punchcard.claimFreeToken({'from': accounts[0]})
    tokenId = punchcard.tokenOfOwnerByIndex(accounts[0], 0)
    assert punchcard.ownerOf(tokenId) == accounts[0]

def test_setContent(punchcard, accounts):
    punchcard.claimFreeToken({'from': accounts[0]})
    tokenId = punchcard.tokenOfOwnerByIndex(accounts[0], 0)
    punchcard.setContent(tokenId, "test")
    assert punchcard.getContent(tokenId) == "test"

def test_setContentAlreadyBurned(punchcard, accounts):
    punchcard.claimFreeToken({'from': accounts[0]})
    tokenId = punchcard.tokenOfOwnerByIndex(accounts[0], 0)
    punchcard.setContent(tokenId, "test")
    with brownie.reverts("Content is already burned"):
        punchcard.setContent(tokenId, "test2")

def test_setContentOther(punchcard, accounts):
    punchcard.claimFreeToken({'from': accounts[0]})
    tokenId = punchcard.tokenOfOwnerByIndex(accounts[0], 0)
    with brownie.reverts("Caller is not owner"):
        punchcard.setContent(tokenId, "test", {'from': accounts[1]})