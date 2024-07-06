let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

const cash = document.getElementById("cash");
const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const total = document.getElementById("total");
const drawerDisplay = [...document.getElementById("cash-drawer-display")
  .getElementsByTagName("span")];

total.innerHTML = `Total: $<span>${price}</span>`;
drawerDisplay.forEach((element, i) => {
  element.textContent = `$${cid[i][1]}`;
});

class CashRegister {

  constructor() {
    this.createCid = this.createCid.bind(this);
    this.totalCidAmount = this.totalCidAmount.bind(this);
    this.change = this.change.bind(this);
    this.purchase = this.purchase.bind(this);
  };

  createCid() {
    return cid.map(cash => cash[1]);
  };

  totalCidAmount(drawer) {
    return parseFloat(drawer.reduce((acc, cur) => acc + cur).toFixed(2))
  };

  change() {
    let payment = parseFloat(cash.value);
    let mid = cid.map(money => money[1]);
    let cidAmount = this.totalCidAmount(cid.map(money => money[1]));
    if (payment < price) {
      alert("Customer does not have enough money to purchase the item");
    } else if (cidAmount + price - payment < 0) {
      changeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
    } else if (payment === price) {
      changeDue.innerHTML = "<p>No change due - customer paid with exact cash</p>";
    } else {
      let moneyValues = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100]
      let remainder = parseFloat((payment - price).toFixed(2));
      for (let i = 8; i > -1; i--) {
        let items = parseFloat((mid[i] / moneyValues[i]).toFixed(2));
        for (let j = items; j > 0; j--) {
          if (remainder >= moneyValues[i]) {
            mid[i] = parseFloat((mid[i] - moneyValues[i]).toFixed(2));
            remainder = parseFloat((remainder - moneyValues[i]).toFixed(2));
          }
          if (remainder === 0) {
            changeDue.innerHTML = "<p>Status: OPEN</p>";
            for (let k = 8; k > -1; k--) {
              if (cid[k][1] - mid[k] > 0) {
                changeDue.innerHTML += `<p>${cid[k][0]}: $${parseFloat((cid[k][1] - mid[k]).toFixed(2))}</p>`;
                drawerDisplay[k].textContent = `${cid[k][1]}`;
              }
            }
            if (this.totalCidAmount(mid) === 0) {
              changeDue.innerHTML = changeDue.innerHTML.replace("OPEN", "CLOSED");
            }
            break;
          }
        }
        if (remainder === 0) {
          break;
        }
      }
      if (remainder > 0) {
        changeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
      }
    }
  };

  purchase () {
    this.change();
    cash.value = "";
  };

};

const till = new CashRegister();

purchaseBtn.addEventListener("click", till.purchase);
cash.addEventListener("keyup", event => {
  if (event.key === "Enter") {
    till.purchase();
  }
});
