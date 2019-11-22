pragma solidity ^0.4.17;

contract Shop {
  address[16] public shoppers;

  // Adopting a pet
  function buy(uint petId) public returns (uint) {
    require(itemId >= 0 && itemId <= 15);

    shoppers[itemId] = msg.sender;

    return itemId;
  }


  function getShoppers() public view returns (address[16]) {
    return shoppers;
  }

}