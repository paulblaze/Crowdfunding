let currentAccount = null;
let web3;
let abi;
let contractAddress = '0x4B2846FF9dDe8bdC5AD981c74121Bcf4C28d9d96';    
let contractObj;
let currentBlockTime;
const projectStatus = ["Open","Completed","Expired"];

async function handleAccountsChanged(accounts) {
    console.log('Calling HandleChanged')

    if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
        $('#enableMetamask').html('Connect with Metamask')
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        $('#enableMetamask').html(currentAccount)
        $('#status').html('')

        if(currentAccount != null) {
            // Set the button label
            getEthBalance(currentAccount);
            if(typeof getMyProjects !== "undefined"){
                getMyProjects();
            }

            if(typeof getMyContributions !== "undefined"){
                getMyContributions();
            }
        }    
    }
    console.log('WalletAddress in HandleAccountChanged ='+currentAccount)
}

function connect() {
    console.log('Calling connect()')
    ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
    if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
        $('#status').html('You refused to connect Metamask')
    } else {
        console.error(err);
    }
    });
}

function detectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {                
        return true
    } else {                
        return false
    }
}

$( document ).ready(function() {
    m = detectMetaMask()
    if(m) {
        $('#metaicon').removeClass('meta-gray')
        $('#metaicon').addClass('meta-normal')
        $('#enableMetamask').attr('disabled',false)
        connect() // Make sure the connected wallet is being returned
    } else {
        $('#enableMetamask').attr('disabled',true)
        $('#metaicon').removeClass('meta-normal')
        $('#metaicon').addClass('meta-gray')
    }

    $('#enableMetamask').on('click',function() {
        window.web3 = new Web3(window.ethereum);
        connect()
    });    
});

window.addEventListener('load', () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.on("accountsChanged", (accounts) => {
            handleAccountsChanged(accounts);
        });
        window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    
    setContractObj(); 
    getCurrentTime();   
});

async function setContractObj() {
    await $.getJSON("contracts/Crowdfunding.json", function(result) {            
        abi = result.abi
        contractObj = new web3.eth.Contract(abi, contractAddress);
        if(typeof getAllProjects !== "undefined"){
            getAllProjects(); 
        }

        if(typeof getMyProjects !== "undefined"){
            getMyProjects();
        }

        if(typeof getMyContributions !== "undefined"){
            getMyContributions();
        }           
    });
}

async function getEthBalance(address) {
    await web3.eth.getBalance(address, (err, balance) => {  
        $('#enableMetamask').html(currentAccount + " Balance: " + web3.utils.fromWei(balance.toString()));  
    });
}

const chainId = ethereum.request({ method: 'eth_chainId' });

ethereum.on('chainChanged', handleChainChanged);

function handleChainChanged(_chainId) {
  // We recommend reloading the page, unless you must do otherwise
  web3 = new Web3(web3.currentProvider);
  console.log(chainId);
  //window.location.reload();
}

async function getCurrentTime() {    
    await web3.eth.getBlockNumber().then(function(blockNumber){
        web3.eth.getBlock(blockNumber).then(function(block) {
            currentBlockTime = block.timestamp;
        });
    });    
} 