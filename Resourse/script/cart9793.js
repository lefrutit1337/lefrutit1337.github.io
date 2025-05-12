let type = 'delivery';

getModifiers();
document.addEventListener("DOMContentLoaded", () => {
    coupone();
    // DragAndDrop();
    cartLazy();
    document.querySelector(".city_btn").addEventListener("click", () => {
        event.preventDefault();

        if (document.querySelector(".maxwidth").clientWidth > 1000) {
            document.querySelector(".site-header__city-block").click();
        } else {
            document.querySelector(".mobile-header__burger").click();
            document.querySelector(".selected_city_modile").classList.remove("hide");
        }

    });
    const allHide = document.querySelectorAll(".is_not_available_box.hide");
    const allProd = document.querySelectorAll(".cart__order-item");
    if (allHide.length != allProd.length) {
        document.querySelector('.cart__inner_btn').classList.add("disabled");
        if (document.querySelector(".error_text")) {
            document.querySelector(".error_text").textContent = 'В корзине недоступный товар';
        }
    } else {
        document.querySelector('.cart__inner_btn').classList.remove("disabled");
        if (document.querySelector(".error_text")) {
            document.querySelector(".error_text").textContent = '';
        }
    }

    // document.querySelector(".cart__inner_total").querySelector("span").addEventListener("update", () => {
    //     const minPrice = Number(document.querySelector(".min_price").dataset.price);
    //     const Price = Number(document.querySelector(".cart__inner_total").querySelector("span").textContent);
    //     const isNotPickup = Number(document.querySelector(".min_price").dataset.isNotPickup);
    //     if (isNotPickup) {
    //         console.warn("Самовывоз недоступен");
    //     }

    //     if (Price < minPrice) {
    //         document.querySelector(".min_price").classList.remove("hide");
    //         document.querySelector(".min_price").querySelector("span").textContent = minPrice - Price;
    //         if (!isNotPickup) {
    //             document.querySelector(".cart__inner_btn").textContent = "Оформить самовывоз";
    //             document.querySelector('#delivery1').click();
    //         }
    //         document.querySelector('label[for=delivery0]').classList.add('disabled')
    //         document.querySelector('#delivery0').disabled = true;

    //         if (isNotPickup) {
    //             document.querySelector(".cart__inner_btn").classList.add("disabled")
    //         } else {
    //             document.querySelector(".cart__inner_btn").classList.remove("disabled")
    //         }

    //     } else {
    //         document.querySelector(".min_price").classList.add("hide");
    //         document.querySelector(".min_price").querySelector("span").textContent = "";
    //         document.querySelector(".cart__inner_btn").textContent = "Оформить заказ";
    //         document.querySelector('label[for=delivery0]').classList.remove('disabled')
    //         document.querySelector('#delivery0').disabled = false;
    //         document.querySelector(".cart__inner_btn").classList.remove("disabled")
    //     }
    // });


    // document.querySelector(".cart__inner_total").querySelector("span").dispatchEvent(new Event("update"));
    // document.querySelector('.select_delivery_type').querySelectorAll('input').forEach(el => {
    //     el.addEventListener('change', () => {
    //         if (document.querySelector('input[name="delivery_type"]:checked').value == 0) {
    //             sendSelectDeliveryType('delivery');
    //             type = 'delivery';
    //         } else {
    //             sendSelectDeliveryType('pickup');
    //             type = 'pickup';
    //         }

    //         sendInfo({ url: "/order/updateCartInfo", date: `delivery_method=${type}` });
    //     })
    // })

});

function cartLazy() {
    document.querySelectorAll('.cart__order-img').forEach(el => {
        const img = el.querySelector('img');

        const ImageLoad = new Image();
        ImageLoad.src = img.dataset.src;
        ImageLoad.onload = function () {
            img.src = this.src;
        };
        ImageLoad.error = function () {
            setTimeout(() => {
                ImageLoad.src = img.dataset.src;
            }, 1000);
        };

    });

    document.querySelectorAll('.cart_spices-item-img').forEach(el => {
        const img = el.querySelector('img');

        const ImageLoad = new Image();
        ImageLoad.src = img.dataset.src;
        ImageLoad.onload = function () {
            img.src = this.src;
        };
        ImageLoad.error = function () {
            setTimeout(() => {
                ImageLoad.src = img.dataset.src;
            }, 1000);
        };

    });
}

