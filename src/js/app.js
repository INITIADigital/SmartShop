App = {
    web3Provider: null,
    contracts: {},

    init: function () {
        // Load pets.
        $.getJSON('../items.json', function (data) {
            var itemRow = $('#itemRow');
            var itemTemplate = $('#itemTemplate');

            for (i = 0; i < data.length; i++) {
                itemTemplate.find('.panel-title').text(data[i].name);
                itemTemplate.find('img').attr('src', data[i].picture);
                itemTemplate.find('.pet-breed').text(data[i].breed);
                itemTemplate.find('.pet-age').text(data[i].age);
                itemTemplate.find('.pet-location').text(data[i].location);
                itemTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                itemRow.append(itemTemplate.html());
            }
        });

        return App.initWeb3();
    },

    initWeb3: function () {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Shop.json', function (data) {
            var BueyerArtifact = data;
            // Truffle contract is redundant to web3, but allows you to absorb truffle build files
            // with deployed addresses and ABIs that you  would have to set otherwise in Web3 - NJ
            App.contracts.Shop = TruffleContract(BueyerArtifact);

            // Set the provider for our contract
            App.contracts.Shop.setProvider(App.web3Provider);


        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleBuy);
    },

    markBuyed: function (buyers, account) {
        var buyerInstance;

        App.contracts.Shop.deployed().then(function (instance) {
            buyerInstance = instance;

            return buyerInstance.getShoppers.call();
        }).then(function (shoppers) {
            for (i = 0; i < shoppers.length; i++) {
                if (shoppers[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
                }
            }
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    handleBuy: function (event) {
        event.preventDefault();

        var itemId = parseInt($(event.target).data('id'));
        var buyInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Shop.deployed().then(function (instance) {
                buyInstance = instance;

                // Execute adopt as a transaction by sending account
                return buyInstance.buy(itemId, {from: account});
            }).then(function (result) {
                return App.markAdopted();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
