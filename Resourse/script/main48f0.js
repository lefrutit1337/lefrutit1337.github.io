let bannerList = true;
getModifiers();

try {
    window.onload = function () {
        setTimeout(() => {
            lazyLoading();
        }, 200);

        document.querySelectorAll('.info_product').forEach(el => {
            el.addEventListener('click', () => {
                event.preventDefault();
            });
        });

    };

} catch (err) {
    document.addEventListener('DOMContentLoaded', () => {

        const xhr = new XMLHttpRequest();
        xhr.open("GET", "App/Settings/settings.json");
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            reactionList = xhr.response.reaction_list;
        };
        xhr.send();


        setTimeout(() => {
            lazyLoading();
        }, 200);

        document.querySelectorAll('.info_product').forEach(el => {
            el.addEventListener('click', () => {
                event.preventDefault();
            });
        });
    });

}




function lazyLoading() {
    const AllImg = document.querySelectorAll(".lazyImg");
    if (AllImg.length == 0) return;
    const WindowHieght = window.innerHeight;
    AllImg.forEach(el => {
        if (el.classList.contains("svg_lazy") && !el.classList.contains("lazy_loading")) {
            const ElPosition = el.getBoundingClientRect();
            if (ElPosition.top < (WindowHieght * 1.5)) {
                const ImageLoad = new Image();
                ImageLoad.src = el.dataset.src;
                el.classList.add('lazy_loading');
                ImageLoad.onload = function () {
                    el.src = this.src;
                    el.classList.remove("svg_lazy");
                    el.classList.remove('lazy_loading');
                };
                ImageLoad.error = function () {
                    setTimeout(() => {
                        ImageLoad.src = el.dataset.src;
                    }, 1000);
                };
            }
        }
    });

    let LoadImage = setTimeout(function tick() {
        const NoLoadImage = document.querySelectorAll(".svg_lazy");
        if (!NoLoadImage[0]) return;
        if (NoLoadImage[0].classList.contains("svg_lazy") && !NoLoadImage[0].classList.contains("lazy_loading")) {
            NoLoadImage[0].src = NoLoadImage[0].dataset.src;
            NoLoadImage[0].classList.add("lazy_loading");
            const ImageLoad = new Image();
            ImageLoad.onload = function () {
                NoLoadImage[0].src = this.src;
                NoLoadImage[0].classList.remove("svg_lazy");
                NoLoadImage[0].classList.remove("lazy_loading");
                LoadImage = setTimeout(tick, 300);
            };
            ImageLoad.onerror = function () {
                console.log("ERROR");
                setTimeout(() => {
                    ImageLoad.src = NoLoadImage[0].dataset.src;
                }, 1000);
            };
            ImageLoad.src = NoLoadImage[0].dataset.src;
        }
    }, 1000);


    window.addEventListener("scroll", () => {
        setTimeout(() => {
            AllImg.forEach(el => {
                const ElPosition = el.getBoundingClientRect();
                if (el.classList.contains("svg_lazy") && !el.classList.contains("lazy_loading")) {
                    if (ElPosition.top < (WindowHieght * 1.5) && ElPosition.top > (-(WindowHieght / 3))) {
                        const ImageLoad = new Image();
                        ImageLoad.onload = function () {
                            el.src = this.src;
                            el.classList.remove("svg_lazy");
                            el.classList.remove('lazy_loading');
                        };
                        ImageLoad.error = function () {
                            setTimeout(() => {
                                ImageLoad.src = el.dataset.src;
                            }, 1000);
                        };
                        ImageLoad.src = el.dataset.src;
                        el.classList.add('lazy_loading');
                    }
                }
            });
        }, 0);
    });
}

async function createHeaderInfo() {
    const clientInfo = await sendInfo({ url: "/order/getClientInfo", date: "" });
    const points = await sendInfo({ url: "/order/getPoints", date: "" });

    const root = document.querySelector(".nav_address_client");
    root.innerHTML = "";
    // const rootMobile = document.querySelector(".nav_address_client-mobile");
    // rootMobile.innerHTML = "";

    const rootRender = renderToolBar(clientInfo, points);
    const rootModalRender = renderToolBar(clientInfo, points);

    root.append(rootRender.boxAddress, rootRender.btnBox);
    // rootMobile.append(rootModalRender.addressInfo, rootModalRender.btnBox)
    const timeType = clientInfo.delivery_method === "pickup" ? "time_pickup_end" : "time_delivery_end";
    const timeEnd = clientInfo?.workTime[new Date().getDay()]?.[timeType];
    if (timeEnd) document.getElementById('time_end').innerHTML = timeEnd.slice(0, -3);
}

