if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
    location.reload();
}
window.store = {};



function get_browser() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/);
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}
window.addEventListener('storage', function (event) {
    if (event.key == 'is_update' && event.newValue) {
        updateCart();
    }

});
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const smoothLinks = document.querySelectorAll('a[href^="#"]');
        for (let smoothLink of smoothLinks) {
            smoothLink.addEventListener('click', function (e) {
                e.preventDefault();
                const id = smoothLink.getAttribute('href');
                const elem = document.querySelector(id);
                const y = elem.getBoundingClientRect().top + window.pageYOffset + (-100);
                window.location.hash = id;
                document.querySelector(id).scrollIntoView({
                    top: y,
                    behavior: 'smooth',
                    block: "start"
                });
            });
        }
    }, 500);


    MobileHeader();
    fixedHeader();
    mobileShearch();
    updateCart();

    const city_select_form = document.querySelector(".select_city_header");
    const items_block = city_select_form.querySelector(".items_block");
    var eventTarget;
    try {
        eventTarget = new (EventTarget);
    } catch (error) {
        eventTarget = document.createDocumentFragment();
    }

    let isSearch = false;
    const AllCity = city_select_form.querySelectorAll(".item");
    const selectCityBox = document.querySelector("#selectCity");
    const searchCityBox = document.querySelector("#searhCity");

    eventTarget["search"] = city_select_form.querySelector("#search");
    eventTarget["search"].addEventListener("input", () => {
        if (eventTarget["search"].value != "") {
            isSearch = true;
            const text = layoutFix(eventTarget["search"].value);
            const regSearch = new RegExp(`${text}`, `i`);
            AllCity.forEach(el => {
                let CityName = el.querySelector(".name").textContent;
                if (CityName.match(regSearch) != null) {
                    if (document.querySelector(".select_city__msg") != null) {
                        document.querySelector(".select_city__msg").remove();
                    }
                    el.classList.remove('hide');
                } else if (CityName.match(regSearch) == null) {
                    el.classList.add('hide');
                }
            });

        } else {
            isSearch = false;
            if (document.querySelector(".select_city__msg") != null) {
                document.querySelector(".select_city__msg").remove();
            }
            selectCityBox.classList.remove("hide");
            searchCityBox.classList.add("hide");
            searchCityBox.innerHTML = "";
            AllCity.forEach(el => {
                el.classList.remove("hide");
            });
        }

        if (isSearch) {
            selectCityBox.classList.add("hide");
            searchCityBox.classList.remove("hide");
            searchCityBox.innerHTML = "";

            AllCity.forEach(el => {
                if (!el.classList.contains("hide")) {
                    searchCityBox.append(el.cloneNode(true));
                }
            });

        } else {
            selectCityBox.classList.remove("hide");
            searchCityBox.classList.add("hide");
            searchCityBox.innerHTML = "";
            AllCity.forEach(el => {
                el.classList.remove("hide");
            });
        }
    });

    var EventHeader;
    try {
        EventHeader = new (EventTarget);
    } catch (error) {
        EventHeader = document.createDocumentFragment();
    }
    EventHeader["search"] = document.querySelector(".search_row").querySelector("input");

    const btnSearch = document.querySelector(".site-header__search");
    btnSearch?.addEventListener("click", () => {
        if (window.location.pathname == '/') {
            document.querySelector(".search__box").style.top = "0";
            EventHeader["search"].addEventListener("input", searhProduct, false);
        } else {
            window.localStorage["shearchActive"] = true;
            setTimeout(() => {
                document.location.href = "/";
            }, 200);
        }
    });

    const btnCloseSearch = document.querySelector(".search_btn_close");
    btnCloseSearch.addEventListener("click", () => {
        document.querySelector(".search__box").style.top = "-100%";
        EventHeader["search"].removeEventListener("input", searhProduct, false);
        document.querySelector("article").classList.remove("hide");
        document.querySelector(".search_section").classList.add("hide");
        EventHeader["search"].value = "";
        updateCart();
    });
    if (window.localStorage["shearchActive"] == "true") {
        setTimeout(() => {
            btnSearch.click();
        }, 10);
        window.localStorage["shearchActive"] = false;
    }

    document.querySelector(".site-header__city-block").addEventListener("click", () => {
        document.querySelector(".select_city_header").classList.remove("hide");
        document.querySelector(".select_city_header").style.opacity = "1";
    });
    document.querySelector(".select_city_close").addEventListener("click", () => {
        document.querySelector(".select_city_header").style.opacity = "0";
        setTimeout(() => {
            document.querySelector(".select_city_header").classList.add("hide");
        }, 200);
    });


    document.querySelector(".mobile-header__mobile-city").addEventListener("click", () => {
        document.querySelector(".selected_city_modile").classList.toggle("hide");
    });


});

function MobileHeader() {
    var MyEventHeader;
    try {
        MyEventHeader = new (EventTarget);
    } catch (error) {
        MyEventHeader = document.createDocumentFragment();
    }
    MyEventHeader["Burger"] = document.body.querySelector(".mobile-header__burger");
    MyEventHeader["mobilePfone"] = document.body.querySelector(".mobile-header__pfone");

    MyEventHeader["Burger"]?.addEventListener("click", () => {
        MyEventHeader["Burger"].closest(".mobile-header").querySelector(".mobole-header__mobeli-menu-box").style.left = "0";

        const mobilemenuOverlay = document.createElement("div");
        mobilemenuOverlay.classList.add("mobilemenu-overlay");
        MyEventHeader["Burger"].after(mobilemenuOverlay);

        mobilemenuOverlay.addEventListener("click", () => {
            MyEventHeader["Burger"].closest(".mobile-header").querySelector(".mobole-header__mobeli-menu-box").style.left = "-100%";
            mobilemenuOverlay.remove();
        });
    });

    const AllMobileCatigory = document.querySelector(".model-header__mobile-menu").querySelectorAll("a");
    AllMobileCatigory.forEach(el => {
        el.addEventListener("click", () => {
            MyEventHeader["Burger"].closest(".mobile-header").querySelector(".mobole-header__mobeli-menu-box").style.left = "-100%";
            document.querySelector(".mobilemenu-overlay").remove();
        });
    });

    MyEventHeader["mobilePfone"].addEventListener("click", () => {
        if (MyEventHeader["mobilePfone"].closest(".mobile-header").querySelector(".mobile-header__mobilePfone").querySelectorAll('a').length <= 1) return;

        MyEventHeader["mobilePfone"].closest(".mobile-header").querySelector(".mobile-header__mobilePfone").style.top = "63px";
        const mobilemenuOverlay = document.createElement("div");
        mobilemenuOverlay.classList.add("mobilemenu-overlay");
        mobilemenuOverlay.style.top = "63px";
        MyEventHeader["mobilePfone"].after(mobilemenuOverlay);

        mobilemenuOverlay.addEventListener("click", () => {
            MyEventHeader["mobilePfone"].closest(".mobile-header").querySelector(".mobile-header__mobilePfone").style.top = "-100%";
            mobilemenuOverlay.remove();
        });

        MyEventHeader["Burger"].addEventListener("click", () => {
            MyEventHeader["mobilePfone"].closest(".mobile-header").querySelector(".mobile-header__mobilePfone").style.top = "-100%";
            mobilemenuOverlay.remove();
        });

    });
}


function fixedHeader() {
    const headerWeb = document.querySelector(".site-header__main-fixed");
    const headerMob = document.querySelector(".mobile-header-box");

    const fixedLogo = headerWeb.querySelector(".site-header__logo");
    const fixedLogoImg = fixedLogo.querySelector("img");
    const foxedNavRow = headerWeb.querySelector(".site_menu_row");

    const topFilter = document.querySelector("#topFilter");
    const fixedFilter = document.querySelector("#fixedFilter");
    // Header Fixed
    window.addEventListener("scroll", () => {
        const topWeb = document.querySelector(".site-header__head");
        const posWeb = topWeb.getBoundingClientRect();
        const topMob = document.querySelector(".mob_position");
        const posMob = topMob.getBoundingClientRect();
        const btnTop = document.querySelector(".btn_top");

        const widthScreen = document.querySelector(".maxwidth");
        if (widthScreen.offsetWidth > 1000) {
            if (posWeb.top < (topWeb.offsetHeight * -1)) {
                headerWeb.classList.remove("hide");
                if (!topFilter.classList.contains("hide")) {
                    fixedFilter.classList.remove("hide");
                }
                topFilter.classList.add("hide");
                btnTop.style.opacity = "1";
                fixedLogo.style.left = "0%";
                foxedNavRow.style.width = "70%";
            } else if (posWeb.top > (topWeb.offsetHeight * -1)) {
                headerWeb.classList.add("hide");
                if (!fixedFilter.classList.contains("hide")) {
                    topFilter.classList.remove("hide");
                }
                fixedFilter.classList.add("hide");
                btnTop.style.opacity = "0";
                fixedLogo.style.left = "-100%";
                foxedNavRow.style.width = "85%";
            }
        } else if (widthScreen.offsetWidth <= 1000) {
            if (posMob.top < (headerMob.offsetHeight * -1)) {
                // headerMob.style.position = "fixed";
                btnTop.style.opacity = "1";
            } else if (posMob.top > (headerMob.offsetHeight * -1)) {
                // headerMob.style.position = "static";
                btnTop.style.opacity = "0";
            }
        }
        catigoryScroll();
    });

}

