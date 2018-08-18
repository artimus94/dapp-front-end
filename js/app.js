console.log("Hello Dappathon!");

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON("./js/Explorer.json", function(explorer) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Explorer = TruffleContract(explorer);
        // Connect provider to interact with contract
        App.contracts.Explorer.setProvider(App.web3Provider);
  
        return App.render();
      });
    },
  
    render: function() {
      var explorerInstance;
      var loader = $("#loader");
      var content = $("#content");
  
      loader.show();
      content.hide();
  
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });
  
      // Load contract data - TODO
      App.contracts.Explorer.deployed().then(function(instance) {
        explorerInstance = instance;
        return explorerInstance.owner.call();
      })
      .then(function() {
       // TODO
        loader.hide();
        content.show();
      })
      .catch(function(error) {
        console.warn(error);
      });

      $("#submitAddProduct").click(function(){
        var sA = $("#productAdress")
        var sN = $("#productName")
        var sK = $("#productSourceName")
        
        App.contracts.Explorer.deployed().then(function(instance) {
          explorerInstance = instance;
          return explorerInstance.addProduct(sA.val(), sN.val(), sK.val())
        })
        .then(function(tx_hash_that_i_promised_you){
          alert("Transaction sent. TxHash: " + tx_hash_that_i_promised_you.tx)
          
          // Resetting the form inputs
          sA.val("")
          sN.val("")
          sK.val("")
        })
      })

      $("#getProductSubmit").click(function(){
        console.log("Yo!");
        var sA = $("#getProductAdress")

        App.contracts.Explorer.deployed().then(function(instance) {
          console.log("Am I get called?")
          explorerInstance = instance;
          return explorerInstance.Products.call(sA.val())
        })
        .then(function(product_that_i_promised_you){
          console.log(product_that_i_promised_you)
        })
      })
    }
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  