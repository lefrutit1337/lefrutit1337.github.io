document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        lazyBanner();
    }, 1000);
    //const browser = get_browser();
    var MyEvent;

    try {
        MyEvent = new EventTarget();
    } catch (error) {
        MyEvent = document.createDocumentFragment();
    }

    const transform = new Object();
    var count_item = 0;
    const sliderBox = document.querySelector(".slider-container");
    if (!sliderBox) return;
    const corusel = sliderBox.querySelector(".slider-container__corousel");
    MyEvent["maxwidth"] = document.querySelector("body");
    MyEvent["padding"] = parseInt(getComputedStyle(MyEvent["maxwidth"]).paddingLeft)

    const AllSliderItem = corusel.querySelectorAll(".slider-container__item");
    const ArraySliderItem = Array.from(AllSliderItem);
    const countSlidetItem = AllSliderItem.length;
    const sliderList = document.querySelector('.banner_list');

    for (let i = 0; i < countSlidetItem; i++) {
        const li = document.createElement("li");

        li.addEventListener('click', () => {

            const activeBannerIndex = ArraySliderItem.indexOf(document.querySelector('.active_item'));
            document.querySelector('.active_item').classList.remove('active_item')
            if (activeBannerIndex < i) {
                transform["pos"] = transform["pos"] + ((activeBannerIndex - i) * transform["width_item"])
            } else if (activeBannerIndex > i) {
                transform["pos"] = transform["pos"] - ((i - activeBannerIndex) * transform["width_item"])
            }

            corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`;
            AllSliderItem[i].classList.add('active_item');

            document.querySelector('.bannerPointActive').classList.remove('bannerPointActive');
            li.classList.add('bannerPointActive');
            clearInterval(Slider_TineNext.timeset);
            Slider_TineNext();
            count_item = i;
        })

        sliderList.append(li);
    }

    const sliderListLi = sliderList.querySelectorAll('li');

    AllSliderItem[count_item].classList.add("active_item");
    sliderListLi[count_item].classList.add('bannerPointActive');
    transform["width_item"] = AllSliderItem[count_item].offsetWidth; //todo
    transform["width_items"] = transform["width_item"] * AllSliderItem.length; //todo

    transform["pos"] = ((MyEvent["maxwidth"].offsetWidth - (MyEvent["padding"] * 2)) - transform["width_item"]) / 2; //todo

    const cloneOne = AllSliderItem[0].cloneNode(true);
    const cloneTwo = AllSliderItem[AllSliderItem.length - 1].cloneNode(true);

    cloneOne.classList.add("CloneOne");
    cloneOne.classList.remove("active_item");
    cloneTwo.classList.add("CloneTwo");
    cloneTwo.classList.remove("active_item");
    setTimeout(() => {
        AllSliderItem[0].before(cloneTwo);
        AllSliderItem[AllSliderItem.length - 1].after(cloneOne);
    }, 10);

    transform["pos"] = ((MyEvent["maxwidth"].offsetWidth - (MyEvent["padding"] * 2)) - transform["width_item"]) / 2;
    transform["pos"] = transform["pos"] - transform["width_item"]; //todo
    transform["minTransform"] = transform["pos"]; //todo
    transform["maxTransform"] = transform["pos"] - transform["width_items"]; //todo

    MyEvent["slider_btn_left"] = sliderBox.querySelector(".left");
    MyEvent["slider_btn_right"] = sliderBox.querySelector(".right");

    corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`; //todo

    setTimeout(() => {
        transform["pos"] = ((MyEvent["maxwidth"].offsetWidth - (MyEvent["padding"] * 2)) - transform["width_item"]) / 2;; //todo
        transform["width_item"] = AllSliderItem[count_item].offsetWidth; //todo
        transform["width_items"] = transform["width_item"] * AllSliderItem.length; //todo
        transform["pos"] = transform["pos"] - transform["width_item"]; //todo
        transform["minTransform"] = transform["pos"]; //todo
        transform["maxTransform"] = transform["pos"] - transform["width_items"]; //todo
        corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`; //todo
    }, 1000);


    MyEvent["slider_btn_left"].addEventListener("click", () => {
        if (bannerList) {
            bannerList = false;
            AllSliderItem[count_item].classList.remove("active_item");
            sliderListLi[count_item].classList.remove('bannerPointActive');
            if (count_item != 0) {
                count_item--;
                AllSliderItem[count_item].classList.add("active_item");
                sliderListLi[count_item].classList.add('bannerPointActive');
                transform["pos"] += transform["width_item"];
                corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`;
            } else {
                transform["pos"] += transform["width_item"];
                corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`;
                setTimeout(() => {
                    corusel.style.transitionDuration = "none";
                    corusel.style.transition = "none";
                    corusel.style.transform = `translate3d(${transform["maxTransform"] +  transform["width_item"]}px, 0px, 0px)`;

                }, 240);
                setTimeout(() => {
                    count_item = AllSliderItem.length - 1;
                    AllSliderItem[count_item].classList.add("active_item");
                    sliderListLi[count_item].classList.add('bannerPointActive');
                    transform["pos"] = transform["maxTransform"] + transform["width_item"];
                    corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`;
                    corusel.style.transitionDuration = "0ms";
                    corusel.style.transition = "transform 300ms ease-out 0s";
                }, 350);
            }
            clearInterval(Slider_TineNext.timeset);
            Slider_TineNext();
            setTimeout(() => {
                bannerList = true;
            }, 400);
        }

    });
    MyEvent["slider_btn_right"].addEventListener("click", () => {

        if (bannerList) {
            bannerList = false;
            AllSliderItem[count_item].classList.remove("active_item");
            sliderListLi[count_item].classList.remove('bannerPointActive');
            if (count_item != (AllSliderItem.length - 1)) {
                count_item++;
                AllSliderItem[count_item].classList.add("active_item");
                sliderListLi[count_item].classList.add('bannerPointActive');
                transform["pos"] -= transform["width_item"];
                corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`;
            } else {
                transform["pos"] -= transform["width_item"];
                corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`;
                setTimeout(() => {
                    corusel.style.transitionDuration = "none";
                    corusel.style.transition = "none";
                    corusel.style.transform = `translate3d(${transform["minTransform"]}px, 0px, 0px)`;
                }, 240);
                setTimeout(() => {
                    count_item = 0;
                    AllSliderItem[count_item].classList.add("active_item");
                    sliderListLi[count_item].classList.add('bannerPointActive');
                    transform["pos"] = transform["minTransform"];
                    corusel.style.transform = `translate3d(${transform["pos"]}px, 0px, 0px)`;
                    corusel.style.transitionDuration = "0ms";
                    corusel.style.transition = "transform 300ms ease-out 0s";
                }, 350);
            }

            clearInterval(Slider_TineNext.timeset);
            Slider_TineNext()

            setTimeout(() => {
                bannerList = true;
            }, 400);
        }

    });


    const Slider_TineNext = function() {
        Slider_TineNext.timeset = setInterval(() => {
            MyEvent["slider_btn_right"].click();
        }, 7000);
    }
    Slider_TineNext();

    window.addEventListener("resize", () => {
        setTimeout(() => {
            MyEvent["padding"] = parseInt(getComputedStyle(MyEvent["maxwidth"]).paddingLeft)
            transform["pos"] = ((MyEvent["maxwidth"].offsetWidth - (MyEvent["padding"] * 2)) - transform["width_item"]) / 2; //todo
            transform["width_item"] = AllSliderItem[count_item].offsetWidth; //todo
            transform["width_items"] = transform["width_item"] * AllSliderItem.length; //todo
            transform["pos"] = transform["pos"] - transform["width_item"]; //todo
            transform["minTransform"] = transform["pos"]; //todo
            transform["maxTransform"] = transform["pos"] - transform["width_items"]; //todo
            corusel.style.transform = `translate3d(${ transform["pos"]}px, 0px, 0px)`; //todo
            AllSliderItem[count_item].classList.remove("active_item");
            sliderListLi[count_item].classList.remove('bannerPointActive');
            count_item = 0;
            AllSliderItem[count_item].classList.add("active_item");
            sliderListLi[count_item].classList.add('bannerPointActive');
        }, 100);
    })

    setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
    }, 1000);



    AllSliderItem.forEach(el => {
        swipe(el, { maxTime: 2000, minTime: 10, maxDist: 1500, minDist: 5 });
        el.addEventListener("swipe", function() {
            if (event.detail.dir == 'right') document.querySelector('.left').click();
            if (event.detail.dir == 'left') document.querySelector('.right').click();
        });
    })
   
});

window.addEventListener("orientationchange", function() {
    setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
    }, 100);

}, false);


function lazyBanner() {
    document.querySelectorAll('.slider-container__item').forEach(el => {
        const img = el.querySelector('img');

        const ImageLoad = new Image();
        ImageLoad.src = img.dataset.src;
        ImageLoad.onload = function() {
            img.src = this.src;
        }
        ImageLoad.error = function() {
            setTimeout(() => {
                ImageLoad.src = img.dataset.src;
            }, 1000);
        }

    });
}

//////////////////
/////////////
////////////////
///
///
//