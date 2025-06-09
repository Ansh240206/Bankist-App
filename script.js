'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let userMovements = [];
let userInterest;

const displaymovements = function (movements) {
  containerMovements.innerHTML = ''; //for removing the already there entries

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displaymovements(userMovements);

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${balance} €`;
};

// calcDisplayBalance(userMovements);

const calcDisplaySummary = function (movements, interestRate) {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const expenses = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(expenses)} €`;

  const interest = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + (mov * interestRate) / 100, 0);
  labelSumInterest.textContent = `${interest} €`;
};

// calcDisplaySummary(userMovements, userInterest);

//usernames

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);

const createBalance = function (accs) {
  accs.forEach(function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  });
};

createBalance(accounts);
//Event Handlers

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //for preventing auto submission due to btn being in form

  const username = inputLoginUsername.value.trim().toLowerCase();
  const loginPIN = Number(inputLoginPin.value.trim());

  currentAccount = accounts.find(
    acc => username === acc.username && acc.pin === loginPIN
  );

  if (currentAccount) {
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    } !!!`;
    updateUI(currentAccount);
  } else {
    alert('Incorrect credentials!!!');
  }

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur(); // cursor loses focus after hitting enter
});

//Loan

let count = 0;

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const askedMoney = inputLoanAmount.value;
  if (count > 3) {
    alert('Maximum limit reached!!');
  } else if (movements.some(mov => mov >= askedMoney / 10)) {
    currentAccount.movements.push(Number(askedMoney));
    updateUI(currentAccount);
    createBalance(accounts);
    count++;
  } else {
    alert('Asked amount is not valid for your account.');
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//Transferring Money

const transferMoney = function (receiver, money) {
  const receivingAccount = accounts.find(
    person => receiver.toLowerCase() === person.username
  );
  const sendingAccount = currentAccount;
  if (
    receivingAccount &&
    money > 0 &&
    currentAccount.balance >= money &&
    receiver != currentAccount.username
  ) {
    receivingAccount.movements.push(Number(money));
    sendingAccount.movements.push(-Number(money));

    updateUI(sendingAccount);
    createBalance(accounts);
  } else {
    alert('Incorrect Credentials OR Not enough money in bank account');
  }
};

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiver = inputTransferTo.value.trim();
  const money = Number(inputTransferAmount.value);

  transferMoney(receiver, money);
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

//updating the UI

const updateUI = function (account) {
  userMovements = account.movements;
  displaymovements(userMovements);
  userInterest = account.interestRate;
  calcDisplayBalance(userMovements);
  calcDisplaySummary(userMovements, userInterest);
  console.log(account);
};

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const closePIN = inputClosePin.value;
  accounts = accounts.filter(
    acc => acc.username != user && acc.pin != closePIN
  );
  if (user === currentAccount.username) {
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Login to get started';
  }
  console.log(accounts);
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJulia1 = dogsJulia.slice(1, 3);
//   const finalages = [...dogsJulia1, ...dogsKate];
//   finalages.forEach(function (age, i) {
//     age >= 3
//       ? console.log(`dog ${i + 1} is an adult dog`)
//       : console.log(`dog ${i + 1} is still a puppy`);
//   });
// };

// checkDogs(dogsJulia, dogsKate);

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(function (age) {
    if (age <= 2) {
      return age * 2;
    } else {
      return age * 4 + 16;
    }
  });

  const adults = humanAge.filter(age => age >= 18);
  const averageAge = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return averageAge;
};

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

const lastLarge = Number(movements.findLast(mov => mov > 1000));
const lastLargeIndex = movements.findLastIndex(mov => mov > 2000);
console.log(lastLarge, lastLargeIndex);
