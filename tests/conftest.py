#!/usr/bin/python3

import pytest
import time


@pytest.fixture(scope="function", autouse=True)
def isolate(fn_isolation):
    # perform a chain rewind after completing each test, to ensure proper isolation
    # https://eth-brownie.readthedocs.io/en/v1.10.3/tests-pytest-intro.html#isolation-fixtures
    pass


@pytest.fixture(scope="module")
def punchcard(Punchcard, accounts):
    return Punchcard.deploy(time.time(), "https://google.es", {'from': accounts[0]})


@pytest.fixture(scope="module")
def freeexpired_punchcard(Punchcard, accounts):
    return Punchcard.deploy(time.time()-(24*60*60)-(100), "https://google.es", {'from': accounts[0]})