function catigoryScroll() {
    const articleProductList = document.querySelector("article");
    if (!articleProductList) return;

    const header = document.querySelector(".site-header");
    const menuItems = header.querySelectorAll(".site-header__menu-item");
    const sections = articleProductList.querySelectorAll("section");
    const headerCategoryName = document.querySelector("#catigoryName").querySelector("h2");

    sections.forEach(section => {
        const position = section.getBoundingClientRect();

        if (position.top < window.innerHeight / 4 && position.top > -section.offsetHeight) {
            menuItems.forEach(menuItem => {
                const link = menuItem.querySelector("a");
                if (link && link.hash === `#${section.id}`) {
                    menuItems.forEach(menu => menu.classList.remove("menu-item-Active"));
                    menuItem.classList.add("menu-item-Active");

                    headerCategoryName.closest("#catigoryName").classList.remove("hide");
                    headerCategoryName.textContent = section.querySelector(".catalog-block__title").querySelector("h2").textContent;
                    document.title = `${capitalizeSentences(headerCategoryName.textContent)} | ${domain}`;
                    if (`#${section.id}` !== location.hash) {
                        history.replaceState(null, "", `#${section.id}`);
                    }
                    headerCategoryName.closest("#catigoryName").addEventListener("click", () => {
                        link.click();
                    });
                }
            });
        }
    });
}


const searhProduct = function () {
    const AllProduct = document.querySelector("article").querySelectorAll(".catalog-block__item");
    const InputSearch = document.querySelector(".search_row").querySelector("input");
    const AllCategory = document.querySelector("article");
    const searchSection = document.querySelector(".search_section");
    searchSection.querySelector(".catalog-block__container").innerHTML = "";
    if (InputSearch.value != "") {
        AllCategory.classList.add("hide");
        searchSection.classList.remove("hide");
        const regSearch = new RegExp(`${layoutFix(InputSearch.value)}`, `i`);
        AllProduct.forEach(el => {
            const name = el.querySelector(".catalog-block__info-title").textContent;
            const price = el.querySelector(".catalog-block__price").textContent;
            if (name.match(regSearch) != null || price.match(regSearch) != null) {
                const cloneItem = el.cloneNode(true);
                if (cloneItem.querySelector('.svg_lazy')) {
                    if (cloneItem.querySelector('.svg_lazy').dataset.src) {
                        cloneItem.querySelector('.svg_lazy').src = cloneItem.querySelector('.svg_lazy').dataset.src;
                        cloneItem.querySelector('.svg_lazy').classList.remove('svg_lazy');
                    }
                }
                searchSection.querySelector(".catalog-block__container").append(cloneItem);
            }
        });

        if (searchSection.querySelector(".catalog-block__item") == null) {

            if (document.querySelector(".search__msg") == null) {
                const p = document.createElement("p");
                p.textContent = `К сожалению " ${layoutFix(InputSearch.value)} "  не найдено`;
                p.classList.add("search__msg");
                searchSection.querySelector(".catalog-block__container").append(p);
            }
        }

    } else {
        AllCategory.classList.remove("hide");
        searchSection.classList.add("hide");
        searchSection.querySelector(".catalog-block__container").innerHTML = "";
        updateCart();
    }

};


function mobileShearch() {
    const ShearchInput = document.querySelector("#shearh_mobile_city");
    const AllCity = document.querySelector(".selected_city_modile").querySelectorAll(".name");
    const searchBlock = document.createElement("div");
    ShearchInput.closest(".selected_city_modile").append(searchBlock);
    ShearchInput.addEventListener("input", () => {
        if (ShearchInput.closest('.selected_city_modile').querySelector("div")) {
            ShearchInput.closest('.selected_city_modile').querySelector("div").remove();
            searchBlock.innerHTML = '';
            ShearchInput.closest(".selected_city_modile").append(searchBlock);

        } else {
            ShearchInput.closest(".selected_city_modile").append(searchBlock);
        }
        if (ShearchInput.value != "") {
            const regSearch = new RegExp(`${layoutFix(ShearchInput.value)}`, `i`);
            AllCity.forEach(el => {
                el.closest("span").classList.add("hide");
                if (el.textContent.match(regSearch) != null) {
                    const span = document.createElement("span");
                    span.append(el.cloneNode(true));
                    searchBlock.append(span);
                }
                if (searchBlock.querySelectorAll("a").length == 0) {
                    if (searchBlock.querySelector("p") != null) searchBlock.querySelector("p").remove();
                    const p = document.createElement("p");
                    p.textContent = `К сожалению город "${layoutFix(ShearchInput.value)}" не найден`;
                    searchBlock.append(p);
                } else {
                    if (searchBlock.querySelector("p") != null) searchBlock.querySelector("p").remove();
                }
            });
        } else {
            searchBlock.remove();
            AllCity.forEach(el => {
                el.closest("span").classList.remove("hide");
            });
        }
    });
}

function layoutFix(str) {
    replacer = {
        "q": "й",
        "w": "ц",
        "e": "у",
        "r": "к",
        "t": "е",
        "y": "н",
        "u": "г",
        "i": "ш",
        "o": "щ",
        "p": "з",
        "[": "х",
        "]": "ъ",
        "a": "ф",
        "s": "ы",
        "d": "в",
        "f": "а",
        "g": "п",
        "h": "р",
        "j": "о",
        "k": "л",
        "l": "д",
        ";": "ж",
        "'": "э",
        "z": "я",
        "x": "ч",
        "c": "с",
        "v": "м",
        "b": "и",
        "n": "т",
        "m": "ь",
        ",": "б",
        ".": "ю",
        "/": ".",
    };


    for (i = 0; i < str.length; i++) {
        if (replacer[str[i].toLowerCase()] != undefined) {

            if (str[i] == str[i].toLowerCase()) {
                replace = replacer[str[i].toLowerCase()];
            } else if (str[i] == str[i].toUpperCase()) {
                replace = replacer[str[i].toLowerCase()].toUpperCase();
            }

            str = str.replace(str[i], replace);
        }
    }
    return str;
}


