App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    //Init App Object


    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Attendance.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AttendanceArtifact = data;
      App.contracts.Attendance = TruffleContract(AttendanceArtifact);

      // Set the provider for our contract
      App.contracts.Attendance.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-sign', App.handleSign);
  },


  handleSign: function(event) {
    event.preventDefault();
    var examCode = parseInt(document.getElementById("codeE"));
    var studentId = parseInt(document.getElementById("sID"));
    var hashedSignature; //Missing IPFS hash and process
    var time = parseInt((new Date()).getTime());
    var ipfsApi = window.IpfsApi('localhost', '5001');
    var imageBlob = dataURLToBlob(signaturePad.toDataURL());
    var attendanceInstance;
    var buffer;
    var toBuffer = require('blob-to-buffer');

    toBuffer(imageBlob, function(err, buffer) {
      if (err) throw err

      buffer[0] // => 1
      buffer.readUInt8(1) // => 2
    });

    ipfsApi.add(buffer, {
        progress: (prog) => console.log(`received: ${prog}`)
      })
      .then((response) => {
        console.log(response)
        hashedSignature = response[0].hash
        console.log(ipfsId)
      }).catch((err) => {
        console.error(err)
      });

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Attendance.deployed().then(function(instance) {
        attendanceInstance = instance;

        // Execute sign as a transaction by sending account
        return attendanceInstance.sign(examCode, studentId, hashedSignature, time, {
          from: account
        });
      }).then(function(result) {
        //DoSomething when Attendance is isgned
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


// Load account data
/*web3.eth.getCoinbase(function(err, account) {
  if (err === null) {
    App.account = account;
    $("#accountAddress").html("Your Account: " + account);
  }
});*/
