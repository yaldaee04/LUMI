const products = [
    {
        id: 1,
        name: "کرم آبرسان",
        category: "hydration",
        price: 450000,
        image: "images/product1.jpg",
        description: "کرم آبرسان و مرطوب کننده پوست"
    },

    {
        id: 2,
        name: "سرم ویتامین c",
        category: "serum",
        price: 620000,
        image: "images/product2.jpg",
        description: "سرم روشن کننده و مراقبت از پوست"
    },

    {
        id: 3,
        name: "ضد آفتاب",
        category: "sunscreen",
        price: 380000,
        image: "images/product3.jpg",
        description: "محافظت از پوست در برابر اشعه های مضر خورشید"
    }
];

const productContainer =
    document.querySelector(".product-container");

if (productContainer) {

    const params = new
        URLSearchParams(window.location.search);

    const selectedCategory = params.get("category");

    const filteredProducts = products.filter(product => {
        return product.category === selectedCategory;
    });

    filteredProducts.forEach(product => {

        productContainer.innerHTML += `
        <a href="product.html?id=${product.id}"
        class="product-card">

        <img src="${product.image}"alt="${product.name}">

        <h3>${product.name}</h3>

        <p>${product.price.toLocaleString()} تومان</p>

        </a>
        `;
    });
}

const productInfo =
    document.querySelector("#product-info");

if (productInfo) {
    const params = new
        URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));
    console.log("Product ID", productId)
    console.log("Products", products)

    const selectedproduct = products.find(product => {
        return product.id === productId;
    });

    if (selectedproduct) {
        productInfo.innerHTML = `
        <div class="product-detail-card">
        <img src="${selectedproduct.image}" alt="${selectedproduct.name}">

        <div class="product-detail-content">
            <h1>${selectedproduct.name}</h1>
            <p>${selectedproduct.description}</p>
            <h3>${selectedproduct.price.toLocaleString()} تومان</h3>

            <button
            class="add-to-cart-btn"
            onclick="addToCart(${selectedproduct.id})">
            افزودن به سبد خرید</button>
        </div>

        </div>
        `;
    } else {
        productInfo.innerHTML = "<p>محصول مورد نظر پیدا نشد!</p>";

    }

}

const cartButton = document.querySelector(".cart");

const closeCartButton =
    document.querySelector(".close-cart");
const cartOverlay =
    document.querySelector(".cart-overlay");


function openCart() {
    document.body.classList.add("cart-open");

}

function closeCart() {
    document.body.classList.remove("cart-open");
}


if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}

function addToCart(productId) {

    const selectedproduct = products.find(product => {
        return product.id === productId;
    });

    if (!selectedproduct) {
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(item => {
        return item.id === productId;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...selectedproduct,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("Before render:",JSON.parse(localStorage.getItem("cart")));

    renderCart();

    openCart();

    console.log("after render:",document.querySelector(".cart-items").innerHTML);
    alert("محصول به سبد خرید اضافه شد!");
}

function renderCart() {
    const cartitems = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");

    console.log("cart items:" , cartitems);
    console.log("cart total:" , cartTotal);

    if (!cartitems || !cartTotal) {
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartitems.innerHTML = "";

    let total = 0;

    if(cart.length === 0) {
             cartitems.innerHTML =`
             <p class="empty-cart">
                سبد شما خالی است!
             </p>
             `;
        }

    cart.forEach(item => {
        total += item.price * item.quantity;

        cartitems.innerHTML +=`
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">

                 <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString()}تومان</p>
                 </div>


                <div class="cart-quantity">
                     <button onclick="changeQuantity(${item.id}, -1)">−</button>
                     <span>${item.quantity}</span>
                     <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
         `;
    });

    cartTotal.textContent = total.toLocaleString();

    window.addEventListener("pageshow", function(event) {
    renderCart();
});

}

renderCart();

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
}

function changeQuantity(productId,change){
    let cart = JSON.parse(localStorage.getItem("cart"))||[];

    const product = cart.find(item => item.id === productId);

    if (!product) {
        return;
    }

    product.quantity += change ;

    if(product.quantity<=0){
        cart=cart.filter(item=>item.id !== productId);
    }

    localStorage.setItem("cart",JSON.stringify(cart));

    renderCart();
}

function renderCheckoutSummary(){
    const checkoutItems = document.querySelector(".checkout-items");
    const finalTotal = document.querySelector(".final-total");

    if(!checkoutItems|| !finalTotal){
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart"))||[];

    console.log("cart:",cart);

    checkoutItems.innerHTML ="";

    let total = 0;

    if(cart.length === 0 ){
        checkoutItems.innerHTML = "<p>سبد شما خالی است!</p>"
    }

    cart.forEach(item=>{
        total += item.price * item.quantity;

        checkoutItems.innerHTML +=`
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}">

            <div>
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString()}تومان</p>
                <p>تعداد:${item.quantity}</p>
            </div>
        </div>
        `;
    });

    finalTotal.textContent = total.toLocaleString() + "تومان";

}

renderCheckoutSummary();

const checkoutForm = document.querySelector(".checkout-form");

if(checkoutForm){

    checkoutForm.addEventListener("submit",function(event){

        event.preventDefault();

        const fullname = document.querySelector("#fullname").value;
        const phone = document.querySelector("#phone").value;

        const phoneRegex = /^09\d{9}$/;

        if (!phoneRegex.test(phone)){
            alert("لطفا شماره موبایل معتبر وارد کنید !")
            return;
        }
        const address = document.querySelector("#address").value;

        const cart = JSON.parse(localStorage.getItem("cart"))||[];

        const total=cart.reduce((sum,item)=>{

            return sum+item.price * item.quantity;

        },0);

        const order = {
            fullname : fullname,
            phone:phone,
            address:address,
            items:cart,
            total:total
        };

        localStorage.setItem("lastOrder", JSON.stringify(order));

        localStorage
        .removeItem("cart");

        console.log("Saved Order:",order);

        window.location.href = "success.html";
    });
}

function goToCheckout(){

    let cart = JSON.parse(localStorage.getItem("cart"))||[];

    if (cart.length === 0 ){
        alert("سبد خرید شما خالی است ! ");
        return;
    }
    window.location.href = "checkout.html";
}

const successTotal = document.querySelector(".success-total");

if (successTotal) {

    const order = JSON.parse(localStorage.getItem("lastOrder"));

    console.log("Last Order",order);

    if (order) {
        successTotal.textContent =
            order.total.toLocaleString() + " تومان";
    } else {
        successTotal.textContent = "سفارشی پیدا نشد!";
    }

}