function updateCart(result) {
    if (!result) return;
    const list = result.list;

    const currentLocation = window.location;
    let type = "delivery";
    switch (currentLocation.pathname) {
        case '/':
            type = "delivery";
            break;
        case '/cart':
            // type = (document.querySelector('input[name="delivery_type"]:checked').value == 0) ? "delivery" : "pickup";
            break;
        case '/order/delivery':
            type = (document.querySelector('input[name="delivery_type"]:checked').value == 0) ? "delivery" : "pickup";
            break;
        case '/order/pickup':
            type = (document.querySelector('input[name="delivery_type"]:checked').value == 0) ? "delivery" : "pickup";
            break;
    }

    let allProduct, allProductNew = {};


    switch (currentLocation.pathname) {
        case '/':
            document.querySelectorAll('.catalog-block__item').forEach(el => {
                try {
                    el.querySelector('.product_in_cart').classList.add("hide");
                    el.querySelector('.in_not_cart').classList.remove("hide");
                } catch (error) {
                    console.log(el);
                }
            });
            allProduct = {};

            for (let id in list) {
                const offer = list[id];
                for (const i in offer) {
                    if (allProduct[offer[i].product_id]) {
                        allProduct[offer[i].product_id].count += list[id].count;
                    } else {
                        allProduct[offer[i].product_id] = {
                            product_id: offer[i].product_id,
                            count: offer[i].count
                        };
                    }
                }
            }

            for (let product_id in allProduct) {

                try {
                    const product = document.querySelector(`div[data-productid="${product_id}"]`);
                    const priceBox = product.querySelector('.product_in_cart');
                    if (priceBox.classList.contains('hide')) {
                        priceBox.querySelector('input').textContent = allProduct[product_id].count;
                        priceBox.classList.remove("hide");
                        product.querySelector('.in_not_cart').classList.add('hide');
                    }
                    priceBox.querySelector("input[name='incart']").value = allProduct[product_id].count;
                } catch (error) {
                    console.error(error);
                }
            }

            break;

        case '/new_product':
            document.querySelectorAll('.catalog-block__item').forEach(el => {
                try {
                    el.querySelector('.product_in_cart').classList.add("hide");
                    el.querySelector('.in_not_cart').classList.remove("hide");
                } catch (error) {
                    console.log(el);
                }
            });
            allProductNew = {};

            for (let id in list) {
                const offer = list[id];
                for (const i in offer) {
                    if (allProductNew[offer[i].product_id]) {
                        allProductNew[offer[i].product_id].count += list[id].count;
                    } else {
                        allProductNew[offer[i].product_id] = {
                            product_id: offer[i].product_id,
                            count: offer[i].count
                        };
                    }
                }
            }

            for (let product_id in allProductNew) {
                try {
                    const product = document.querySelector(`div[data-productid="${product_id}"]`);
                    const priceBox = product.querySelector('.product_in_cart');
                    if (priceBox.classList.contains('hide')) {
                        priceBox.querySelector('input').textContent = allProductNew[product_id].count;
                        priceBox.classList.remove("hide");
                        product.querySelector('.in_not_cart').classList.add('hide');
                    }
                    priceBox.querySelector("input[name='incart']").value = allProductNew[product_id].count;
                } catch (error) {
                    console.error(error);
                }
            }

            break;
        case '/cart':
            allProducts = document.querySelectorAll('.cart__order-box');
            const allSpece = document.querySelectorAll('.cart__spices-item');
            allSpece.forEach(spice => {
                spice.querySelector(".cart__spices-item-btn").classList.remove("hide");
                spice.querySelector(".cart__spices-item-count-body").classList.add("hide");
            });

            if (!result.count_cart && document.querySelector('.cart-undefined').classList.contains('hide')) {
                window.location.reload();
                return;
            }

            if (!allProducts.length && result.count_cart > 0) {
                window.location.reload();
                return;
            }

            // const type = document.querySelector('input[name="delivery_type"]:checked').value == "0" ? "delivery" : "pickup";

            for (const id in list) {

                const offer = offers[id] ? JSON.parse(offers[id]) : null;

                if (!offer) continue;

                list[id].forEach(prod => {

                    const spice = Array.from(allSpece).find(el => el.getAttribute('data-productid') === prod.product_id);
                    if (spice) {
                        spice.querySelector(".cart__spices-item-btn").classList.add("hide");
                        spice.querySelector(".cart__spices-item-count-body").classList.remove("hide");
                        spice.querySelector(".text").value = prod.count;
                    }
                    let is_continue = true;
                    allProducts.forEach(product => {
                        if (product.dataset.index == prod.t_id) {
                            is_continue = false;
                            product.querySelector(".text").value = prod.count;
                            product.querySelector('.cart__order-price-one span').textContent = prod.price[type];
                            product.querySelector('.cart__order-price-one .cart__order-full_price').textContent = prod.full_price + ` ${currency}`;
                            product.querySelector('.cartCount').value = prod.count;
                            product.querySelector('.cart__order-total span').textContent = prod.price[type] * prod.count;

                            /* Модификаторы */

                            const modifierBox = product.querySelector(".modifiers-box");
                            product.dataset.modifiers = "[]";
                            modifierBox.innerHTML = "";
                            if (prod.modifiers) {

                                product.dataset.modifiers = JSON.stringify(prod.modifiers);

                                prod.modifiers.forEach(md => {
                                    const mdOffer = modifiers[md.product_id] ? JSON.parse(modifiers[md.product_id]) : null;
                                    console.log(mdOffer);
                                    if (mdOffer) {
                                        const liMod = createElement("li", "");
                                        liMod.dataset.modificatorId = md.product_id;
                                        liMod.dataset.count = md.count / prod.count;
                                        liMod.textContent = `+ ${mdOffer.name} (${md.count})`;
                                        modifierBox.appendChild(liMod);

                                    }
                                });

                            }

                        }
                    });
                    if (is_continue) {
                        const clone = allProducts[0].cloneNode(true);
                        clone.querySelector('img').src = offer.picture;
                        clone.querySelector('h2').textContent = offer.name;
                        clone.querySelector('.cart__order-price-one span').textContent = prod.price[type];
                        clone.querySelector('.cart__order-price-one .cart__order-full_price').textContent = prod.full_price + ` .${currency}`;
                        clone.querySelector('.cartCount').value = prod.count;
                        clone.querySelector('.cart__order-total span').textContent = prod.price[type] * prod.count;
                        clone.dataset.productid = prod.product_id;
                        clone.dataset.index = prod.t_id;
                        clone.querySelector(".modifiers-box").innerHTML = "";

                        if (clone.querySelector(".edit_modifier")) clone.querySelector(".edit_modifier").remove();
                        try {
                            const modifiers = prod.modifiers;
                            for (const el of modifiers) {
                                const li = document.createElement("li");
                                li.dataset.modificatorId = el.id;
                                li.textContent = `+${el.name} (${el.count})`;
                                clone.querySelector(".modifiers-box").append(li);
                            }
                        } catch (error) { }

                        if (prod.price[type] >= prod.full_price) {
                            clone.querySelector('.cart__order-price-one .cart__order-full_price').classList.add('hide');
                        }

                        allProducts[allProducts.length - 1].after(clone);
                    }
                });
            }


            /* Удаляем лишнее!  */

            if (allProducts.length > Object.keys(list).length) {
                allProducts.forEach(el => {
                    let is_continue = true;
                    for (let id in list) {
                        list[id].forEach(prod => {
                            if (el.dataset.index == prod.t_id) {
                                is_continue = false;
                            }
                        });
                    }
                    if (is_continue) {
                        el.remove();
                    }
                });
            }

            document.querySelector('.cart__inner-box').querySelector('.cart__inner_total').querySelector('span').textContent = result.total_cart[type];
            document.querySelector('.cart__inner-box').querySelector('.cart__order-full_price').querySelector('span').textContent = result.total_full_cart;

            if (typeof window.setPresentLoad == "function") window.setPresentLoad(result.total_cart[type]);

            break;
        case '/order/delivery':
            if (result.count_cart == 0) {
                location.href = '/cart';
                return;
            }
            if (result.is_not_pickup) {
                document.querySelector(`label[for="delivery1"]`).classList.add("hide");
            } else {
                document.querySelector(`label[for="delivery1"]`).classList.remove("hide");
            }
            if (result.total_cart['delivery'] < result.min_price) {
                if (document.querySelector('#delivery0').disabled != true) {
                    document.querySelector('#delivery0').disabled = true;
                    document.querySelector('.d0').classList.add('disabled');
                    if (!result.is_not_pickup) {
                        document.querySelector('.d1').click();
                    }
                }

                if (result.is_not_pickup) {
                    document.querySelector("#send_order").classList.add('disabled');
                } else {
                    document.querySelector("#send_order").classList.remove('disabled');
                }
            } else {
                if (document.querySelector('#delivery0').disabled == true) {
                    document.querySelector('#delivery0').disabled = false;
                    document.querySelector('.d0').classList.remove('disabled');

                }
                document.querySelector("#send_order").classList.remove('disabled');
            }

            const AllProductOrder = document.querySelectorAll('.cart_body-row');
            for (let item_id in list) {
                let is_continue = true;

                AllProductOrder.forEach(item => {
                    // const item = document.querySelector(`.cart_body-row[product-id="${item_id}"]`);
                    if (item.dataset.index == item_id) {
                        item.querySelector('.sum').textContent = `${list[item_id].total_price[type]} ${currency}`;

                        if (list[item_id].offer.discount_percents[type]) {
                            item.querySelector('.precent').textContent = '';
                            for (let key in list[item_id].offer.discount_percents[type]) {
                                item.querySelector('.precent').textContent += `-${list[item_id].offer.discount_percents[type][key]}% `;
                            }
                            item.querySelector('.precent').classList.remove('hide');
                            if (list[item_id].price[type] == list[item_id].price['delivery']) {
                                item.querySelector('.sum_delivery').textContent.textContent = '';
                            } else {
                                item.querySelector('.sum_delivery').textContent.textContent = list[item_id].total_price['delivery'];
                            }
                            item.querySelector('.sum_delivery').classList.remove('hide');

                        } else {
                            item.querySelector('.precent').classList.add('hide');
                            item.querySelector('.sum_delivery').classList.add('hide');

                            if (result.is_base_action && type == 'pickup') {
                                item.querySelector('.sum_delivery').textContent = '';
                                item.querySelector('.sum_delivery').classList.remove('hide');
                            }
                        }

                        item.querySelector('.count').textContent = `${list[item_id].count} шт.`;

                        item.querySelector('.modifiers').textContent = "";
                        if (list[item_id].modifiers.length > 0) {
                            item.querySelector('.modifiers').textContent = "Добавлено: ";
                            list[item_id].modifiers.forEach(el => {
                                item.querySelector('.modifiers').textContent += `+${el.name} (${el.count})`;
                            });
                        }


                        is_continue = false;
                    }
                });

                if (is_continue) {
                    if (list[item_id].is_available) {
                        const cloneRow = AllProductOrder[0].cloneNode(true);
                        cloneRow.dataset.productId = list[item_id].product_id;
                        cloneRow.dataset.index = item_id;
                        cloneRow.querySelector('a').textContent = list[item_id].offer.name;
                        cloneRow.querySelector('.sum').textContent = ` ${list[item_id].total_price[type]} ${currency}`;

                        if (list[item_id].price[type] != list[item_id].price['delivery']) {
                            cloneRow.querySelector('.sum_delivery').textContent = `${list[item_id].total_price[type]} ${currency}`;
                        } else {
                            cloneRow.querySelector('.sum_delivery').textContent = '';
                        }
                        if (list[item_id].offer.discount_percents[type]) {
                            for (let key in list[item_id].offer.discount_percents[type]) {
                                cloneRow.querySelector('.precent').textContent += `-${list[item_id].offer.discount_percents[type][key]}% `;
                            }
                            cloneRow.querySelector('.precent').classList.remove("hide");

                        } else {
                            cloneRow.querySelector('.precent').textContent = '';
                            cloneRow.querySelector('.precent').classList.add("hide");
                        }
                        cloneRow.querySelector('.count').textContent = `${list[item_id].count} шт.`;

                        cloneRow.querySelector('.modifiers').textContent = "";

                        if (list[item_id].modifiers.length > 0) {
                            cloneRow.querySelector('.modifiers').textContent = "Добавлено: ";
                            list[item_id].modifiers.forEach(el => {
                                cloneRow.querySelector('.modifiers').textContent += `+${el.name} (${el.count})`;
                            });
                        }


                        AllProductOrder[AllProductOrder.length - 1].before(cloneRow);
                    }


                }
            }

            //delete
            if (AllProductOrder.length > Object.keys(list).length) {
                AllProductOrder.forEach(product => {
                    let is_continue = true;
                    for (let id in list) {
                        if (product.dataset.productId == id) {
                            is_continue = false;
                        }
                    }
                    if (is_continue) {
                        product.remove();
                    }
                });
            }

            if (result.total_cart[type] != result.total_cart['delivery']) {
                document.querySelector('.total-sum_delivery').classList.remove('hide');
                document.querySelector('.total-sum_delivery').textContent = `${result.total_cart['delivery']} ${currency}`;

            } else {
                document.querySelector('.total-sum_delivery').classList.add('hide');
                document.querySelector('.total-sum_delivery').textContent = ``;
            }
            document.querySelector('.total-sum').textContent = `${result.total_cart[type]} ${currency}`;
            document.querySelector('.order__total').querySelector('.order__total-sum').querySelector('.sum').textContent = `${result.total_cart[type]} ${currency}`;
            document.querySelector('.order__total').querySelector('.order__total-price').querySelector('.sum').textContent = `${result.total_cart[type]} ${currency}`;
            break;
        case '/order/pickup':
            if (result.count_cart == 0) {
                location.href = '/cart';
                return;
            }
            if (result.total_cart['delivery'] < result.min_price) {
                if (document.querySelector('#delivery0').disabled != true) {
                    document.querySelector('#delivery0').disabled = true;
                    document.querySelector('.d0').classList.add('disabled');
                    document.querySelector('.d1').click();
                }
            } else {
                if (document.querySelector('#delivery0').disabled == true) {
                    document.querySelector('#delivery0').disabled = false;
                    document.querySelector('.d0').classList.remove('disabled');
                }
            }

            const AllProductOrderPicup = document.querySelectorAll('.cart_body-row');
            for (let item_id in list) {
                let is_continue = true;

                AllProductOrderPicup.forEach(item => {
                    // const item = document.querySelector(`.cart_body-row[product-id="${item_id}"]`);
                    if (item.dataset.productId == item_id) {
                        item.querySelector('.sum').textContent = `${list[item_id].total_price[type]} ${currency}`;

                        if (list[item_id].offer.discount_percents[type]) {
                            item.querySelector('.precent').textContent = '';
                            for (let key in list[item_id].offer.discount_percents[type]) {
                                item.querySelector('.precent').textContent += `-${list[item_id].offer.discount_percents[type][key]}% `;
                            }
                            item.querySelector('.precent').classList.remove('hide');
                            if (list[item_id].price[type] == list[item_id].price['delivery']) {
                                item.querySelector('.sum_delivery').textContent.textContent = '';
                            } else {
                                item.querySelector('.sum_delivery').textContent.textContent = list[item_id].total_price['delivery'];
                            }
                            item.querySelector('.sum_delivery').classList.remove('hide');

                        } else {
                            item.querySelector('.precent').classList.add('hide');
                            item.querySelector('.sum_delivery').classList.add('hide');

                            if (result.is_base_action && type == 'pickup') {
                                item.querySelector('.sum_delivery').textContent = '';
                                item.querySelector('.sum_delivery').classList.remove('hide');
                            }
                        }

                        item.querySelector('.count').textContent = `${list[item_id].count} шт.`;

                        is_continue = false;
                    }
                });

                if (is_continue) {
                    if (list[item_id].is_available) {
                        const cloneRow = AllProductOrderPicup[0].cloneNode(true);
                        cloneRow.dataset.productId = item_id;
                        cloneRow.querySelector('a').textContent = list[item_id].offer.name;
                        cloneRow.querySelector('.sum').textContent = ` ${list[item_id].total_price[type]} ${currency}`;

                        if (list[item_id].price[type] != list[item_id].price['delivery']) {
                            cloneRow.querySelector('.sum_delivery').textContent = `${list[item_id].total_price[type]} ${currency}`;
                        } else {
                            cloneRow.querySelector('.sum_delivery').textContent = '';
                        }
                        if (list[item_id].offer.discount_percents[type]) {
                            for (let key in list[item_id].offer.discount_percents[type]) {
                                cloneRow.querySelector('.precent').textContent += `-${list[item_id].offer.discount_percents[type][key]}% `;
                            }

                        } else {
                            cloneRow.querySelector('.precent').textContent = '';
                            cloneRow.querySelector('.precent').classList.add("hide");
                        }
                        if (result.is_base_action) {
                            cloneRow.querySelector('.sum_delivery').classList.add("hide");
                        }
                        cloneRow.querySelector('.count').textContent = `${list[item_id].count} шт.`;
                        AllProductOrderPicup[AllProductOrderPicup.length - 1].before(cloneRow);
                    }


                }
            }

            //delete
            if (AllProductOrderPicup.length > Object.keys(list).length) {
                AllProductOrderPicup.forEach(product => {
                    let is_continue = true;
                    for (let id in list) {
                        if (product.dataset.productId == id) {
                            is_continue = false;
                        }
                    }
                    if (is_continue) {
                        product.remove();
                    }
                });
            }

            if (result.total_cart[type] != result.total_cart['delivery']) {
                document.querySelector('.total-sum_delivery').classList.remove('hide');
                document.querySelector('.total-sum_delivery').textContent = `${result.total_cart['delivery']} ${currency}`;

            } else {
                document.querySelector('.total-sum_delivery').classList.add('hide');
                document.querySelector('.total-sum_delivery').textContent = ``;
            }
            document.querySelector('.total-sum').textContent = `${result.total_cart[type]} ${currency}`;
            document.querySelector('.order__total').querySelector('.order__total-sum').querySelector('.sum').textContent = `${result.total_cart[type]} ${currency}`;
            document.querySelector('.order__total').querySelector('.order__total-price').querySelector('.sum').textContent = `${result.total_cart[type]} ${currency}`;
            break;
    }

    document.querySelectorAll('.cart_count').forEach(cart => {
        cart.textContent = result.count_cart;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const browser = get_browser();

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        const download_app = document.createElement('div');
        download_app.classList.add('download_app_mobile');

        const btn_close = document.createElement('div');
        btn_close.classList.add('download_app_mobile_close');
        btn_close.innerHTML = `<svg width="15" height="15" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.84606 12.4986L0.552631 3.20519C-0.1806 2.47196 -0.1806 1.28315 0.552631 0.549923C1.28586 -0.183308 2.47466 -0.183308 3.20789 0.549923L12.5013 9.84335L21.792 0.552631C22.5253 -0.1806 23.7141 -0.1806 24.4473 0.552631C25.1805 1.28586 25.1805 2.47466 24.4473 3.20789L15.1566 12.4986L24.45 21.792C25.1832 22.5253 25.1832 23.7141 24.45 24.4473C23.7168 25.1805 22.528 25.1805 21.7947 24.4473L12.5013 15.1539L3.20519 24.45C2.47196 25.1832 1.28315 25.1832 0.549923 24.45C-0.183308 23.7168 -0.183308 22.528 0.549923 21.7947L9.84606 12.4986Z" fill="black"></path></svg>`;
        btn_close.addEventListener('click', () => {
            download_app.remove();
            document.querySelector('.btn_top').style.bottom = '5%';
        });
        const a = document.createElement('a');
        a.target = '_blank';

        // const imgLogo = document.createElement('img');
        // imgLogo.classList.add('dowloand_logo')
        // imgLogo.src = "/Resourse/media/logo_mini.png?v1"

        document.querySelector('.btn_top').style.bottom = '10%';

        //NOTE: TEST (start)

        // function getCookies() {
        //     var cookies = document.cookie.split(';');
        //     var cookieData = {};

        //     for (var i = 0; i < cookies.length; i++) {
        //       var cookie = cookies[i].trim().split('=');
        //       var name = decodeURIComponent(cookie[0]); 
        //       var value = decodeURIComponent(cookie[1]);
        //       cookieData[name] = value;
        //     }

        //     return cookieData;
        //   }


        // console.logflag_new_applink;
        let flag_new_applink = false;

        ymab('metrika.61888695', 'getFlags', function (flags) {
            if (flags.download_app) {
                flag_new_applink = true;
            }
            if (flags.mobile_navbar) {
                flag_new_applink = true;
            }
        });

        const downloadAppBtn = createElement('div', 'download_app_test');

        const downloadBtnLink = createElement('a', 'download_app_link_test');
        downloadBtnLink.innerText = 'Скачать приложение';
        downloadBtnLink.target = '_blank';
        downloadAppBtn.appendChild(downloadBtnLink);



        //NOTE: TEST (end)

        const span = document.createElement('span');
        const p01 = document.createElement('p');
        p01.textContent = 'Приложение';
        p01.classList.add('p_app');

        const p02 = document.createElement('p');
        p02.textContent = '';
        p02.classList.add('p_name');

        span.append(p01, p02);

        if (browser.name == "Chrome") {
            if (flag_new_applink) {
                downloadBtnLink.href = linksApp["android"];         //NOTE: test
            } else {
                a.href = linksApp["android"];
                const img = document.createElement('img');
                img.src = "/Resourse/media/google-play-badge.png";
                a.append(span, img);
            }



        } else if (browser.name == "Safari") {
            if (flag_new_applink) {
                downloadBtnLink.href = linksApp["ios"];         //NOTE: test
            } else {
                a.href = linksApp["ios"];
                const img = document.createElement('img');
                img.src = "/Resourse/media/App_Store_Badge.svg";
                a.append(span, img);
            }
        } else {
            if (flag_new_applink) {
                downloadBtnLink.href = linksApp["android"];         //NOTE: test
            } else {
                a.href = linksApp["android"];
                const img = document.createElement('img');
                img.src = "/Resourse/media/google-play-badge.png";
                a.append(span, img);
            }
        }

        if (browser.name == "Chrome" && linksApp["android"] != "") {
            if (flag_new_applink) {
                document.querySelector('.nav_address_client').after(downloadAppBtn);         //NOTE: test v1
                // document.querySelector('.nav_address_client').before(downloadAppBtn)         //NOTE: test v2                
            } else {
                download_app.append(a, btn_close);
                document.body.append(download_app);
            }



        } else if (browser.name == "Safari" && linksApp["ios"] != "") {
            if (flag_new_applink) {
                document.querySelector('.nav_address_client').after(downloadAppBtn);         //NOTE: test v1
                // document.querySelector('.nav_address_client').before(downloadAppBtn)         //NOTE: test v2
            } else {
                download_app.append(a, btn_close);
                document.body.append(download_app);
            }
        } else {
            if (linksApp["android"] != "") {
                if (flag_new_applink) {
                    document.querySelector('.nav_address_client').after(downloadAppBtn);         //NOTE: test v1
                    // document.querySelector('.nav_address_client').before(downloadAppBtn)         //NOTE: test v2
                } else {
                    download_app.append(a, btn_close);
                    document.body.append(download_app);
                }
            }
        }

    }

    let nitifUsers = sessionStorage.getItem("user_view_notif");

    // if (HOST == "sushi-darom.com" && new Date().getDate() == "31" && new Date().getMonth() == "11" && !nitifUsers) {
    //     const boxNotify = document.createElement("div");
    //     boxNotify.classList.add("boxNotify");
    //     sessionStorage.setItem("user_view_notif", "true");
    //     const text = document.createElement("span");
    //     text.classList.add("notifyText");
    //     text.innerHTML = `<span>31.12.2022</span> работаем до 20:00`;

    //     boxNotify.append(text);
    //     document.body.append(boxNotify);
    //     const clearNotif = () => {
    //         boxNotify.remove();
    //         document.body.removeEventListener("click", clearNotif, true);
    //     }
    //     document.body.addEventListener("click", clearNotif, true);


    // }

});