async function sendSelectDeliveryType(type) {

    const result = await sendChange({ url: "/cart/get", date: `delivery type=${type}` });
    const list = result.list;
    for (const id in list) {
        if (Object.hasOwnProperty.call(list, id)) {
            const product = list[id];
            product.forEach(pr => {
                const item = document.querySelector(`.cart__order-box[data-index="${pr.t_id}"]`);
                item.querySelector('.cart__order-total').querySelector('span').textContent = (Number(pr.count) * Number(pr.price[type])).toFixed(2);
                item.querySelector('.cart__order-price-one').querySelector('.cart__order-price').querySelector('span').textContent = Number(pr.price[type]).toFixed(2);
            });
            updateCart(result);
        }
    }
    document.querySelector('.cart__inner_total').querySelector('span').textContent = result.total_cart[type];
    document.querySelector('.cart__inner_btn').href = `/order/${type}`;
}


async function cartAdd(elem) {
    const productCount = 1;
    const productId = elem.closest('.cart__spices-item').dataset.productid;

    const result = await sendChange({ url: "/cart/change", date: `product_id=${productId}&count=${productCount}` });

    if (result.is_error) {
        const modal = createModal();
        modal.p.textContent = result.error;
        modal.confirmDelete.remove();
        modal.cancelDelete.textContent = "Закрыть";
        modal.cancelDelete.addEventListener("click", () => {
            modal.modal.remove();
        });
    }
    updateCart(result);
    localStorage.setItem('is_update', 'make_ok');
    localStorage.removeItem('is_update');
}

async function cartSmall(elem) {
    let productCount, productId, index;
    let isSpices = false;
    try {
        productCount = elem.closest('.card__order-coundPrice').querySelector('.cartCount');
        productId = elem.closest('.cart__order-box').dataset.productid;
        index = elem.closest('.cart__order-box').dataset.index;
    } catch (error) {
        console.warn(error);
        productCount = elem.closest('.cart__spices-item-footer').querySelector('.cartCount');
        productId = elem.closest('.cart__spices-item').dataset.productid;
        isSpices = true;
    }
    const result = await sendChange({
        url: "/cart/change",
        date: `product_id=${encodeURIComponent(productId)}&t_id=${encodeURIComponent(index)}&count=${encodeURIComponent(productCount.value)}&type=decrease`
    });
    if (result.is_error) {
        const modal = createModal();
        modal.p.textContent = result.error;
        modal.confirmDelete.remove();
        modal.cancelDelete.textContent = "Закрыть";
        modal.cancelDelete.addEventListener("click", () => {
            modal.modal.remove();
        });
    }

    if (!isSpices) {
        document.querySelector(".cart__inner_total").querySelector("span").textContent = result.total_cart[type];
        const product = result.list[productId]?.find(el => el.t_id == index);
        if (product) {
            productCount.value = product.count;
            priceAnim(elem, product.count * product.price[type]);
        }

    }
    !result.is_error && updateCart(result);
    localStorage.setItem('is_update', 'make_ok');
    localStorage.removeItem('is_update');
}

async function cartMore(elem) {

    let productCount, productId, index, modifiers;
    let isSpices = false;
    try {
        productCount = elem.closest('.card__order-coundPrice').querySelector('.cartCount');
        productId = elem.closest('.cart__order-box').dataset.productid;
        index = elem.closest('.cart__order-box').dataset.index;
        modifiers = elem.closest('.cart__order-box').dataset.modifiers;
    } catch (error) {
        console.warn(error);
        productCount = elem.closest('.cart__spices-item-footer').querySelector('.cartCount');
        productId = elem.closest('.cart__spices-item').dataset.productid;
        isSpices = true;
    }

    const result = await sendChange({
        url: "/cart/change",
        date: `product_id=${encodeURIComponent(productId)}&t_id=${encodeURIComponent(index)}&count=${encodeURIComponent(productCount.value)}`
    });
    !result.is_error && updateCart(result);
    if (result.is_error) {
        const modal = createModal();
        modal.p.textContent = result.error;
        modal.confirmDelete.remove();
        modal.cancelDelete.textContent = "Закрыть";
        modal.cancelDelete.addEventListener("click", () => {
            modal.modal.remove();
        });
    }
    if (!isSpices) {
        document.querySelector(".cart__inner_total").querySelector("span").textContent = result.total_cart[type];
        const product = result.list[productId].find(el => el.t_id == index);
        productCount.value = product.count;
        priceAnim(elem, product.count * product.price[type]);
    }

}

