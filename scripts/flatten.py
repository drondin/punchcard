#!/usr/bin/python3

from brownie import Punchcard
import os

def main():
    deployed_contract = Punchcard.at("0x632fE6804f3B057a150DC5Df78C62cC058b2f0F1")
    Punchcard.publish_source(deployed_contract)