function get_browser() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/);
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}


function openClose(btn) {
    const body = btn.closest('.ingredients_nav');
    const ingredientsItems = body.querySelector(".ingredients_items");
    const [leftBtnOpen, rightBtnOpen] = btn.querySelectorAll(".arrow_down");
    const [leftBtnClose, rightBtnClose] = btn.querySelectorAll(".arrow_up");

    if (body.classList.contains("open")) {
        body.classList.remove("open");

        let currentHeight = ingredientsItems.clientHeight;
        ingredientsItems.style.overflow = "hidden";
        const duration = 200; // in milliseconds
        const step = currentHeight / (duration / 2);
        const animation = setInterval(function () {
            currentHeight -= 25;
            ingredientsItems.style.height = currentHeight + "px";
            if (currentHeight <= 0) {
                clearInterval(animation);
                ingredientsItems.classList.remove("open");
                ingredientsItems.removeAttribute("style");
            }
        }, 2);


        leftBtnOpen.classList.remove("hide");
        rightBtnOpen.classList.remove("hide");

        leftBtnClose.classList.add("hide");
        rightBtnClose.classList.add("hide");

    } else {
        body.classList.add("open");
        ingredientsItems.classList.add("open");
        leftBtnOpen.classList.add("hide");
        rightBtnOpen.classList.add("hide");

        leftBtnClose.classList.remove("hide");
        rightBtnClose.classList.remove("hide");

    }

}
const arrIngredient = [];
let productContains = true;
function setIngredient(el) {
    if (arrIngredient.indexOf(el.dataset.id) > -1) {
        arrIngredient.splice(arrIngredient.indexOf(el.dataset.id), 1);
        el.classList.remove('selected');
        document.querySelectorAll(`div[data-id="${el.dataset.id}"]`).forEach(ingr => {
            ingr.classList.remove('selected');
        });
    } else {
        arrIngredient.push(el.dataset.id);
        el.classList.add('selected');
        document.querySelectorAll(`div[data-id="${el.dataset.id}"]`).forEach(ingr => {
            ingr.classList.add('selected');
        });
    }
    startFilter();
}