function cartInput(elem) {
    elem.value = Math.abs(elem.value);

    let productCount, productId;
    let isSpices = false;
    try {
        productCount = elem.closest('.card__order-coundPrice').querySelector('.cartCount').value;
        productId = elem.closest('.cart__order-box').dataset.productid;

    } catch (error) {
        productCount = elem.closest('.cart__spices-item-footer').querySelector('.cartCount').value;
        productId = elem.closest('.cart__spices-item').dataset.productid;
        isSpices = true;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./cart/change");
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        const response = xhr.response;
        const isError = response?.is_error ?? false;
        if (isError) {
            // Сначало написать уведомления а потом уже вывести туда ошибку
            const modal = createModal();
            modal.p = response.error ?? "";
            modal.confirmDelete.remove();
            modal.cancelDelete.textContent = "Закрыть";
            return;
        }
        if (!isSpices) {
            priceAnim(elem, xhr.response);
            document.querySelector(".cart__inner_total").querySelector("span").textContent = xhr.response.total_cart[type];
            // elem.closest('.card__order-coundPrice').querySelector('.cartCount').value = xhr.response.last_change.count;
            if (xhr.response.last_change.count <= 0) {
                elem.closest('.cart__order-box').remove();
            }
            if (xhr.response.total_cart[type] < xhr.response.total_full_cart) {
                document.querySelector(".cart__inner-box").querySelector(".cart__order-full_price").classList.remove('hide');
                document.querySelector(".cart__inner-box").querySelector(".cart__order-full_price").querySelector("span").textContent = xhr.response.total_full_cart;
            } else {
                document.querySelector(".cart__inner-box").querySelector(".cart__order-full_price").classList.add('hide');
            }
            document.querySelector(".cart__inner_total").querySelector("span").dispatchEvent(new Event("update"));
        } else {
            elem.closest('.cart__order-caunt-form').querySelector('.cartCount').value = xhr.response.last_change.count;
        }

        updateCart();
        localStorage.setItem('is_update', 'make_ok');
        localStorage.removeItem('is_update');

    };
    xhr.send("count=" + encodeURIComponent(Number(elem.value)) + "&product+id=" + encodeURIComponent(productId));


}

