getModifiers();
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.product_img').forEach(el => {
        console.log(el);
        const img = el.querySelector('img');

        const ImageLoad = new Image();
        ImageLoad.src = img.dataset.src;
        ImageLoad.onload = function () {
            img.src = this.src;
        }
        ImageLoad.error = function () {
            setTimeout(() => {
                ImageLoad.src = img.dataset.src;
            }, 1000);
        }

    });

    const productId = document.querySelector('.product__box').dataset.product_id;
    const productName = document.querySelector('.product__title').querySelector('h1').textContent;
    const productPrice = parseFloat(document.querySelector('.price').textContent);
    const category = document.querySelector('.product__box').dataset.category;
    try {
        dataLayer.push({
            "ecommerce": {
                "currencyCode": currencyCode,
                "detail": {
                    "products": [{
                        "id": productId,
                        "name": productName,
                        "price": productPrice,
                        "category": category
                    }]
                }
            }
        });
    } catch (error) {

    }


})

// function lessGoods(btn, type) {

//     const catalogBlockItem = btn.closest('.product__box');

//     const productId = catalogBlockItem.dataset.product_id;


//     if (type == 'incart') {
//         const input = catalogBlockItem.querySelector('input[name="incart"]');
//         let CountProduct = input.valueAsNumber;
//         CountProduct--;
//         const xhr = new XMLHttpRequest();
//         xhr.open("POST", "/cart/change");
//         xhr.responseType = 'json';
//         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         xhr.onload = function () {
//             input.value = CountProduct;
//             if (xhr.response.last_change.count <= 0) {
//                 const footer = catalogBlockItem.querySelector('.product__addCart');
//                 footer.querySelector('.product_in_cart').classList.add('hide');
//                 footer.querySelector('.in_not_cart').classList.remove('hide');
//                 input.value = 1;
//                 const allCount = document.querySelectorAll('.cart_count');

//                 footer.querySelector('.in_not_cart').querySelector('.text').value = 1;
//                 footer.querySelector('.product_in_cart').querySelector('.text').value = 1;

//                 allCount.forEach(el => {
//                     el.textContent = xhr.response.count_cart;
//                 });

//                 const productId = document.querySelector('.product__box').dataset.product_id;
//                 const productName = document.querySelector('.product__title').querySelector('h1').textContent;
//                 const productPrice = parseFloat(document.querySelector('.price').textContent);
//                 const category = document.querySelector('.product__box').dataset.category;
//                 try {
//                     dataLayer.push({
//                         "ecommerce": {
//                             "currencyCode": currencyCode,
//                             "remove": {
//                                 "products": [{
//                                     "id": productId,
//                                     "name": productName,
//                                     "quantity": Math.abs(xhr.response.last_change.difference),
//                                     "category": category
//                                 }]
//                             }
//                         }
//                     });
//                 } catch (error) {

//                 }


//             }

//         }
//         xhr.send("count=1&product+id=" + encodeURIComponent(productId) + "&type=decrease");
//     } else {
//         const input = catalogBlockItem.querySelector('input[name="notcart"]');
//         let CountProduct = input.valueAsNumber;
//         CountProduct--;
//         if (CountProduct <= 1) CountProduct = 1;
//         input.value = CountProduct;
//     }

// }

// function countProduct(input, type) {
//     const catalogBlockItem = input.closest('.product__box');
//     const productId = catalogBlockItem.dataset.product_id;

//     if (input.valueAsNumber < 1) input.value = 1;
//     let CountProduct = input.valueAsNumber;

//     if (type == 'incart') {
//         const xhr = new XMLHttpRequest();
//         xhr.open("POST", "/cart/change");
//         xhr.responseType = 'json';
//         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         xhr.onload = function () { }
//         xhr.send("count=" + encodeURIComponent(CountProduct) + "&product+id=" + encodeURIComponent(productId));
//     } else if (input.valueAsNumber == 0) {
//         input.valueAsNumber = 1;
//     }
// }

// function moreProduct(btn, type) {
//     const catalogBlockItem = btn.closest('.product__box');

//     const productId = catalogBlockItem.dataset.product_id;

//     if (btn.classList.contains("modifiers")) {
//         catalogBlockItem.querySelector(".catalog-block__in-cart").click();
//         return;
//     }

