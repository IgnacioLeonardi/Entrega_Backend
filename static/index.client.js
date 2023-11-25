const productList = document.querySelector("ul");
const validMemberMessage = document.getElementById("validMemberMessage");
const initialize = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lastAttemptedUsername = urlParams.get("lastAttemptedUsername");
  if (lastAttemptedUsername) {
    validMemberMessage.textContent = `Intentaste iniciar sesión como: ${lastAttemptedUsername}. Intenta con tu nombre, o uno de los siguientes: "Admin", "Bauti", "Nacho", "Tutor", "Marian"`;
  }

  const response = await fetch("/api/products");
  const products = await response.json();

  productList.innerHTML = "";
  for (const product of products) {
    const li = document.createElement("li");
    li.innerHTML = `Nombre del producto: ${product?.title} ($${product?.price})`;
    productList?.appendChild(li);
  }
};

initialize();