function selectIng(value) {
    if (value) {
        document.querySelectorAll("#ingTrue").forEach(el => el.classList.add("select"));
        document.querySelectorAll("#ingFalse").forEach(el => el.classList.remove("select"));
    } else {
        document.querySelectorAll("#ingTrue").forEach(el => el.classList.remove("select"));
        document.querySelectorAll("#ingFalse").forEach(el => el.classList.add("select"));
    }
    productContains = value;
    startFilter();
}

function startFilter() {
    const allProduct = document.querySelectorAll(".catalog-block__item");
    allProduct.forEach(product => {
        product.classList.remove('hide');
    });
    if (arrIngredient.length) {
        allProduct.forEach(product => {
            const productIngreditnt = JSON.parse(product.dataset.ingredient);
            if (productContains) {
                arrIngredient.forEach(ing => {
                    if (!productIngreditnt[ing]) {
                        product.classList.add("hide");
                    }
                });
            } else {
                arrIngredient.forEach(ing => {
                    if (productIngreditnt[ing]) {
                        product.classList.add("hide");
                    }
                });
            }
        });
    } else {
        allProduct.forEach(product => {
            product.classList.remove('hide');
        });
    }

    filterFilter();
}

function filterFilter() {
    const allFilter = document.querySelectorAll(".filter_items .site-header__menu-item");
    allFilter.forEach(el => el.classList.add("hide"));

    // Получить все элементы с атрибутом "data-ingredient"
    const elements = document.querySelectorAll('[data-ingredient]');

    // Создать объект для хранения уникальных ключей
    const uniqueKeys = {};

    // Перебрать каждый элемент и извлечь ключи, если элемент не имеет класса "hide"
    elements.forEach(element => {
        if (!element.classList.contains('hide')) {
            const data = element.getAttribute('data-ingredient');
            const json = JSON.parse(data);
            Object.keys(json).forEach(key => {
                uniqueKeys[key] = true;
            });
        }
    });



    // Получить массив уникальных ключей
    const keysArray = Object.keys(uniqueKeys);
    allFilter.forEach(el => {
        if (uniqueKeys[el.dataset.id] || el.classList.contains("selected")) {
            el.classList.remove("hide");
        }
    });


}