async function cartRemove(elem) {

    const productId = elem.closest(".cart__order-box").dataset.productid;
    const index = elem.closest(".cart__order-box").dataset.index;
    const productCount = 0;

    const result = await sendChange({
        url: "/cart/change",
        date: `product_id=${encodeURIComponent(productId)}&t_id=${encodeURIComponent(index)}&count=${encodeURIComponent(productCount)}&type=remove`
    });
    if (result.is_error) {
        const modal = createModal();
        modal.p.textContent = result.error;
        modal.confirmDelete.remove();
        modal.cancelDelete.textContent = "Закрыть";
        modal.cancelDelete.addEventListener("click", () => {
            modal.modal.remove();
        });
    }

    !result.is_error && updateCart(result);
    localStorage.setItem('is_update', 'make_ok');
    localStorage.removeItem('is_update');


    const allHide = document.querySelectorAll(".is_not_available_box.hide");
    const allProd = document.querySelectorAll(".cart__order-item");
    if (allHide.length != allProd.length) {
        document.querySelector('.cart__inner_btn').classList.add("disabled");
        if (document.querySelector(".error_text")) {
            document.querySelector(".error_text").textContent = 'В корзине недоступный товар';
        }
    } else {
        document.querySelector('.cart__inner_btn').classList.remove("disabled");
        if (document.querySelector(".error_text")) {
            document.querySelector(".error_text").textContent = '';
        }
    }

    // const xhr = new XMLHttpRequest();
    // xhr.open("POST", "./cart/change");
    // xhr.responseType = 'json';
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.onload = function () {
    //     console.log(xhr.response);

    //     if (xhr.status == 200) {
    //         try {
    //             dataLayer.push({
    //                 "ecommerce": {
    //                     "currencyCode": currencyCode,
    //                     "remove": {
    //                         "products": [{
    //                             "id": productId,
    //                             "name": elem.closest(".cart__order-box").querySelector('.cart__order-title').querySelector('h2').textContent,
    //                             "category": elem.closest(".cart__order-box").dataset.category,
    //                             "quantity": Math.abs(xhr.response.last_change.difference)
    //                         }]
    //                     }
    //                 }
    //             });
    //         } catch (error) {

    //         }


    //         updateCart()
    //         localStorage.setItem('is_update', 'make_ok');
    //         localStorage.removeItem('is_update');
    //     }
    // }
    // xhr.send("count=2&product_id=" + encodeURIComponent(productId) + "&t_id=" + encodeURIComponent(index) + "&type=remove");

}

function priceAnim(elem, OrderPriceNew) {

    const orderPrice = elem.closest('.cart__order-box').querySelector('.cart__order-total').querySelector('.total').querySelector('span');
    let price = Number(orderPrice.textContent);
    const distinction = OrderPriceNew - Number(orderPrice.textContent);
    if (Number(orderPrice.textContent) < OrderPriceNew) {

        let step = 1;
        let max = 2;
        if (distinction > 0 && distinction < 10) {
            step = 1;
            max = 2;
        } else if (distinction > 10 && distinction < 100) {
            step = 4;
            max = 6;
        } else if (distinction > 100 && distinction < 1000) {
            step = 19;
            max = 21;
        } else if (distinction > 1000 && distinction < 10000) {
            step = 111;
            max = 121;
        } else {
            step = 1111;
            max = 1211;
        }
        const timer = setInterval(() => {
            price = price + step;
            orderPrice.textContent = price;
            if ((price + max) >= OrderPriceNew) {
                clearInterval(timer);
                orderPrice.textContent = OrderPriceNew;
            }

        }, 2);

    } else if (Number(orderPrice.textContent) > OrderPriceNew) {
        const distinction = Number(orderPrice.textContent) - OrderPriceNew;
        let step = 1;
        let max = 2;
        if (distinction > 0 && distinction < 10) {
            step = 1;
            max = 2;
        } else if (distinction > 10 && distinction < 100) {
            step = 4;
            max = 6;
        } else if (distinction > 100 && distinction < 1000) {
            step = 19;
            max = 21;
        } else if (distinction > 1000 && distinction < 10000) {
            step = 111;
            max = 121;
        } else {
            step = 1111;
            max = 1211;
        }
        const timer = setInterval(() => {
            price = price - step;
            orderPrice.textContent = price;
            if ((price - max) <= OrderPriceNew) {
                clearInterval(timer);
                orderPrice.textContent = OrderPriceNew;
            }

        }, 2);
    }
}

function coupone() {
    var Even;
    try {
        Even = new (EventTarget);
    } catch (error) {
        Even = document.createDocumentFragment();
    }

    Even["coupone"] = document.querySelector(".cart__coupon-btn");
    Even["coupone"].addEventListener("click", () => {
        const couponValue = document.querySelector(".cart__coupon-input").querySelector("input").value;
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/cart/coupon");
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            if (xhr.status == 200) {
                const response = xhr.response;
                const isError = response?.is_error ?? false;
                if (isError) {
                    // Сначало написать уведомления а потом уже вывести туда ошибку
                    const modal = createModal();
                    modal.p = response.error ?? "";
                    modal.confirmDelete.remove();
                    modal.cancelDelete.textContent = "Закрыть";
                    return;
                }
                if (response.is_error) {
                    document.querySelector(".cart__coupon-warning").classList.remove("hide");
                    document.querySelector(".cart__coupon-warning").textContent = response.message;
                }
            }

        };
        xhr.send("coupon=" + encodeURIComponent(couponValue));
    });
}

var coursorePos;
var scrollBody;

function DragAndDrop() {
    const body = document.querySelector(".cart__spices-item-box");
    if (body == null) return;

    body.addEventListener("mousedown", () => {
        body.style.cursor = "grabbing";
        scrollBody = body.scrollLeft;
        coursorePos = event.clientX;
        body.addEventListener("mousemove", DragAndDropMous, true);

    });
    body.addEventListener("mouseup", () => {
        body.style.cursor = "grab";
        body.removeEventListener("mousemove", DragAndDropMous, true);

    });


}