const renderToolBar = (clientInfo, points) => {

    const addressInfo = createElement("div", "address_info");
    const boxAddress = createElement("div", "box_address");
    const icon = createElement("img", "icon-address-info");
    icon.setAttribute('alt', 'Адрес');
    icon.src = (clientInfo.delivery_method === "delivery") ? "/Resourse/media/delivery.png" : "/Resourse/media/pickup.png";

    const addressBox = createElement("div", "address_box");
    const addressType = createElement("div", "address_type");
    addressType.textContent = (clientInfo.delivery_method === "delivery") ? "Доставка" : "Самовывоз";
    const addressText = createElement("div", "address_text");

    const waitingTime = createElement("div", "address_info");
    const waitingBox = createElement("div", "address_box");
    const waitingType = createElement("div", "address_type");
    waitingType.textContent = "Среднее время ожидания";
    const waitingText = createElement("div", "address_text");
    waitingText.textContent = `на ${(clientInfo.delivery_method === "delivery") ? "доставку" : "самовывоз"} ${(clientInfo.delivery_method === "delivery")? points[clientInfo.place_filial_id].time_default_delivery ?? 75 : points[clientInfo.place_filial_id].time_default_pickup ?? 30} минут`;
    const iconWt = createElement("img", "icon-address-info");
    iconWt.setAttribute('alt', 'Адрес');
    iconWt.src = (clientInfo.delivery_method === "delivery") ? "/Resourse/media/delivery_wt.svg" : "/Resourse/media/pickup_wt.svg";

   
    waitingTime.append(iconWt)
    // const clientAddress = clientInfo.address_text ? clientInfo.address_text : clientInfo.address?  clientInfo.address[clientInfo.address_id]?.arr?.join(", ") : "";
    waitingBox.append(waitingType, waitingText)
    waitingTime.append(waitingBox)
    let textAddress = '';
    if (clientInfo.address) {
        if (typeof clientInfo.address === 'object') {
            clientInfo.address = Object.values(clientInfo.address);
        }
        const selectAddress = clientInfo.address.find(address => address.id == clientInfo.address_id);
        textAddress = selectAddress?.arr?.join(", ");
    }

    const clientAddress = clientInfo.address_text ? clientInfo.address_text : textAddress ?? "";

    addressText.textContent = (clientInfo.delivery_method === "delivery") ? clientAddress : points[clientInfo.place_filial_id]?.address ?? "Не удалось определить филиал";
    const addressEdit = createElement("div", "address_edit");
    addressEdit.textContent = "Изменить";
    addressEdit.addEventListener("click", () => {
        if (clientInfo.delivery_method === "delivery") {
            createDelivery(clientInfo);
        } else {
            createPickup(clientInfo);
        }
    });

    addressType.append(addressEdit);
    addressBox.append(addressType, addressText);
    addressInfo.append(icon, addressBox);

    const btnBox = createElement("div", "btn-box");
    const btnPickup = createElement("div", "btn-piskup");
    btnPickup.textContent = `Самовывоз`;
    const btnDelivery = createElement("div", "btn-delivery");
    btnDelivery.textContent = "Доставка";
    if (clientInfo.is_disabled_delivery) {
        btnBox.append(btnPickup);
    } else {
        btnBox.append(btnPickup, btnDelivery);
    }


    if (clientInfo.delivery_method === "delivery") {
        btnPickup.classList.remove("selected_method");
        btnDelivery.classList.add("selected_method");
    } else {
        btnPickup.classList.add("selected_method");
        btnDelivery.classList.remove("selected_method");
    }

    addressInfo.addEventListener("mouseover", function () {
        if (document.getElementById("tooltip")) document.getElementById("tooltip").remove();
        var tooltip = document.createElement("span");
        tooltip.innerText = "Мы хотим показать вам только актуальные продукты. Для отображения продуктов, которые мы сможем привезти, выберите вариант доставки или самовывоз.";
        tooltip.id = "tooltip";

        tooltip.style.position = "absolute";
        tooltip.style.backgroundColor = "#555";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "5px";
        tooltip.style.borderRadius = "5px";
        tooltip.style.opacity = "0";
        tooltip.style.transition = "opacity 0.3s";

        document.body.appendChild(tooltip);

        var tooltipWidth = tooltip.offsetWidth;
        var tooltipHeight = tooltip.offsetHeight;
        var elementWidth = addressInfo.offsetWidth;
        var elementHeight = addressInfo.offsetHeight;
        var elementTop = getOffsetTop(addressInfo);
        var elementLeft = addressInfo.offsetLeft;
        console.log(elementTop);

        tooltip.style.top = (elementTop + elementHeight + 5) + "px";
        const totalLeft =  (elementLeft + (elementWidth / 2) - (tooltipWidth / 2));
        tooltip.style.left = (totalLeft < 0 ? 0 : totalLeft) + "px";
        tooltip.style.opacity = "1";
    });
    function getOffsetTop(element) {
        let offsetTop = 0;
      
        // Проходим по всем родительским элементам
        while (element) {
          offsetTop += element.offsetTop;
          element = element.offsetParent;
        }
      
        return offsetTop;
      }

    addressInfo.addEventListener("mouseout", function () {
        if (document.getElementById("tooltip")) document.getElementById("tooltip").remove();
    });

    btnPickup.addEventListener("click", () => {
        if (btnPickup.classList.contains("selected_method")) return;
        btnPickup.classList.add("selected_method");
        btnDelivery.classList.remove("selected_method");
        createPickup(clientInfo);
    });
    btnDelivery.addEventListener("click", () => {
        if (btnDelivery.classList.contains("selected_method")) return;
        btnPickup.classList.remove("selected_method");
        btnDelivery.classList.add("selected_method");
        createDelivery(clientInfo);
    });
    boxAddress.append(addressInfo, waitingTime)
    return ({ boxAddress, btnBox });
};


function updateproduct(list) {

    // document.querySelectorAll('.catalog-block__item').forEach(el => {
    //     try {
    //         el.querySelector('.product_in_cart').classList.add("hide");
    //         el.querySelector('.in_not_cart').classList.remove("hide");
    //     } catch (error) {
    //         console.log(el)
    //     }

    // });

    // for (let id in list) { 
    //     try {

    //         const product = document.querySelector(`div[data-productid="${id}"]`);
    //         const priceBox = product.querySelector('.product_in_cart');
    //         if (priceBox.classList.contains('hide')) {
    //             priceBox.querySelector('input').textContent = list[id].count;
    //             priceBox.classList.remove("hide");
    //             product.querySelector('.in_not_cart').classList.add('hide');
    //         }
    //     } catch (error) {}
    // }


}