function openFilter(btn) {
    const body = btn.closest(".nav_cart");
    const filterBox = body.querySelector(".filter_box");
    if (filterBox.classList.contains("hide")) {
        filterBox.classList.remove("hide");
    } else {
        filterBox.classList.add("hide");
    }
}

function openFilterMobile(el) {
    el = el.closest(".mob_filter_box");
    if (el.classList.contains("open")) {
        el.classList.remove("open");
    } else {
        el.classList.add("open");
    }
}




let myToken = null;
function onSubmit(token) {
    if (token) {
        myToken = token;
    }
}



function signIn(phone) {

    try {
        ym(61888695, 'reachGoal', 'show_auth');
    } catch (error) {

    }

    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content parent";

    const text = document.createElement("div");
    text.className = "modal-text";
    text.textContent = "Вход на сайт";


    const phoneLabel = document.createElement("div");
    phoneLabel.className = "phone-nomer-label";
    phoneLabel.textContent = "Для оформления заказа введите, пожалуйста, Ваш номер телефона:";

    const phoneNumberInput = document.createElement("input");
    phoneNumberInput.id = "sigInPhone";
    phoneNumberInput.type = "text";
    phoneNumberInput.className = "phone-number-input";
    phoneNumberInput.setAttribute("inputmode", "numeric");

    const errorBox = document.createElement("div");
    errorBox.className = "error";


    const sendPhoneBtn = document.createElement("div");
    sendPhoneBtn.className = "catalog-block__in-cart";
    sendPhoneBtn.textContent = "Выслать код";


    const policy = document.createElement('div');
    policy.className = "modal-policy";
    policy.innerHTML = "Продолжая, Вы соглашаетесь <a href='/personal/'>со сбором и обработкой персональных данных </a> и <a href='/policy/'>пользовательским соглашением</a>";

    const preloader = document.createElement("div");
    preloader.className = "preloader";


    phoneNumberInput.addEventListener('keyup', function (event) {
        // Проверяем, была ли нажата клавиша Enter (код клавиши 13)
        if (event.key === 'Enter' || event.key === 'NumpadEnter') {
            sendPhoneBtn.dispatchEvent(new Event("click"));
        }
    });

    try {
        grecaptcha.execute();
    } catch (error) {
        console.warn('grecaptcha undefined');
    }


    sendPhoneBtn.addEventListener("click", () => {
        if (!myToken) {
            errorBox.textContent = 'Пройдите проверку на робота ';
            return;
        };

        modalContent.classList.add("loading");
        const xhr = new XMLHttpRequest();

        xhr.open('POST', '/cart/setPhone');
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = async function () {
            if (xhr.response.is_error) {
                errorBox.textContent = xhr.response.error;
            } else {
                //Отправляем запрос на код
                const code = await requestCode();

                const userPhoneBox = document.createElement("div");
                userPhoneBox.className = "user-phone-box";

                const userPhoneText = document.createElement("span");
                userPhoneText.className = "user-phone";
                userPhoneText.textContent = phoneNumberInput.value;
                const userPhoneEdit = document.createElement("button");
                userPhoneEdit.className = "user-phone-edit";
                userPhoneEdit.textContent = "Изменить";
                userPhoneBox.append(userPhoneText, userPhoneEdit);

                userPhoneEdit.addEventListener("click", () => {
                    modal.remove();
                    signIn('');
                });

                //Убираем лишне
                phoneLabel.remove();
                phoneNumberInput.remove();
                sendPhoneBtn.remove();
                errorBox.textContent = "";
                if (code.is_error) {
                    errorBox.textContent = code.error;
                }

                const inputBlock = document.createElement("div");
                inputBlock.className = "input-block";

                //Создаем поля для кода
                var input1 = document.createElement("input");
                input1.type = "text";
                input1.maxLength = "1";
                input1.className = "code-input";
                input1.setAttribute("inputmode", "numeric");
                input1.addEventListener("input", function () {
                    input1.classList.remove('error_code');
                    input2.classList.remove('error_code');
                    input3.classList.remove('error_code');
                    input4.classList.remove('error_code');
                    if (input1.value) input2.focus();
                });

                // Create the second input field
                var input2 = document.createElement("input");
                input2.type = "text";
                input2.maxLength = "1";
                input2.className = "code-input";
                input2.setAttribute("inputmode", "numeric");
                input2.addEventListener("input", function () {
                    if (input2.value) input3.focus();
                });
                input2.addEventListener("keydown", function () {
                    if (event.code == "Backspace") input1.focus();
                });

                // Create the third input field
                var input3 = document.createElement("input");
                input3.type = "text";
                input3.maxLength = "1";
                input3.className = "code-input";
                input3.setAttribute("inputmode", "numeric");
                input3.addEventListener("input", function () {
                    if (input3.value) input4.focus();
                });
                input3.addEventListener("keydown", function () {
                    if (event.code == "Backspace") input2.focus();
                });

                // Create the fourth input field
                var input4 = document.createElement("input");
                input4.type = "text";
                input4.maxLength = "1";
                input4.className = "code-input";
                input4.setAttribute("inputmode", "numeric");
                input4.addEventListener("input", function () {
                    if (input4.value && input3.value && input2.value && input1.value) {
                        modalContent.classList.add("loading");
                        xhr.open('POST', '/cart/verifyVerificationCode');
                        xhr.responseType = 'json';
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.onload = function () {
                            if (xhr.response.is_error) {
                                input1.classList.add('error_code');
                                input2.classList.add('error_code');
                                input3.classList.add('error_code');
                                input4.classList.add('error_code');

                                errorBox.textContent = xhr.response.error;
                                modalContent.classList.remove("loading");

                            } else {
                                userPhoneBox.remove();
                                inputBlock.remove();
                                btnReqCode.remove();

                                const text = document.createElement("span");
                                text.textContent = "Идет обновление профиля";

                                errorBox.before(text);

                                setTimeout(() => {
                                    getStateCabinet();
                                }, 2000);

                                function getStateCabinet() {
                                    const xhrP = new XMLHttpRequest();
                                    xhrP.responseType = 'json';
                                    xhrP.open("GET", "/cabinet/getStateCabinet");
                                    xhrP.onload = function () {
                                        if (xhrP.response.is_loaded) {
                                            // location.href = "/cabinet";
                                            ym(61888695, 'reachGoal', 'auth');
                                            if (location.pathname === "/cart") {
                                                location.href = '/order';
                                            } else {
                                                location.reload();
                                            }
                                            modalContent.classList.remove("loading");

                                        } else {
                                            setTimeout(() => {
                                                getStateCabinet();
                                            }, 2000);
                                        }
                                    };
                                    xhrP.send();
                                }
                            }

                        };
                        xhr.send(`code=${input1.value}${input2.value}${input3.value}${input4.value}`);
                    }
                });
                input4.addEventListener("keydown", function () {
                    if (event.code == "Backspace") {
                        input3.focus();
                        input4.value = '';
                    }
                });
                input1.addEventListener("paste", function (event) {
                    const pastedData = event.clipboardData.getData('text');
                    const filteredData = pastedData.replace(/[^0-9]/g, "");
                    const splitData = filteredData.split("");
                    input1.value = splitData[0];
                    input2.value = splitData[1];
                    input3.value = splitData[2];
                    input4.value = splitData[3];
                    input4.dispatchEvent(new Event('input'));
                });
                input2.addEventListener("paste", function (event) {
                    const pastedData = event.clipboardData.getData('text');
                    const filteredData = pastedData.replace(/[^0-9]/g, "");
                    const splitData = filteredData.split("");
                    input1.value = splitData[0];
                    input2.value = splitData[1];
                    input3.value = splitData[2];
                    input4.value = splitData[3];
                    input4.dispatchEvent(new Event('input'));
                });
                input3.addEventListener("paste", function (event) {
                    const pastedData = event.clipboardData.getData('text');
                    const filteredData = pastedData.replace(/[^0-9]/g, "");
                    const splitData = filteredData.split("");
                    input1.value = splitData[0];
                    input2.value = splitData[1];
                    input3.value = splitData[2];
                    input4.value = splitData[3];
                    input4.dispatchEvent(new Event('input'));
                });
                input4.addEventListener("paste", function (event) {
                    const pastedData = event.clipboardData.getData('text');
                    const filteredData = pastedData.replace(/[^0-9]/g, "");
                    const splitData = filteredData.split("");
                    input1.value = splitData[0];
                    input2.value = splitData[1];
                    input3.value = splitData[2];
                    input4.value = splitData[3];
                    input4.dispatchEvent(new Event('input'));
                });
                let second = code.last_request_time ?? 60;
                const timer = document.createElement('span');
                timer.textContent = ` через 60 сек`;
                const btnReqCode = document.createElement("div");
                btnReqCode.className = "catalog-block__in-cart";
                btnReqCode.textContent = `Получить новый код`;
                btnReqCode.append(timer);

                setInterval(() => {
                    if (second > 0) {
                        btnReqCode.classList.add('disabled');
                        timer.classList.remove("hide");
                        second--;
                    } else {
                        btnReqCode.classList.remove('disabled');
                        timer.classList.add("hide");

                    }
                    timer.textContent = ` через ${second} сек`;
                }, 1000);

                btnReqCode.addEventListener('click', async () => {
                    second = 60;
                    const code = await requestCode();
                    if (code.is_error) {
                        errorBox.textContent = code.error;
                    }

                });
                const strText = document.createElement('div');
                strText.textContent = `Введите код из смс или телефонного звонка`;
                strText.className = "strText-modal";


                inputBlock.append(input1, input2, input3, input4);
                text.after(userPhoneBox, inputBlock);
                errorBox.after(strText, btnReqCode);
                input1.focus();
            }

            modalContent.classList.remove("loading");
        };
        xhr.send(`phone=${encodeURIComponent(phoneNumberInput.value)}&token=${myToken}`);
    });

    if (phone && phone != '') {
        phoneNumberInput.value = phone;
        sendPhoneBtn.dispatchEvent(new Event('click'));
    }

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.className = "close-button";
    closeButton.addEventListener("click", function () {
        modal.remove();
    });

    modalContent.appendChild(text);
    modalContent.appendChild(phoneLabel);
    modalContent.appendChild(phoneNumberInput);
    modalContent.appendChild(errorBox);
    modalContent.appendChild(sendPhoneBtn);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(policy);
    modalContent.appendChild(preloader);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);


    PhoneMask("#sigInPhone", phoneMask);



    //Запрос кода 
    async function requestCode() {
        const rawResponse = await fetch("/cart/requestVerificationCode", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: ''

        });
        const content = await rawResponse.json();
        return content;
    }
}


