(async function () {
    const rootPresent = document.getElementById("present");
    const presentList = document.getElementById("present_list");
    if (!rootPresent) { return; }

    const result = await sendInfo({ url: "/cart/present", date: "" });
    if (!result) return;
    // const present = Object.values(result);
    // present.sort((a, b) => a.min_price - b.min_price);
    // console.log(present);

    //ДЛЯ ТЕСТА
    const present = [{ min_price: 1000, add:[{product_id:9015, count:1}]}, { min_price: 1500, add:[{product_id:9015, count:1}]}, { min_price: 2000, add:[{product_id:9015, count:1}] }];

    // renderPresent(present);
    function renderPresent(present) {

        const maxMinPrice = Math.max(...present.map((present) => present.min_price));

        const svgNS = "http://www.w3.org/2000/svg"; // пространство имен для элементов SVG

        //Берем сумму на момент генерации
        const totalSum = document.querySelector('.cart__inner-box').querySelector('.cart__inner_total').querySelector('span').textContent;

        // создаем SVG элементы для шкалы
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttributeNS(null, "width", "100%");
        svg.setAttributeNS(null, "height", "60px");

        const gradient = document.createElementNS(svgNS, "linearGradient");
        gradient.setAttributeNS(null, "id", "gradient");
        gradient.setAttributeNS(null, "x1", "0%");
        gradient.setAttributeNS(null, "y1", "0%");
        gradient.setAttributeNS(null, "x2", "100%");
        gradient.setAttributeNS(null, "y2", "0%");

        const stop1 = document.createElementNS(svgNS, "stop");
        stop1.setAttributeNS(null, "offset", "0%");
        stop1.setAttributeNS(null, "stop-color", "#ADD64A");

        const stop2 = document.createElementNS(svgNS, "stop");
        stop2.setAttributeNS(null, "offset", "50%");
        stop2.setAttributeNS(null, "stop-color", "#FFC800");

        const stop3 = document.createElementNS(svgNS, "stop");
        stop3.setAttributeNS(null, "offset", "100%");
        stop3.setAttributeNS(null, "stop-color", "#F63F36");

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);


        const lineDef = document.createElementNS(svgNS, "rect");

        lineDef.setAttributeNS(null, "width", "100%");
        lineDef.setAttributeNS(null, "height", "9px");
        lineDef.setAttributeNS(null, "fill", "gray");
        lineDef.setAttributeNS(null, "x", "0%");
        lineDef.setAttributeNS(null, "y", "50%");
        lineDef.classList.add("rect-anim");

        const line = document.createElementNS(svgNS, "rect");
        line.setAttributeNS(null, "width", "100%");
        line.setAttributeNS(null, "height", "9px");
        line.setAttributeNS(null, "fill", "url(#gradient)");
        line.setAttributeNS(null, "y", "50%");
        svg.appendChild(gradient);
        svg.appendChild(line);
        svg.appendChild(lineDef);

        // создаем SVG элементы для иконок подарков
        present.forEach((item, index) => {

            const presentPosition = (item.min_price / maxMinPrice) * 100;
            const presentIcon = document.createElementNS(svgNS, "svg");
            presentIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            presentIcon.setAttribute("x", `calc(${presentPosition}% - 56px)`);
            presentIcon.setAttribute("y", "0");
            presentIcon.setAttribute("width", "56");
            presentIcon.setAttribute("height", "56");
            presentIcon.setAttribute("viewBox", "0 0 56 56");

            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("height", "56");
            rect.setAttribute("width", "56");
            rect.setAttribute("fill", "#BDC5BE")
            rect.setAttribute("rx", "2.8")

            const iconPath = document.createElementNS(svgNS, "path");
            iconPath.setAttribute("stroke", "white");
            iconPath.setAttribute("stroke-width", "2.30824");
            iconPath.setAttribute("stroke-linecap", "round");
            iconPath.setAttribute("stroke-linecap", "linejoin");
            iconPath.setAttribute("fill", "none");
            iconPath.setAttribute("d", `M40.5221 20.5334H15.4777C13.5017 
                20.5334 11.8999 22.1353 11.8999 24.1112V42.0001C11.8999 43.9761 13.5017 45.5779 15.4777 
                45.5779H40.5221C42.4981 45.5779 44.0999 43.9761 44.0999 42.0001V24.1112C44.0999 22.1353
                42.4981 20.5334 40.5221 20.5334Z`);

            const iconPath2 = document.createElementNS(svgNS, "path");
            iconPath2.setAttribute("stroke", "white");
            iconPath2.setAttribute("stroke-width", "2.30824");
            iconPath2.setAttribute("stroke-linecap", "round");
            iconPath2.setAttribute("stroke-linecap", "linejoin");
            iconPath2.setAttribute("fill", "none");
            iconPath2.setAttribute("d", `M27.9999 15.1667C27.9999 14.1053 27.6852 13.0677
             27.0955 12.1852C26.5058 11.3026 25.6676 10.6148 24.687 10.2086C23.7063 9.80237 22.6273 9.6961 21.5863 
             9.90317C20.5452 10.1102 19.589 10.6214 18.8384 11.3719C18.0879 12.1225 17.5768 13.0787 17.3697 14.1197C17.1626 
             15.1608 17.2689 16.2398 17.6751 17.2205C18.0813 18.2011 18.7691 19.0392 19.6517 19.6289C20.5342 20.2186 21.5718 
             20.5334 22.6332 20.5334M27.9999 15.1667C27.9999 14.1053 28.3147 13.0677 28.9043 12.1852C29.494 11.3026 30.3322 
             10.6148 31.3128 10.2086C32.2935 9.80237 33.3725 9.6961 34.4136 9.90317C35.4546 10.1102 36.4108 10.6214 37.1614 
             11.3719C37.9119 12.1225 38.423 13.0787 38.6301 14.1197C38.8372 15.1608 38.7309 16.2398 38.3247 17.2205C37.9185 18.2011 
             37.2307 19.0392 36.3481 19.6289C35.4656 20.2186 34.428 20.5334 33.3666 20.5334M27.9999 15.1667V45.5778M44.0999 33.0556H11.8999`);

            presentIcon.append(rect,iconPath, iconPath2);
            svg.appendChild(presentIcon);


            present[index]["rect"] = rect;
        });

        rootPresent.appendChild(svg);


        //Лист подарков
        
        present.forEach((pr, index) => {
            pr.add.forEach(prod =>{
                const offer = JSON.parse(offers[prod.product_id]);
                console.log(offer);
                const cartOrderBox = createElement("div", "cart__order-box no-present");
                const cartOrderItem = createElement("div", "cart__order-item");

                const cartOrderImg = createElement("div", "cart__order-img");
                const aHref = createElement("a", "");
                const img = createElement("img", "");
                img.src = offer.picture
                aHref.appendChild(img)
                cartOrderImg.appendChild(aHref);

                const cartOrderTitleBox = createElement("div", "cart__order-title-box");
                const cartOrderTitle = createElement("div", "cart__order-title");
                const aTitle = createElement("a", "");
                const h2Title = createElement("h2", "");

                const preTitle = createElement("div", "cart__order-pretitle");
                preTitle.textContent = `В подарок от ${pr.min_price}`;
                h2Title.textContent = offer.name;
                aTitle.appendChild(h2Title);
                cartOrderTitle.append(aTitle, preTitle);
                cartOrderTitleBox.appendChild(cartOrderTitle);


                cartOrderItem.append(cartOrderImg,cartOrderTitleBox )
                cartOrderBox.append(cartOrderItem)

                presentList.appendChild(cartOrderBox)
                present[index]["prod"] = cartOrderBox;

            })
        })     
       
        window.setPresentLoad = function (sum) {
            let percent = ((Number(sum) / Number(maxMinPrice)) * 100);
            lineDef.setAttributeNS(null, "x", `calc(${percent}% - 27px)`);
            present.forEach(el =>{
                if(el.min_price <= sum) {
                    el.rect.setAttribute("fill", "#ADD64A");
                } else {
                    el.rect.setAttribute("fill", "#BDC5BE");
                }
            })
        };

        window.setPresentLoad(totalSum);
    }

})();


