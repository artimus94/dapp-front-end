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
      
      $("#submitAddIngredient").click(function(){
        var iA = $("#ingredientAdress")
        var pA = $("#productAdress")
        var iN = $("#ingredientName")
        
        App.contracts.Explorer.deployed().then(function(instance) {
          explorerInstance = instance;
          return explorerInstance.addIngredient(iA.val(), pA.val(), iN.val())
        })
        .then(function(tx_hashIngredient_that_i_promised_you){
          alert("Transaction sent. TxHash: " + tx_hashIngredient_that_i_promised_you.tx)
          
          // Resetting the form inputs
          iA.val("")
          pA.val("")
          iN.val("")
        })
      })

      $("#getIngredientSubmit").click(function(){
        console.log("Yo!");
        var pA = $("#getIngredientAdress")

        App.contracts.Explorer.deployed().then(function(instance) {
          console.log("Am I get called?")
          explorerInstance = instance;
          return explorerInstance.ingredients.call(pA.val())
        })
        .then(function(ingredient_that_i_promised_you){
          alert("Ingredient: " + ingredient_that_i_promised_you)
        })
      })

      $("#getProductSubmit").click(function(){
        console.log("Yo!");
        var sA = $("#getProductAdress")

        App.contracts.Explorer.deployed().then(function(instance) {
          console.log("Am I get called?")
          explorerInstance = instance;
          
          return explorerInstance.products.call(sA.val())
        })
        .then(function(product_that_i_promised_you){
          alert("Product, Company: " + product_that_i_promised_you)
          
        })
      })

      $("#getProductIngredientSubmit").click(function(){
        console.log("Yo!");
        var pIA = $("#getProductIngredientAdress")

        App.contracts.Explorer.deployed().then(function(instance) {
          console.log("Am I get called?")
          explorerInstance = instance;
          
          var iL =  explorerInstance.getIngredientLength(pIA.val())

          // for (var i = 0; i < iL; i++) {
          //   return explorerInstance.getIngredient(pIA.val(), i)
          // }
          do {
            return explorerInstance.getIngredient(pIA.val(), iL - 1)
            --iL;
        }
        while (iL > 0);
        })
        .then(function(product_that_i_promised_you){
          //alert(product_that_i_promised_you)
          alert("Ingredient Address: " + product_that_i_promised_you)
        })
      })


    }
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  