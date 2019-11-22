pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Shop.sol";

contract TestShop {
  Shop shop = Shop(DeployedAddresses.Shop());


  function testUserCanBuyItem() public {
    uint returnedId = shop.buy(8);

    uint expected = 8;

    Assert.equal(returnedId, expected, "Buy of item ID 8 should be recorded.");
  }

  // Testing retrieval of a single pet's owner
  function testGetShopperAddressByItemId() public {
    // Expected owner is this contract
    address expected = this;

    address shopper = shop.shoppers(8);

    Assert.equal(shopper, expected, "Owner of item ID 8 should be recorded.");
  }

  // Testing retrieval of all pet owners
  function testGetShopperAddressByItemIdInArray() public {
    // Expected owner is this contract
    address expected = this;

    // Store adopters in memory rather than contract's storage
    address[16] memory shoppers = shop.getShoppers();

    Assert.equal(shoppers[8], expected, "Owner of items ID 8 should be recorded.");
  }

}
