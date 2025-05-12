function cartAdd(btn) {
    const catalogBlockItem = btn.closest('.product');
    const input = catalogBlockItem.querySelector('input[name="notcart"]');
    const productId = catalogBlockItem.dataset.productid;
    if (productId == "") {
        console.log("Product Id NULL");
        return;
    }
    const count = input && input.valueAsNumber ? input.valueAsNumber : 1;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/cart/change");
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        const response = xhr.response;
        const isError = response?.is_error ?? false;
        if(isError) {
            const modal = createModal();
            modal.p.textContent = response.error ?? "";
            modal.confirmDelete.remove();
            modal.cancelDelete.textContent = "Закрыть"
            modal.cancelDelete.addEventListener("click", ()=>{
                modal.modal.remove();
            })
            return;
        } 
        updateCart(response)
        const footer = catalogBlockItem.querySelector('.product__footer');
        footer.querySelector('.product_in_cart').classList.remove('hide');
        footer.querySelector('.in_not_cart').classList.add('hide');
        // footer.querySelector('.product_in_cart').querySelector('.text').value = xhr.response.last_change.count

        const allCount = document.querySelectorAll('.cart_count');

        allCount.forEach(el => {
            el.textContent = response.count_cart
        });

        const offer = response.list[productId].pop()
        const category = catalogBlockItem.dataset.category;
        if(footer.querySelector('input[name="notcart"]')) {
            footer.querySelector('input[name="incart"]').value = footer.querySelector('input[name="notcart"]').value
        } else {
            footer.querySelector('input[name="incart"]').value = count;
        }
       
        try {
            dataLayer.push({
                "ecommerce": {
                    "currencyCode": currencyCode,
                    "add": {
                        "products": [{
                            "id": productId,
                            "name": offer.product_name,
                            "price": offer.price['delivery'],
                            "quantity": 1,
                            "category": category
                        }]
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
   
    console.log(input);
    xhr.send("count=" + encodeURIComponent(count) + "&product_id=" + encodeURIComponent(productId)+"&count_varian=add");
}


function lessGoods(btn, type) {

    const catalogBlockItem = btn.closest('.product');

    const productId = catalogBlockItem.dataset.productid;

    if (type == 'incart') {
        const input = catalogBlockItem.querySelector('input[name="incart"]');
        let CountProduct = input.valueAsNumber;
        CountProduct--;
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/cart/change");
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            const response = xhr.response;
            const isError = response?.is_error ?? false;
            if(isError) {
                // Сначало написать уведомления а потом уже вывести туда ошибку
                const modal = createModal();
                modal.p.textContent = response.error ?? "";
                modal.confirmDelete.remove();
                modal.cancelDelete.textContent = "Закрыть"
                modal.cancelDelete.addEventListener("click", ()=>{
                    modal.modal.remove();
                })
                return;
            } 
            updateCart(response)
            input.value = CountProduct;
            if (!xhr.response.list[productId]) {

                const footer = catalogBlockItem.querySelector('.product__footer');
                footer.querySelector('.product_in_cart').classList.add('hide');
                footer.querySelector('.in_not_cart').classList.remove('hide');
                input.value = 1;
                const allCount = document.querySelectorAll('.cart_count');

                footer.querySelector('.in_not_cart').querySelector('.text').value = 1;
                footer.querySelector('.product_in_cart').querySelector('.text').value = 1;

                allCount.forEach(el => {
                    el.textContent = xhr.response.count_cart;
                });

                // const offer = xhr.response.list[productId].pop()
                // const category = catalogBlockItem.dataset.category;

                try {
                    dataLayer.push({
                        "ecommerce": {
                            "currencyCode": currencyCode,
                            "remove": {
                                "products": [{
                                    "id": productId,
                                    "name": offer.product_name,
                                    "price": offer.price['delivery'],
                                    "quantity": -1,
                                    "category": category
                                }]
                            }
                        }
                    });
                } catch (error) {

                }

            }

        }
        xhr.send("count=1&product_id=" + encodeURIComponent(productId) + "&type=decrease");
    } else {
        const input = catalogBlockItem.querySelector('input[name="notcart"]');
        let CountProduct = input.valueAsNumber;
        CountProduct--;
        if (CountProduct <= 1) CountProduct = 1;
        input.value = CountProduct;
    }

}

function countProduct(input, type) {
    const catalogBlockItem = input.closest('.product');
    const productId = catalogBlockItem.dataset.product_id;

    if (input.valueAsNumber < 1) input.value = 1;
    let CountProduct = input.valueAsNumber;

    if (type == 'incart') {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/cart/change");
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            const response = xhr.response;
            const isError = response?.is_error ?? false;
            if(isError) {
                // Сначало написать уведомления а потом уже вывести туда ошибку
                const modal = createModal();
                modal.p.textContent = response.error ?? "";
                modal.confirmDelete.remove();
                modal.cancelDelete.textContent = "Закрыть"
                modal.cancelDelete.addEventListener("click", ()=>{
                    modal.modal.remove();
                })
                return;
            } 
            updateCart(response)
         }
       
        xhr.send("count=" + encodeURIComponent(CountProduct) + "&product+id=" + encodeURIComponent(productId));
    } else if (input.valueAsNumber == 0) {
        input.valueAsNumber = 1;
    }
}

function moreProduct(btn, type) {
    const catalogBlockItem = btn.closest('.product');

    const productId = catalogBlockItem.dataset.productid;

    if (btn.classList.contains("modifiers")) {
        // тут нужна проверка на наличие модификаторов  
        // const modifierGroupPruduct = JSON.parse(btn.dataset.modif);

        // console.log(modifierGroupPruduct)
        catalogBlockItem.querySelector(".catalog-block__in-cart").click();
        return;
    }

    if (type == 'incart') {
        const input = catalogBlockItem.querySelector('input[name="incart"]');
        let CountProduct = input.valueAsNumber;
        CountProduct++;
        input.value = CountProduct;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/cart/change");
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            const response = xhr.response;
            const isError = response?.is_error ?? false;
            if(isError) {
                // Сначало написать уведомления а потом уже вывести туда ошибку
                const modal = createModal();
                modal.p.textContent = response.error ?? "";
                modal.confirmDelete.remove();
                modal.cancelDelete.textContent = "Закрыть"
                modal.cancelDelete.addEventListener("click", ()=>{
                    modal.modal.remove();
                })
                return;
            } 
            updateCart(response)
        }
        xhr.send("count=1&product_id=" + encodeURIComponent(productId));
    } else {
        const input = catalogBlockItem.querySelector('input[name="notcart"]');
        let CountProduct = input.valueAsNumber;
        CountProduct++;
        input.value = CountProduct;
    }
}
let test;

function cartAddModifier(btn) {

    let arrModifier = [];

    const catalogBlockItem = btn.closest('.product');
    const input = catalogBlockItem.querySelector('input[name="notcart"]');
    const productId = catalogBlockItem.dataset.productid;
    const modifierGroupPruduct = JSON.parse(btn.dataset.modif);
    if (input.closest(".in_not_cart").classList.contains("hide")) {
        input.value = 1;
    }

    if (!productId) {
        console.log("Product Id NULL");
        return;
    }

    const selectedModifiersGroup = [];
    modifierGroupPruduct.forEach(el => {
        selectedModifiersGroup.push(modifiersGroup[el]);
    });

    if (selectedModifiersGroup.length > 0) {
        const modalBox = document.createElement("div");
        modalBox.classList.add("modal-box")

        const bodyModal = document.createElement("div");
        bodyModal.classList.add("modal-modifier");
        const modifiersKey = Object.keys(modifiers);
        const selectedModifiers = [];
        const productBox = document.createElement("div");
        productBox.classList.add("modal-product-box");

        const modifierBox = document.createElement("div");
        modifierBox.classList.add("modal-modifier-box");


        /* Написать генерацию карточки товара */
        const blockItem = document.createElement('div');
        blockItem.classList.add('modifiers_product_box')
        const productImgBox = document.createElement("div");
        productImgBox.classList.add("modifires_img_product")
        const productImg = document.createElement('img');
        productImg.src = catalogBlockItem.querySelector("img").dataset.src
        productImgBox.append(productImg)

        const productName = document.createElement("div");
        productName.classList.add('product_name');
        productName.textContent = catalogBlockItem.querySelector(".name").textContent;


        const description = document.createElement('div');
        description.classList.add("description");
        description.textContent = catalogBlockItem.querySelector(".description").textContent;


        blockItem.append(productImgBox, productName, description)

        const img = document.createElement("img")

        const productToCart = document.createElement("div");
        productToCart.classList.add("catalog-block__in-cart");
        productToCart.textContent = "Добавить в корзину"
        productToCart.addEventListener("click", () => {
            if (productToCart.classList.contains("disabled")) return;

            arrModifier.forEach(mod => {
                mod.modifiers_per_item = mod.count / input.valueAsNumber;
            })

            const xhr = new XMLHttpRequest();

            xhr.open("POST", "/cart/change");
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                const response = xhr.response;
                const isError = response?.is_error ?? false;
                if(isError) {
                    // Сначало написать уведомления а потом уже вывести туда ошибку
                    const modal = createModal();
                    modal.p.textContent = response.error ?? "";
                    modal.confirmDelete.remove();
                    modal.cancelDelete.textContent = "Закрыть"
                    modal.cancelDelete.addEventListener("click", ()=>{
                        modal.modal.remove();
                    })
                    return;
                }
                const footer = catalogBlockItem.querySelector('.product__footer');
                footer.querySelector('.product_in_cart').classList.remove('hide');
                footer.querySelector('.in_not_cart').classList.add('hide');
                footer.querySelector('.product_in_cart').querySelector('.text').value = footer.querySelector('.in_not_cart').querySelector('.text').value
                let count = 0;

                const allCount = document.querySelectorAll('.cart_count');

                allCount.forEach(el => {
                    el.textContent = xhr.response.count_cart
                });

                //const productId = xhr.response.last_change.product_id;
                // let offer;
                // for (let index in xhr.response.list) {
                //     if (xhr.response.list[index].product_id == productId) {
                //         offer = xhr.response.list[index].offer
                //         count += xhr.response.list[index].count;
                //     }

                // }
                //footer.querySelector('.product_in_cart').querySelector('.text').value = count
                //const category = document.querySelector('.product__box').dataset.category;

                try {
                    dataLayer.push({
                        "ecommerce": {
                            "currencyCode": currencyCode,
                            "add": {
                                "products": [{
                                    "id": productId,
                                    "name": offer.name,
                                    "price": offer.price['delivery'],
                                    "quantity": Math.abs(xhr.response.last_change.difference),
                                    "category": category
                                }]
                            }
                        }
                    });
                } catch (error) { }


              //  catalogBlockItem.dataset.modifiers = JSON.stringify(xhr.response.last_change.modifiers)

                localStorage.setItem('is_update', 'make_ok');
                localStorage.removeItem('is_update');
                modalBox.remove();
            }
            xhr.send("count=" + encodeURIComponent(input.valueAsNumber) + "&product+id=" + encodeURIComponent(productId) + "&modifiers=" + encodeURIComponent(JSON.stringify(arrModifier))+"&count_varian=add");
        })


        selectedModifiersGroup.map(group => {
            if(Number(group.is_hidden) == 0)  {
                const category = document.createElement('div');
                const categoryTitle = document.createElement('div');
                categoryTitle.className = 'title_modif';
                categoryTitle.textContent = group.name;
                const categoryBody = document.createElement('div');
                categoryBody.className = 'body_categoty_modif'
                const selectedModifiers = Object.values(modifiers).filter(mod => {
                    const modJson = JSON.parse(mod);
                    if(modJson.modifiersGroupId == group.id) return modJson;
                })

                selectedModifiers.forEach(mdStr => {
                    const md = JSON.parse(mdStr);
                    const blockMod = document.createElement("div");
                    blockMod.classList.add("modal-modifier-item");

                    const modPictureBox = document.createElement("div")
                    modPictureBox.classList.add("modal-images");
                    const modPicture = document.createElement("img");
                    modPicture.src = "/Resourse/media/sushi_load.svg";
                    modPictureBox.append(modPicture);

                    const loadModifImg = new Image();
                    loadModifImg.src = md.picture;

                    loadModifImg.onload = function () {
                        modPicture.src = this.src;
                    }
                    loadModifImg.error = function () {
                        setTimeout(() => {
                            loadModifImg.src = md.picture;
                        }, 1000);
                    }

                    const modItemBody = document.createElement("div");
                    modItemBody.classList.add("modal-item-body");

                    const modName = document.createElement("div");
                    modName.classList.add("modal-modifier-name");
                    modName.textContent = md.name;

                    const modPrice = document.createElement("div");
                    modPrice.classList.add("catalog-block__price");
                    modPrice.textContent = md.price + " " + currency;

                    const counterBox = document.createElement("div");
                    counterBox.classList.add("catalog-block__cout-other");

                    const min = document.createElement("span");
                    min.classList.add("minus");
                    const plus = document.createElement("span");
                    plus.classList.add("plus");


                    const inputCount = document.createElement("input");
                    inputCount.type = "number";
                    inputCount.value = 1;
                    inputCount.classList.add("text");

                    const btnInCart = document.createElement("div");
                    btnInCart.classList.add("catalog-block__in-cart");
                    btnInCart.textContent = "+";


                    min.addEventListener("click", () => {
                        if (inputCount.value <= 1) {
                            inputCount.value = 1;
                            if (btnInCart.classList.contains("selected")) {
                                btnInCart.classList.remove("selected");
                                btnInCart.classList.remove("catalog-block__in-cart_btn");
                                btnInCart.classList.add("catalog-block__in-cart");
                                btnInCart.textContent = "+"
                                arrModifier = arrModifier.filter(el => el.id != md.product_id)
                            }
                        } else {

                            inputCount.value = parseInt(inputCount.value) - 1
                            if (btnInCart.classList.contains("selected")) {
                                let modInArr = arrModifier.filter(el => el.id == md.product_id);
                                arrModifier[arrModifier.indexOf(modInArr[0])].count = inputCount.value
                            }
                        }
                        verefyModifier()
                    });
                    plus.addEventListener("click", () => {
                        inputCount.value = parseInt(inputCount.value) + 1;
                        if (btnInCart.classList.contains("selected")) {
                            let modInArr = arrModifier.filter(el => el.id == md.product_id);
                            arrModifier[arrModifier.indexOf(modInArr[0])].count = inputCount.value
                        }
                        verefyModifier()
                    });
                    inputCount.addEventListener("change", () => {
                        if (inputCount.valueAsNumber < 1) inputCount.value = 1;
                        if (btnInCart.classList.contains("selected")) {
                            let modInArr = arrModifier.filter(el => el.id == md.product_id);
                            arrModifier[arrModifier.indexOf(modInArr[0])].count = parseInt(inputCount.value)
                        }
                        verefyModifier()
                    })
                    btnInCart.addEventListener("click", () => {
                        if (btnInCart.classList.contains("selected")) {
                            btnInCart.classList.remove("selected");
                            btnInCart.classList.remove("catalog-block__in-cart_btn");
                            btnInCart.classList.add("catalog-block__in-cart");
                            btnInCart.textContent = "+";
                            arrModifier = arrModifier.filter(el => el.id != md.product_id)

                            if (group.type === "one_one") {
                                categoryBody.querySelectorAll(".disabled").forEach(mod => {
                                    mod.classList.remove("disabled")
                                })
                            }
                            verefyModifier()
                            return;
                        };
                        if (btnInCart.classList.contains("disabled")) return;
                        btnInCart.classList.add("selected");
                        btnInCart.classList.add("catalog-block__in-cart_btn");
                        btnInCart.classList.remove("catalog-block__in-cart");
                        btnInCart.textContent = "✓";

                        if (group.type === "one_one") {
                            categoryBody.querySelectorAll(".modal-modifier-item").forEach(mod => {
                                let thisMod = mod.querySelector(".catalog-block__in-cart");
                                if (thisMod && thisMod != btnInCart) {
                                    thisMod.classList.add("disabled")
                                }
                            })
                        }
                        productToCart.classList.remove("disabled")
                        arrModifier.push({ count: inputCount.value * input.valueAsNumber, id: md.product_id, modifiersGroupId: md.modifiersGroupId})
                        verefyModifier()
                    })
                    modItemBody.append(modPrice)

                    if (group.type != "one_one") {
                        counterBox.append(min, inputCount, plus);
                        modItemBody.append(counterBox);
                    }
                    modItemBody.append(btnInCart);
                    blockMod.append(modPictureBox, modName, modItemBody);
                    categoryBody.appendChild(blockMod)

                });
                category.append(categoryTitle, categoryBody)
                modifierBox.append(category);
            }

        })

        console.log(modifierBox);
        if(modifierBox.innerHTML == '') {
            cartAdd(btn);
            return;
        }

        // верефикация модификаторов


        function verefyModifier() {
            const categoryRequired = selectedModifiersGroup.filter(group => group.required == "true")
            console.log(arrModifier);
            if(categoryRequired.length > 0) {
                //Есть ли товары с обязательной категории
                categoryRequired.map(category => {
                    const productRequired = arrModifier.filter(mod => mod.modifiersGroupId == category.id);
                    if(productRequired.length > 0) {
                        productToCart.classList.remove("disabled")
                    } else {
                        productToCart.classList.add("disabled")
                    }
                })
                //
            }
        }

        const btnClose = document.createElement("div")
        btnClose.classList.add("select_city_close");
        btnClose.addEventListener("click", () => {
            modalBox.remove();
        })
        modalBox.addEventListener("click", () => {
            if (event?.path[0] == modalBox) modalBox.remove();
        })
        productBox.append(blockItem, productToCart);
        bodyModal.append(productBox, modifierBox, btnClose);
        modalBox.appendChild(bodyModal)
        document.querySelector("body").append(modalBox)
        verefyModifier()
    }
}