var DragAndDropMous = function (event) {

    const body = document.querySelector(".cart__spices-item-box");
    let result = coursorePos - event.clientX;
    body.scrollLeft = scrollBody + result;
};


function editModifiers(btn) {

    let arrModifier = new Array();
    const catalogBlockItem = btn.closest('.cart__order-box');
    const countProduct = catalogBlockItem.querySelector(".cartCount").valueAsNumber;
    const productId = catalogBlockItem.dataset.productid;
    const modifierGroupPruduct = JSON.parse(btn.dataset.modif);
    const index = catalogBlockItem.dataset.index;

    const arrSelectedMod = [];
    catalogBlockItem.querySelector(".modifiers-box").querySelectorAll("li").forEach(el => arrSelectedMod.push(el.dataset.modificatorId));
    if (productId == "") {
        console.warn("Product Id NULL");
        return;
    }
    console.log(arrSelectedMod);
    const selectedModifiersGroup = [];
    modifierGroupPruduct.forEach(el => {
        selectedModifiersGroup.push(modifiersGroup[el]);
    });




    if (selectedModifiersGroup.length > 0) {
        const modalBox = document.createElement("div");
        modalBox.classList.add("modal-box");

        const bodyModal = document.createElement("div");
        bodyModal.classList.add("modal-modifier");
        const modifiersKey = Object.keys(modifiers);
        const selectedModifiers = [];

        const productBox = document.createElement("div");
        productBox.classList.add("modal-product-box");

        const modifierBox = document.createElement("div");
        modifierBox.classList.add("modal-modifier-box");

        const blockItem = document.createElement("div");
        blockItem.classList.add("modal_product");
        const productImg = document.createElement("img");
        productImg.src = catalogBlockItem.querySelector(".cart__order-img").querySelector("img").src;
        productImg.classList.add(".cart__order-img");
        const title = document.createElement("div");
        title.textContent = catalogBlockItem.querySelector(".cart__order-title").querySelector("h2").textContent;

        blockItem.append(productImg, title);

        const productToCart = document.createElement("div");
        productToCart.classList.add("catalog-block__in-cart");
        productToCart.textContent = "Сохранить";
        productToCart.addEventListener("click", () => {
            if (productToCart.classList.contains("disabled")) return;

            const xhr = new XMLHttpRequest();

            xhr.open("POST", "/cart/change");
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                const response = xhr.response;
                const isError = response?.is_error ?? false;
                if (isError) {
                    const modal = createModal();
                    modal.p = response.error ?? "";
                    modal.confirmDelete.remove();
                    modal.cancelDelete.textContent = "Закрыть";
                    return;
                }
                updateCart(response);
                localStorage.setItem('is_update', 'make_ok');
                localStorage.removeItem('is_update');
                modalBox.remove();
            };
            const index = catalogBlockItem.dataset.index;
            xhr.send("count=" + encodeURIComponent(countProduct) + "&count_varian=change" + "&type=change_modifier&product_id=" + encodeURIComponent(productId) + "&t_id=" + encodeURIComponent(index) + "&modifiers=" + encodeURIComponent(JSON.stringify(arrModifier)));
        });

        selectedModifiersGroup.map(group => {
            if (Number(group.is_hidden) == 0) {

                const category = document.createElement('div');
                const categoryTitle = document.createElement('div');
                categoryTitle.className = 'title_modif';
                categoryTitle.textContent = group.name;
                const categoryBody = document.createElement('div');
                categoryBody.className = 'body_categoty_modif';
                const selectedModifiers = Object.values(modifiers).filter(mod => {
                    const modJson = JSON.parse(mod);
                    if (modJson.modifiersGroupId == group.id) return modJson;
                });
                selectedModifiers.forEach(mdStr => {
                    const md = JSON.parse(mdStr);
                    const blockMod = document.createElement("div");
                    blockMod.classList.add("modal-modifier-item");

                    const modPictureBox = document.createElement("div");
                    modPictureBox.classList.add("modal-images");
                    const modPicture = document.createElement("img");
                    modPicture.src = "/Resourse/media/sushi_load.svg";
                    modPictureBox.append(modPicture);

                    const loadModifImg = new Image();
                    loadModifImg.src = md.picture;

                    loadModifImg.onload = function () {
                        modPicture.src = this.src;
                    };
                    loadModifImg.error = function () {
                        setTimeout(() => {
                            loadModifImg.src = md.picture;
                        }, 1000);
                    };

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

                    if (arrSelectedMod.includes(md.product_id)) {
                        inputCount.value = catalogBlockItem.querySelector(`li[data-modificator-id="${md.product_id}"]`).dataset.count;

                        btnInCart.classList.add("selected");
                        btnInCart.classList.add("catalog-block__in-cart_btn");
                        btnInCart.classList.remove("catalog-block__in-cart");
                        btnInCart.textContent = "✓";

                        if (group.type === "one_one") {
                            modifierBox.querySelectorAll(".modal-modifier-item").forEach(mod => {
                                let thisMod = mod.querySelector(".catalog-block__in-cart");
                                if (thisMod && thisMod != btnInCart) {
                                    thisMod.classList.add("disabled");
                                }
                            });
                        }
                        productToCart.classList.remove("disabled");
                        arrModifier.push({ count: inputCount.value * countProduct, id: md.product_id, modifiersGroupId: md.modifiersGroupId });

                    } else {
                        if (group.type === "one_one" && arrSelectedMod.length > 0) {
                            btnInCart.classList.add("disabled");
                        }
                    }

                    min.addEventListener("click", () => {
                        if (inputCount.value <= 1) {
                            inputCount.value = 1;
                            if (btnInCart.classList.contains("selected")) {
                                btnInCart.classList.remove("selected");
                                btnInCart.classList.remove("catalog-block__in-cart_btn");
                                btnInCart.classList.add("catalog-block__in-cart");
                                btnInCart.textContent = "+";
                                arrModifier = arrModifier.filter(el => el.id != md.product_id);
                                if (arrModifier.length === 0 && group.required === "true") {
                                    productToCart.classList.add("disabled");
                                }
                            }
                        } else {

                            inputCount.value = parseInt(inputCount.value) - 1;
                            if (btnInCart.classList.contains("selected")) {
                                let modInArr = arrModifier.filter(el => el.id == md.product_id);
                                arrModifier[arrModifier.indexOf(modInArr[0])].count = inputCount.value * countProduct;

                            }
                        }
                        verefyModifier();
                    });
                    plus.addEventListener("click", () => {
                        inputCount.value = parseInt(inputCount.value) + 1;
                        if (btnInCart.classList.contains("selected")) {
                            let modInArr = arrModifier.filter(el => el.id == md.product_id);
                            arrModifier[arrModifier.indexOf(modInArr[0])].count = inputCount.value * countProduct;

                        }
                        verefyModifier();
                    });
                    inputCount.addEventListener("change", () => {
                        if (inputCount.valueAsNumber < 1) inputCount.value = 1;
                        inputCount.value = parseInt(inputCount.value);
                        if (btnInCart.classList.contains("selected")) {
                            let modInArr = arrModifier.filter(el => el.id == md.product_id);
                            arrModifier[arrModifier.indexOf(modInArr[0])].count = parseInt(inputCount.value) * countProduct;

                        }
                        verefyModifier();
                    });

                    btnInCart.addEventListener("click", () => {
                        if (btnInCart.classList.contains("selected")) {
                            btnInCart.classList.remove("selected");
                            btnInCart.classList.remove("catalog-block__in-cart_btn");
                            btnInCart.classList.add("catalog-block__in-cart");
                            btnInCart.textContent = "+";
                            arrModifier = arrModifier.filter(el => el.id != md.product_id);

                            if (group.type === "one_one") {
                                modifierBox.querySelectorAll(".disabled").forEach(mod => {
                                    mod.classList.remove("disabled");
                                });
                            }
                            // if (arrModifier.length == 0 && selectedModifiersGroup[0].required == "true") {
                            //     productToCart.classList.add("disabled");
                            // }
                            verefyModifier();
                            return;
                        };
                        if (btnInCart.classList.contains("disabled")) return;
                        btnInCart.classList.add("selected");
                        btnInCart.classList.add("catalog-block__in-cart_btn");
                        btnInCart.classList.remove("catalog-block__in-cart");
                        btnInCart.textContent = "✓";

                        if (group.type === "one_one") {
                            modifierBox.querySelectorAll(".modal-modifier-item").forEach(mod => {
                                let thisMod = mod.querySelector(".catalog-block__in-cart");
                                if (thisMod && thisMod != btnInCart) {
                                    thisMod.classList.add("disabled");
                                }
                            });
                        }

                        arrModifier.push({ count: inputCount.value * countProduct, id: md.product_id, modifiersGroupId: md.modifiersGroupId });
                        verefyModifier();
                    });
                    modItemBody.append(modPrice);

                    if (group.type != "one_one") {
                        counterBox.append(min, inputCount, plus);
                        modItemBody.append(counterBox);
                    }
                    modItemBody.append(btnInCart);
                    blockMod.append(modPictureBox, modName, modItemBody);
                    categoryBody.append(blockMod);
                });
                category.append(categoryTitle, categoryBody);
                modifierBox.append(category);
            }
        });

        function verefyModifier() {
            //selectedModifiersGroup
            //arrModifier
            const categoryRequired = selectedModifiersGroup.filter(group => group.required == "true");
            console.log(arrModifier);
            if (categoryRequired.length > 0) {
                //Есть ли товары с обязательной категории
                categoryRequired.map(category => {
                    const productRequired = arrModifier.filter(mod => mod.modifiersGroupId == category.id);
                    if (productRequired.length > 0) {
                        productToCart.classList.remove("disabled");
                    } else {
                        productToCart.classList.add("disabled");
                    }
                });
                // 
            }
        }

        const btnClose = document.createElement("div");
        btnClose.classList.add("select_city_close");
        btnClose.addEventListener("click", () => {
            modalBox.remove();
        });
        modalBox.addEventListener("click", () => {
            try {
                if (event?.path[0] == modalBox) modalBox.remove();
            } catch (error) {
                console.warn(error);
            }

        });
        productBox.append(blockItem, productToCart);
        bodyModal.append(productBox, modifierBox, btnClose);
        modalBox.appendChild(bodyModal);
        document.querySelector("body").append(modalBox);
    }
}