/* Генерация модального окна и вовзрат элементов */

function createModal() {

    const modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const p = document.createElement('p');
    modalContent.appendChild(p);

    const modalButtons = document.createElement('div');
    modalButtons.className = 'modal-buttons';

    const confirmDelete = document.createElement('button');
    confirmDelete.id = 'confirm-delete';
    confirmDelete.textContent = 'Да';
    modalButtons.appendChild(confirmDelete);

    const cancelDelete = document.createElement('button');
    cancelDelete.id = 'cancel-delete';
    cancelDelete.textContent = 'Нет';
    modalButtons.appendChild(cancelDelete);

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.className = "close-button";
    closeButton.addEventListener("click", function () {
        modal.remove();
    });

    modalContent.appendChild(modalButtons);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    return ({ modal, modalContent, p, confirmDelete, cancelDelete });
}


function profile(btnProfile) {
    if (document.querySelector("#myProfile")) {
        document.querySelector("#myProfile").remove();
        return;
    }
    const boxProfile = document.createElement("div");
    boxProfile.className = "profile-box";
    boxProfile.id = "myProfile";
    const myProfile = document.createElement("div");
    myProfile.className = "profile-item";
    myProfile.textContent = "Профиль";

    const myPromo = document.createElement("div");
    myPromo.className = "profile-item";
    myPromo.textContent = "Мои акции";

    const myBonus = document.createElement("div");
    myBonus.className = "profile-item";
    myBonus.textContent = "Бонусы";

    boxProfile.addEventListener("click", () => location.href = '/cabinet');
    myPromo.addEventListener("click", () => location.href = '/cabinet');
    myBonus.addEventListener("click", () => location.href = '/cabinet');

    boxProfile.append(myProfile, myPromo, myBonus);
    btnProfile.closest(".profile").append(boxProfile);

}

/* Отрпавка всех запросов */
async function sendInfo({ url, date }) {
    let rawResponse, content;
    while (true) {
        rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: date
        });
        content = await rawResponse.json();
        if (rawResponse.status === 200) {
            break;
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000)); // ожидание 1 секунду
        }
    }
    return content;
}

var modifiersGroup, modifiers;
async function getModifiers() {
    const modifiersResult = await sendInfo({ url: "/order/getModifiers", date: "" });
    modifiersGroup = modifiersResult["modifiersGroups"];
    modifiers = modifiersResult["modifiers"];
}
let offers;
async function getOffers() {
    offers = await sendInfo({ url: "/order/getOffers", date: "" });
}
getOffers();


/* Получаем инфо о клиенте и смотрим, выбран ли тип доставки и адрес клиента */
document.addEventListener('DOMContentLoaded', async () => {
    const clientInfo = await sendInfo({ url: "/order/getClientInfo", date: "" });
    window.store["clientInfo"] = clientInfo;
    if (clientInfo) {
        if (clientInfo.is_locked_cart && !location.pathname.includes("order")) {
            const modal = createModal();
            modal.p.textContent = "У Вас есть заказ в процессе оформления";
            modal.confirmDelete.textContent = "Изменить";
            modal.confirmDelete.addEventListener("click", async () => {
                const result = await sendInfo({ url: "/order/setNextStep", date: "go_back=1" });
                if (!result.is_error) location.reload();
            });
            modal.cancelDelete.textContent = "Перейти";
            modal.cancelDelete.addEventListener("click", () => {
                location.href = "/order";
            });
            return;
        }


        const points = await sendInfo({ url: "/order/getPoints", date: "" });
        if (Object.values(points).length == 1 && !clientInfo.delivery_method) {
            const filialId = Object.values(points)[0].filial_id;
            await sendInfo({ url: "/order/updateCartInfo", date: `place_filial_id=${filialId}&delivery_method=pickup` });
            if (typeof createHeaderInfo === "function") createHeaderInfo();
        } else if (!clientInfo.delivery_method) {
            createFirstModal(clientInfo);
        } else if (!points[clientInfo.place_filial_id]) {
            createFirstModal(clientInfo);
        } else if (clientInfo.delivery_method === "delivery") {
            if (!clientInfo.address_id && !clientInfo.address_text) {
                createFirstModal(clientInfo);
            } else {
                if (typeof createHeaderInfo === "function") createHeaderInfo();
            }
        } else if (clientInfo.delivery_method === "pickup") {
            if (!clientInfo.place_filial_id) {
                createFirstModal(clientInfo);
            } else {
                if (typeof createHeaderInfo === "function") createHeaderInfo();
            }
        } else {
            if (typeof createHeaderInfo === "function") createHeaderInfo();
        }
        const timeType = clientInfo.delivery_method === "pickup" ? "time_pickup_end" : "time_delivery_end";
        const timeEnd = clientInfo?.workTime[new Date().getDay()]?.[timeType];
        if (timeEnd) document.getElementById('time_end').innerHTML = timeEnd.slice(0, -3);
    }

}, false);

