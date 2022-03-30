const btnCat = document.querySelectorAll(".btn-warning");
const cart = document.querySelector("table");
const btnCartClear = document.querySelector(".btn-lg");

//整理購物車資訊轉成陣列
function dataTransform(shoppingData) {
  const transData = [];
  for (let i = 0; i < shoppingData.length; i++) {
    if (shoppingData[i].textContent.split("$").length > 1) {
      transData[i] = shoppingData[i].textContent.split("$")[1];
    } else {
      transData[i] = shoppingData[i].textContent;
    }
  }
  return transData;
}

//加總購物車各小項金額及總金額
function cartTotal() {
  const shoppingData = document.querySelectorAll("td");
  const quantity = document.querySelectorAll("input");
  const transData = dataTransform(shoppingData);
  const totalindex = transData.indexOf("總價");
  shoppingData[totalindex + 1].textContent = 0;
  for (let i = 0; i < (shoppingData.length - 4) / 5; i++) {
    quantity[i].value = Math.max(0, quantity[i].value);
    shoppingData[3 + i * 5].textContent =
      "$" +
      String(
        (Number(transData[2 + i * 5]) * Number(quantity[i].value)).toFixed(2)
      );
    shoppingData[totalindex + 1].textContent = (
      Number(shoppingData[totalindex + 1].textContent) +
      Number(transData[2 + i * 5]) * Number(quantity[i].value)
    ).toFixed(2);
  }
  shoppingData[totalindex + 1].textContent =
    "$" + shoppingData[totalindex + 1].textContent;
}

//監聽小貓圖示是否被點擊已存在購物車變更數量金額，不存在新增一列資訊至購物車並變更總金額
for (let i = 0; i < btnCat.length; i++) {
  btnCat[i].addEventListener("click", () => {
    const catName = document.querySelectorAll(".card-title");
    const transData = dataTransform(document.querySelectorAll("td"));
    const quantity = document.querySelectorAll("input");
    if (transData.indexOf(catName[i].textContent) != -1) {
      const index = transData.indexOf(catName[i].textContent);
      quantity[index / 5].value = Number(quantity[index / 5].value) + 1;
      cartTotal();
    } else {
      const price = document.querySelectorAll(".price");
      const newItem = `<tr><td>${String(
        catName[i].textContent
      )}</td><td><input type="number" value="1"></td><td>${String(
        price[i].textContent
      )}</td><td>${String(
        price[i].textContent
      )}</td><td><button class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td></tr>`;
      const cartBody = document.querySelector("tbody");
      cartBody.insertAdjacentHTML("beforeend", newItem);
      cartTotal();
    }
  });
}
//監聽購物車數量是否有修改項目是否有被刪除，有的話重新計算各項目金額及總金額
cart.addEventListener("click", (e) => {
  if (e.target.matches("td") | e.target.matches("input")) {
    cartTotal();
  } else if (e.target.parentElement.matches("button")) {
    e.target.parentElement.parentElement.parentElement.remove();
    cartTotal();
  } else if (e.target.matches("button")) {
    e.target.parentElement.parentElement.remove();
    cartTotal();
  }
});

//監聽清空購物車按鈕是否被點擊，有的話清空購物車
btnCartClear.addEventListener("click", () => {
  const cartBody = document.querySelector("tbody");
  cartBody.remove();
  const shoppingData = document.querySelectorAll("td");
  const transData = dataTransform(shoppingData);
  const totalindex = transData.indexOf("總價");
  shoppingData[totalindex + 1].textContent = "$0";
  const cartHead = document.querySelector("thead");
  const newCartBody = document.createElement("tbody");
  cartHead.insertAdjacentElement("afterend", newCartBody);
});
