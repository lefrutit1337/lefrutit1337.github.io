document.addEventListener("DOMContentLoaded", () => {
    const AllPromo = document.querySelectorAll(".promo__body");
    const AllModal = document.querySelectorAll(".close_modal");
    AllPromo.forEach(el => {
        el.addEventListener("click", () => {
            console.log(el);
            const id = el.dataset.name;
            document.querySelector(`#${id}`).classList.remove("hide");
        });
    });
    AllModal.forEach(el => {
        el.addEventListener("click", () => {
            console.log(el);
            el.closest(".promo__modal").classList.add("hide");
        });
    })

    document.querySelectorAll('.promo__body-img').forEach(el => {
        console.log(el);
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


});

////////////////////////////////////////////////////