function checkCart() {
    const specian = document.querySelectorAll('.cart__spices-item');
    if(!specian || specian.length == 0) location.href = '/order';
    const cart = document.querySelectorAll('.cart__order-box');
    if(!cart || cart.length == 0) location.href = '/';

    const speaciaArr = [7031, 7003, 7002, 7001];

    const missingItems = [];
    const missingSpeaian = []; 
    speaciaArr.forEach(productId => {
        const found = Array.from(specian).some(item => item.dataset.productid == productId.toString());
        if (!found) {
            const productName = Array.from(specian).find(item => item.dataset.productid == productId.toString()).querySelector('.cart__spices-item-title').textContent;
            missingSpeaian.push(productId);
        }
    });

    const filteredSpeaciaArr = speaciaArr.filter(productId => !missingSpeaian.includes(productId));
    filteredSpeaciaArr.forEach(productId => {
        const found = Array.from(cart).some(item => item.dataset.productid == productId.toString());
        if (!found) {
            const productName = Array.from(specian).find(item => item.dataset.productid == productId.toString()).querySelector('.cart__spices-item-title').textContent;
            missingItems.push({ productId, productName });
        }
    });
    if (missingItems.length === 0) {
        location.href = '/order'
    } else {
        const { modal, modalContent, p, confirmDelete, cancelDelete } = createModal();
        p.innerHTML = `
         <h3>Точно ничего не забыли?</h3>
         <p>Вы не добавили${missingItems.map(item => {return ` ${item.productName}`})}</p>
         <p>Во время акции специи приобретаются отдельно</p>
        `
        confirmDelete.textContent = 'Продолжить';
        confirmDelete.addEventListener('click', () => location.href = '/order');
        cancelDelete.textContent = 'Вернуться и добавить';
        cancelDelete.style.background = '#5a5a5a'
        cancelDelete.addEventListener('click', () => modal.remove());
    }

}

async function sendChange({ url, date }) {
    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: date
    });
    const content = await rawResponse.json();
    return content;

}
