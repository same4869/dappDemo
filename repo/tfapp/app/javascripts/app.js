// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

// // Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import voting_artifacts from '../../build/contracts/Voting.json'

var Voting = contract(voting_artifacts);

let candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

window.voteForCandidate = function(candidate) {
 let candidateName = $("#candidate").val();
 try {
  $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
  $("#candidate").val("");
  console.log("ffff");

  Voting.deployed().then(function(contractInstance) {
    console.log("aaaaaa");
   contractInstance.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
    let div_id = candidates[candidateName];
    console.log("bbbbbb");
    return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
     $("#" + div_id).html(v.toString());
     $("#msg").html("");
    });
   });
  });
 } catch (err) {
  console.log(err);
 }
}

$( document ).ready(function() {
 if (typeof web3 !== 'undefined') {
  console.warn("Using web3 detected from external source like Metamask")
  // Use Mist/MetaMask's provider
  console.log("ccccc");
  window.web3 = new Web3(web3.currentProvider);
 } else {
    console.log("dddddd");
  console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 }

 Voting.setProvider(web3.currentProvider);
 let candidateNames = Object.keys(candidates);
 console.log("eeeeee");
 for (var i = 0; i < candidateNames.length; i++) {
  let name = candidateNames[i];
  Voting.deployed().then(function(contractInstance) {
   contractInstance.totalVotesFor.call(name).then(function(v) {
    $("#" + candidates[name]).html(v.toString());
   });
  })
 }
});