function createFirstModal(clientInfo) {
    if (location.pathname.includes('order')) return;

    if (clientInfo.is_disabled_delivery) {
        createPickup(clientInfo);
        modal.modal.remove();
    }

    const modal = createModal();
    const modalContent = modal.modalContent;

    const btnColose = modalContent.querySelector(".close-button");
    btnColose.addEventListener("click", async () => {
        const points = await sendInfo({ url: "/order/getPoints", date: "" });
        points && Object.values(points)[0] && sendInfo({ url: "/order/updateCartInfo", date: `place_filial_id=${Object.values(points)[0].filial_id}&delivery_method=pickup` });
        if (typeof createHeaderInfo === "function") createHeaderInfo();
    });

    modal.cancelDelete.remove();
    modal.confirmDelete.remove();
    modal.p.remove();

    const modalTitle = createElement("div", "modal-title");
    modalTitle.textContent = "Выберите способ получения";

    const delivery = createElement("div", "btn delivery");
    delivery.textContent = "Доставка";
    const pickup = createElement("div", "btn pick");
    pickup.innerHTML = "Самовывоз <span class='present_pickup'>+ Подарок</span>";

    delivery.addEventListener("click", () => {
        modal.modal.remove();
        createDelivery(clientInfo);
    });
    pickup.addEventListener("click", async () => {
        modal.modal.remove();
        createPickup(clientInfo);
    });

    modalContent.append(modalTitle, delivery, pickup);
}

function createDelivery(clientInfo) {
    const modal = createModal();
    const modalContent = modal.modalContent;
    // modalContent.querySelector(".close-button").remove();
    modal.cancelDelete.remove();
    modal.confirmDelete.remove();
    modal.p.remove();

    const btnColose = modalContent.querySelector(".close-button");
    btnColose.addEventListener("click", () => { if (typeof createHeaderInfo === "function") createHeaderInfo(); });

    const modalTitle = createElement("div", "modal-title");
    modalTitle.textContent = "";

    const address = clientInfo.address;
    if (!address) {
        modal.modal.remove();
        globalThis.address.createAddress('send_type');
    } else {
        modalTitle.textContent = "Выберите адрес";

        const addressBox = createElement("div", "filialBox");


        for (const id in address) {
            const addressItem = createElement("div", "filialPoint");
            const addressName = createElement("div", "filialName");
            addressName.textContent = address[id].name;
            const addressText = createElement("div", "filialAdd");
            addressText.textContent = address[id]?.arr?.join(", ");
            addressItem.append(addressName, addressText);
            addressItem.addEventListener("click", () => {
                addressBox.querySelectorAll(".filialPoint").forEach(el => { el.classList.remove("selected"); });
                addressItem.classList.add("selected");
                sendInfo({ url: "/order/updateCartInfo", date: `address_id=${address[id].id}&delivery_method=delivery` });
            });
            addressBox.append(addressItem);
        }

        /* Кнопочка добавить новый */

        const addressItem = createElement("div", "filialPoint");
        const addressName = createElement("div", "filialName");
        addressName.textContent = "Добавить новый адрес";
        const addressText = createElement("div", "filialAdd");
        addressText.textContent = "";
        addressItem.append(addressName, addressText);
        addressItem.addEventListener("click", () => {
            modal.modal.remove();
            globalThis.address.createAddress(true);
        });
        addressBox.append(addressItem);

        const btnContinue = createElement("div", "btn btnContinue");
        btnContinue.textContent = "Продолжить";
        btnContinue.addEventListener("click", () => {
            if (!addressBox.querySelector(".selected")) return;
            modal.modal.remove();
            setTimeout(() => {
                if (typeof createHeaderInfo === "function") createHeaderInfo();
            }, 1000);
        });
        modalContent.append(modalTitle, addressBox, btnContinue);
    }
}

function updateFooterIP(ipInfo) {
    const footerFilialSelectedDiv = document.getElementById('footer_selected_filial_ip');
    if (footerFilialSelectedDiv) {
        footerFilialSelectedDiv.innerHTML = `ИП: ${ipInfo.ip_name ?? ''} <br>
                    ИНН: ${ipInfo.ip_inn ?? ''} <br>
                    ОГРНИП: ${ipInfo.ip_ogrnip ?? ''} <br>
                    ${ipInfo.ip_reg_city}`

    }
}

async function createPickup(clientInfo) {

    const modal = createModal();
    const modalContent = modal.modalContent;
    // modalContent.querySelector(".close-button").remove();
    modal.cancelDelete.remove();
    modal.confirmDelete.remove();
    modal.p.remove();

    const btnColose = modalContent.querySelector(".close-button");
    btnColose.addEventListener("click", () => { if (typeof createHeaderInfo === "function") createHeaderInfo(); });

    const modalTitle = createElement("div", "modal-title");
    modalTitle.textContent = "Выберите филиал";

    const errorText = createElement("div", "error");

    const points = await sendInfo({ url: "/order/getPoints", date: "" });
    const filialsBox = createElement("div", "filialBox");
    let filialId = '';

    let count = 0;

    for (const id in points) {
        count++;
        const filialPoint = createElement("div", "filialPoint");
        const filialName = createElement("div", "filialName");
        filialName.textContent = points[id].filial_name;
        const filialAdderess = createElement("div", "filialAdd");
        filialAdderess.textContent = points[id].address;
        filialPoint.append(filialName, filialAdderess);
        filialPoint.addEventListener("click", () => {
            filialsBox.querySelectorAll(".filialPoint").forEach(el => { el.classList.remove("selected"); });
            filialPoint.classList.add("selected");
            filialId = id;

        });
        filialsBox.append(filialPoint);
    }
    if (Object.values(points).length === 1) {
        filialsBox.querySelector(".filialPoint").click();
    }

    if (count == 1) {
        if (!filialsBox.querySelector(".selected")) {
            errorText.textContent = "Не выбран филиал";
            return;
        }
        sendInfo({ url: "/order/updateCartInfo", date: `place_filial_id=${filialId}&delivery_method=pickup` });
        setTimeout(() => {
            if (typeof createHeaderInfo === "function") createHeaderInfo();
        }, 1000);

        modal.modal.remove();
    }

    const btnContinue = createElement("div", "btn btnContinue");
    btnContinue.textContent = "Продолжить";
    btnContinue.addEventListener("click", () => {
        if (!filialsBox.querySelector(".selected")) {
            errorText.textContent = "Не выбран филиал";
            return;
        }
        sendInfo({ url: "/order/updateCartInfo", date: `place_filial_id=${filialId}&delivery_method=pickup` });
        updateFooterIP(points[filialId]);
        setTimeout(() => {
            if (typeof createHeaderInfo === "function") createHeaderInfo();
        }, 1000);

        modal.modal.remove();
    });
    modalContent.append(modalTitle, filialsBox, btnContinue, errorText);

}



function createElement(tag, setClass) {
    const elem = document.createElement(tag);
    elem.className = setClass;
    return elem;
}


function hideInfo() {
    document.querySelector('.info').style.display = 'none';
    sessionStorage.isInfoCanceled = true;
}

// document.addEventListener("DOMContentLoaded", () => {
//     if (!sessionStorage.isInfoCanceled) {
//         document.querySelector('.info').style.display = '';
//     } else {
//         document.querySelector('.info').style.display = 'none';
//     }
// });


function capitalizeSentences(text) {
    // Разделяем текст на предложения
    const sentences = text.split('. ');

    // Преобразуем каждое предложение
    const transformedSentences = sentences.map(sentence => {
        // Преобразуем все буквы в нижний регистр
        const lowerCaseSentence = sentence.toLowerCase();
        // Получаем первую букву предложения и преобразуем её в заглавную
        const firstLetter = lowerCaseSentence.charAt(0).toUpperCase();
        // Объединяем первую заглавную букву с остальными символами предложения
        const transformedSentence = firstLetter + lowerCaseSentence.slice(1);
        return transformedSentence;
    });

    // Объединяем преобразованные предложения в одну строку
    const result = transformedSentences.join('. ');

    return result;
}