//     if (type == 'incart') {
//         const input = catalogBlockItem.querySelector('input[name="incart"]');
//         let CountProduct = input.valueAsNumber;
//         CountProduct++;
//         console.log(CountProduct);
//         input.value = CountProduct;

//         const xhr = new XMLHttpRequest();
//         xhr.open("POST", "/cart/change");
//         xhr.responseType = 'json';
//         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         xhr.onload = function () {

//         }
//         xhr.send("count=1&product+id=" + encodeURIComponent(productId));
//     } else {
//         const input = catalogBlockItem.querySelector('input[name="notcart"]');
//         let CountProduct = input.valueAsNumber;
//         CountProduct++;
//         input.value = CountProduct;
//     }
// }


// function cartAdd(btn) {
//     const catalogBlockItem = btn.closest('.product__box');
//     const input = catalogBlockItem.querySelector('input[name="notcart"]');
//     const productId = catalogBlockItem.dataset.product_id;


//     if (productId == "") {
//         console.log("Product Id NULL");
//         return;
//     }


//     const xhr = new XMLHttpRequest();

//     xhr.open("POST", "/cart/change");
//     xhr.responseType = 'json';
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     xhr.onload = function () {
//         const footer = catalogBlockItem.querySelector('.product__addCart');
//         footer.querySelector('.product_in_cart').classList.remove('hide');
//         footer.querySelector('.in_not_cart').classList.add('hide');
//         // footer.querySelector('.product_in_cart').querySelector('.text').value = xhr.response.last_change.count

//         const allCount = document.querySelectorAll('.cart_count');

//         allCount.forEach(el => {
//             el.textContent = xhr.response.count_cart
//         });

//         const productId = xhr.response.last_change.product_id;


//         const offer = Object.values(xhr.response.list).find(ol => ol.product_id === productId)

//         const category = document.querySelector('.product__box').dataset.category;
//         document.querySelector('input[name="incart"]').value = document.querySelector('input[name="notcart"]').value
//         try {
//             dataLayer.push({
//                 "ecommerce": {
//                     "currencyCode": currencyCode,
//                     "add": {
//                         "products": [{
//                             "id": productId,
//                             "name": offer.name,
//                             "price": offer.price['delivery'],
//                             "quantity": Math.abs(xhr.response.last_change.difference),
//                             "category": category
//                         }]
//                     }
//                 }
//             });
//         } catch (error) {

//         }

//     }
//     xhr.send("count=" + encodeURIComponent(input.valueAsNumber) + "&product+id=" + encodeURIComponent(productId));
// }

// function cartAddModifier(btn) {

//     let arrModifier = new Array();

//     const catalogBlockItem = btn.closest('.product__box');
//     const input = catalogBlockItem.querySelector('input[name="notcart"]');
//     const productId = catalogBlockItem.dataset.product_id;
//     const modifierGroupPruduct = JSON.parse(btn.dataset.modif);
//     if (input.closest(".in_not_cart").classList.contains("hide")) {
//         input.value = 1;
//     }


//     if (productId == "") {
//         console.log("Product Id NULL");
//         return;
//     }

//     const selectedModifiersGroup = [];
//     modifierGroupPruduct.forEach(el => {
//         selectedModifiersGroup.push(modifiersGroup[el])
//     });


//     if (selectedModifiersGroup.length > 0) {
//         const modalBox = document.createElement("div");
//         modalBox.classList.add("modal-box")

//         const bodyModal = document.createElement("div");
//         bodyModal.classList.add("modal-modifier");
//         const modifiersKey = Object.keys(modifiers);
//         const selectedModifiers = [];
//         for (let i = 0; i < modifiersKey.length; i++) {
//             let mod = JSON.parse(modifiers[modifiersKey[i]]);
//             if (mod.modifiersGroupId == selectedModifiersGroup[Object.keys(selectedModifiersGroup)[0]].id) {
//                 selectedModifiers.push(mod)
//             }

//         }
//         const productBox = document.createElement("div");
//         productBox.classList.add("modal-product-box");

//         const modifierBox = document.createElement("div");
//         modifierBox.classList.add("modal-modifier-box");

//         const blockItem = btn.closest(".product__box").cloneNode(true);
//         blockItem.querySelector(".product__addCart").remove();
//         try {
//             blockItem.querySelector(".smail").remove();
//         } catch (error) {
            
//         }
       
//         const img = blockItem.querySelector("img");
//         if (img.classList.contains("lazy_loading")) {
//             img.src = img.dataset.src
//         }

//         const productToCart = document.createElement("div");
//         productToCart.classList.add("catalog-block__in-cart");
//         productToCart.textContent = "Добавить в корзину"
//         productToCart.addEventListener("click", () => {
//             if (productToCart.classList.contains("disabled")) return;

//             arrModifier.forEach(mod => {
//                 mod.modifiers_per_item = mod.count / input.valueAsNumber;
//             })

//             const xhr = new XMLHttpRequest();

//             xhr.open("POST", "/cart/change");
//             xhr.responseType = 'json';
//             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//             xhr.onload = function () {
//                 const footer = catalogBlockItem.querySelector('.product__addCart');
//                 footer.querySelector('.product_in_cart').classList.remove('hide');
//                 footer.querySelector('.in_not_cart').classList.add('hide');
//                 //footer.querySelector('.product_in_cart').querySelector('.text').value = xhr.response.last_change.count
//                 let count = 0;

//                 const allCount = document.querySelectorAll('.cart_count');

//                 allCount.forEach(el => {
//                     el.textContent = xhr.response.count_cart
//                 });

//                 const productId = xhr.response.last_change.product_id;
//                 let offer;
//                 for (let index in xhr.response.list) {
//                     if (xhr.response.list[index].product_id == productId) {
//                         offer = xhr.response.list[index].offer
//                         count += xhr.response.list[index].count;
//                     }

//                 }
//                 footer.querySelector('.product_in_cart').querySelector('.text').value = count
//                 const category = document.querySelector('.product__box').dataset.category;

//                 try {
//                     dataLayer.push({
//                         "ecommerce": {
//                             "currencyCode": currencyCode,
//                             "add": {
//                                 "products": [{
//                                     "id": productId,
//                                     "name": offer.name,
//                                     "price": offer.price['delivery'],
//                                     "quantity": Math.abs(xhr.response.last_change.difference),
//                                     "category": category
//                                 }]
//                             }
//                         }
//                     });
//                 } catch (error) { }


//                 catalogBlockItem.dataset.modifiers = JSON.stringify(xhr.response.last_change.modifiers)

//                 localStorage.setItem('is_update', 'make_ok');
//                 localStorage.removeItem('is_update');
//                 modalBox.remove();
//             }
//             xhr.send("count=" + encodeURIComponent(input.valueAsNumber) + "&product+id=" + encodeURIComponent(productId) + "&modifiers=" + encodeURIComponent(JSON.stringify(arrModifier)));
//         })

//         selectedModifiers.forEach(md => {
//             const blockMod = document.createElement("div");
//             blockMod.classList.add("modal-modifier-item");

//             const modPictureBox = document.createElement("div")
//             modPictureBox.classList.add("modal-images");
//             const modPicture = document.createElement("img");
//             modPicture.src = "/Resourse/media/sushi_load.svg";
//             modPictureBox.append(modPicture);

//             const loadModifImg = new Image();
//             loadModifImg.src = md.picture;

//             loadModifImg.onload = function () {
//                 modPicture.src = this.src;
//             }
//             loadModifImg.error = function () {
//                 setTimeout(() => {
//                     loadModifImg.src = md.picture;
//                 }, 1000);
//             }

//             const modItemBody = document.createElement("div");
//             modItemBody.classList.add("modal-item-body");

//             const modName = document.createElement("div");
//             modName.classList.add("modal-modifier-name");
//             modName.textContent = md.name;

//             const modPrice = document.createElement("div");
//             modPrice.classList.add("catalog-block__price");
//             modPrice.textContent = md.price + " " + currency;

//             const counterBox = document.createElement("div");
//             counterBox.classList.add("catalog-block__cout-other");

//             const min = document.createElement("span");
//             min.classList.add("minus");
//             const plus = document.createElement("span");
//             plus.classList.add("plus");


//             const inputCount = document.createElement("input");
//             inputCount.type = "number";
//             inputCount.value = 1;
//             inputCount.classList.add("text");

//             const btnInCart = document.createElement("div");
//             btnInCart.classList.add("catalog-block__in-cart");
//             btnInCart.textContent = "+";


//             min.addEventListener("click", () => {
//                 if (inputCount.value <= 1) {
//                     inputCount.value = 1;
//                     if (btnInCart.classList.contains("selected")) {
//                         btnInCart.classList.remove("selected");
//                         btnInCart.classList.remove("catalog-block__in-cart_btn");
//                         btnInCart.classList.add("catalog-block__in-cart");
//                         btnInCart.textContent = "+"
//                         arrModifier = arrModifier.filter(el => el.id != md.product_id)
//                         if (arrModifier.length === 0 && selectedModifiersGroup[0].required === "true") {
//                             productToCart.classList.add("disabled")
//                         }
//                     }
//                 } else {

//                     inputCount.value = parseInt(inputCount.value) - 1
//                     if (btnInCart.classList.contains("selected")) {
//                         let modInArr = arrModifier.filter(el => el.id == md.product_id);
//                         arrModifier[arrModifier.indexOf(modInArr[0])].count = inputCount.value
//                     }
//                 }
//             });
//             plus.addEventListener("click", () => {
//                 inputCount.value = parseInt(inputCount.value) + 1;
//                 if (btnInCart.classList.contains("selected")) {
//                     let modInArr = arrModifier.filter(el => el.id == md.product_id);
//                     arrModifier[arrModifier.indexOf(modInArr[0])].count = inputCount.value
//                 }
//             });
//             inputCount.addEventListener("change", () => {
//                 if (inputCount.valueAsNumber < 1) inputCount.value = 1;
//                 if (btnInCart.classList.contains("selected")) {
//                     let modInArr = arrModifier.filter(el => el.id == md.product_id);
//                     arrModifier[arrModifier.indexOf(modInArr[0])].count = parseInt(inputCount.value)
//                 }
//             })
//             btnInCart.addEventListener("click", () => {
//                 if (btnInCart.classList.contains("selected")) {
//                     btnInCart.classList.remove("selected");
//                     btnInCart.classList.remove("catalog-block__in-cart_btn");
//                     btnInCart.classList.add("catalog-block__in-cart");
//                     btnInCart.textContent = "+";
//                     arrModifier = arrModifier.filter(el => el.id != md.product_id)

//                     if (selectedModifiersGroup[0].type === "one_one") {
//                         modifierBox.querySelectorAll(".disabled").forEach(mod => {
//                             mod.classList.remove("disabled")
//                         })
//                     }
//                     if (arrModifier.length == 0 && selectedModifiersGroup[0].required == "true") {
//                         productToCart.classList.add("disabled")
//                     }
//                     return;
//                 };
//                 if (btnInCart.classList.contains("disabled")) return;
//                 btnInCart.classList.add("selected");
//                 btnInCart.classList.add("catalog-block__in-cart_btn");
//                 btnInCart.classList.remove("catalog-block__in-cart");
//                 btnInCart.textContent = "✓";

//                 if (selectedModifiersGroup[0].type === "one_one") {
//                     modifierBox.querySelectorAll(".modal-modifier-item").forEach(mod => {
//                         let thisMod = mod.querySelector(".catalog-block__in-cart");
//                         if (thisMod && thisMod != btnInCart) {
//                             thisMod.classList.add("disabled")
//                         }
//                     })
//                 }
//                 productToCart.classList.remove("disabled")
//                 arrModifier.push({ price: md.price, count: inputCount.value * input.valueAsNumber, id: md.product_id, modifer_for_d_id: productId, name: md.name })
//             })
//             modItemBody.append(modPrice)

//             if (selectedModifiersGroup[0].type != "one_one") {
//                 counterBox.append(min, inputCount, plus);
//                 modItemBody.append(counterBox);
//             }
//             modItemBody.append(btnInCart);
//             blockMod.append(modPictureBox, modName, modItemBody)
//             modifierBox.append(blockMod);
//         });

//         if (selectedModifiersGroup[0].required === "true") {
//             productToCart.classList.add("disabled")
//         }

//         const btnClose = document.createElement("div")
//         btnClose.classList.add("select_city_close");
//         btnClose.addEventListener("click", () => {
//             modalBox.remove();
//         })
//         modalBox.addEventListener("click", () => {
//             if (event.path[0] == modalBox) modalBox.remove();
//         })
//         productBox.append(blockItem, productToCart);
//         bodyModal.append(productBox, modifierBox, btnClose);
//         modalBox.appendChild(bodyModal)
//         document.querySelector("body").append(modalBox)
//     }




// }