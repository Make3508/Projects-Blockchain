const contractAddress = "0x5364aF68c175bCcF2c79FfF9Ece3a7Dc5c66fD0D";
// Указываем ABI (Application Binary Interface) контракта
const abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "compChoice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "winner",
        type: "uint256",
      },
    ],
    name: "GamePlayed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_option",
        type: "uint256",
      },
    ],
    name: "playGame",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
// Подключаемся к web3 провайдеру (метамаск)
const provider = new ethers.providers.Web3Provider(window.ethereum, 97); //ChainID 97

let signer;
let contract;

//Запрашиваем аккаунты пользователя и подключаемся к первому аккаунту
provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);
    //Создаем объект контракта
    contract = new ethers.Contract(contractAddress, abi, signer);
    //  console.log(contract);
  });
});
// интерфейс для игры переделал с примера одного из уроков, который был без контракта
let userScore = 0;
let computerScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const scissors_div = document.getElementById("s");
const paper_div = document.getElementById("p");

function convertToWord(letter) {
  if (letter === "0") return "Rock";
  if (letter === "1") return "Scissors";
  return "Paper";
}

//Выиграл игрок
function win(userChoice, computerChoice, player) {
  userScore++;
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;
  result_p.innerHTML = `${convertToWord(
    userChoice
  )} (user = ${player}) beats ${convertToWord(
    computerChoice
  )}(comp). You win!🎉`;
}

//Выиграл контракт
function lose(userChoice, computerChoice, player) {
  computerScore++;
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;
  result_p.innerHTML = `${convertToWord(
    userChoice
  )} (user = ${player}) loses to ${convertToWord(
    computerChoice
  )}(comp). You lost...😥`;
}

//Ничья
function draw(userChoice, computerChoice, player) {
  result_p.innerHTML = `${convertToWord(
    userChoice
  )} (user = ${player}) equals ${convertToWord(
    computerChoice
  )}(comp). It's a draw`;
}

async function game(userChoice) {
  let amountInWei = ethers.utils.parseEther((0.000001).toString());

  let result2 = await contract.playGame(Number(userChoice), {
    value: amountInWei,
  });
  const res2 = await result2.wait();
  // console.log(res2);
  getGamePlayed(userChoice);
}

async function getGamePlayed(userChoice) {
  let queryResult = await contract.queryFilter(
    "GamePlayed",
    (await provider.getBlockNumber()) - 5000,
    await provider.getBlockNumber()
  ); //проверить на 10000

  let queryResultRecent = queryResult[queryResult.length - 1];

  let player = await queryResultRecent.args.player.toString();
  let computerChoice = await queryResultRecent.args.compChoice.toString();
  let result = await queryResultRecent.args.winner.toString();

  console.log("player=" + player);
  console.log("result=" + result);
  console.log("userChoice=" + userChoice);
  console.log("computerChoice=" + computerChoice);

  if (result == "0") {
    lose(userChoice, computerChoice, player);
  }
  if (result == "1") {
    win(userChoice, computerChoice, player);
  }
  if (result == "2") {
    draw(userChoice, computerChoice, player);
  }
}
function main() {
  rock_div.addEventListener("click", function () {
    game("0");
  });
  scissors_div.addEventListener("click", function () {
    game("1");
  });
  paper_div.addEventListener("click", function () {
    game("2");
  });
}
main();
