class Address {
    constructor() {
        this.addressText = null;
        this.inputStreet = null;
        this.inputHouse = null;
        this.inputApartament = null;
        this.inputFloor = null;
        this.streetId = null;
        this.houseId = null;
        this.apartamentId = null;
        this.addressType = null;
        this.inputAddressName = null;
        this.inputEnterance = null;
        this.inputEnteranceCode = null;

        this.checkBoxHouse = null;

        this.sendMethod = false;

        this.workIntercom = null;
        this.intercomeCodeInput = null;

        /* Кнопки */
        this.btnHouse = null;
        this.btnApartament = null;
        this.btnContinue = null;

        /* Модалка */
        this.modalContent = null;

        /* Контейнеры */
        this.streetBox = null;
        this.hauseBox = null;
        this.apartamentBox = null;

        this.step = 1;

        this.isManualu = false;

    };

    createAddress(send_method = null) {

        const _this = this;
        if (send_method) {
            _this.sendMethod = true;
        }
        const modal = createModal();
        modal.modalContent.querySelector("p").remove();
        modal.modalContent.querySelector(".modal-buttons").remove();
        const btnColose = modal.modalContent.querySelector(".close-button");
        btnColose.addEventListener("click", () => { createHeaderInfo(); _this.removeState(); });
        _this.modalContent = modal.modalContent;



        const addressName = document.createElement("div");
        addressName.className = "address-name";
        _this.inputAddressName = document.createElement("input");
        _this.inputAddressName.setAttribute("placeholder", "Название");
        _this.inputAddressName.setAttribute("data-name", "");
        addressName.appendChild(_this.inputAddressName);

        _this.btnApartament = document.createElement("div");
        _this.btnApartament.className = "btn-setType";
        _this.btnApartament.textContent = "Квартира";
        _this.btnApartament.setAttribute("data-apartament", "");
        _this.btnApartament.id = "confirm-delete";

        _this.btnHouse = document.createElement("div");
        _this.btnHouse.className = "btn-setType";
        _this.btnHouse.textContent = "Частный дом";
        _this.btnHouse.setAttribute("data-home", "");
        _this.btnHouse.id = "confirm-delete";

        _this.btnApartament.addEventListener("click", () => {
            _this.addressType = "apartament";
            _this.btnHouse?.classList.add("hide");
            _this.btnApartament.disabled = true;
            _this.btnApartament.classList.add("disabled");
            _this.searchAddress();
        });

        _this.btnHouse.addEventListener("click", () => {
            _this.addressType = "house";
            _this.btnApartament?.classList.add("hide");
            _this.btnHouse.disabled = true;
            _this.btnHouse.classList.add("disabled");
            _this.searchAddress();
        });

        const btnBox = document.createElement("div");
        btnBox.append(_this.btnApartament, _this.btnHouse);

        this.modalContent.append(addressName);
        _this.addressType = "apartament";
        _this.searchAddress();
    }

    searchAddress(is_error = false) {
        const _this = this;
        _this.step++;

        if (this.modalContent.querySelector(".searchStreet")) {
            this.modalContent.querySelector(".searchStreet").remove();
            this.modalContent.querySelector("#confirm-delete").remove();
        }

        const inputBox = document.createElement('div');
        inputBox.classList.add("searchAddress", "searchStreet");

        _this.inputStreet = document.createElement("input");
        _this.inputStreet.placeholder = "Начните вводить адрес";
        _this.inputStreet.setAttribute("data-street", "");
        _this.inputStreet.setAttribute("list", "address_list");

        _this.checkBoxHouse = document.createElement("div");
        _this.checkBoxHouse.className = 'checkbox_house';

        const checkBoxHouseInput = document.createElement("input");
        checkBoxHouseInput.type = "checkbox";
        checkBoxHouseInput.id = 'checkBoxHouse';
        checkBoxHouseInput.addEventListener('change', () => {
            _this.addressType = checkBoxHouseInput.checked ? "house" : "apartament";
        });

        const checkBoxHouseLabel = document.createElement("label");
        checkBoxHouseLabel.setAttribute('for', 'checkBoxHouse');
        checkBoxHouseLabel.textContent = 'Частный дом';

        _this.checkBoxHouse.append(checkBoxHouseInput, checkBoxHouseLabel);

        _this.btnContinue = document.createElement("button");
        _this.btnContinue.id = 'confirm-delete';
        _this.btnContinue.textContent = "Продолжить";
        _this.btnContinue.disabled = true;
        _this.btnContinue.classList.add('disabled');

        const btnCancel = document.createElement("div");
        btnCancel.className = "btn btn-cancel";
        btnCancel.textContent = "Назад";
        btnCancel.addEventListener("click", () => { _this.cancel(); });
        const datalist = document.createElement("div");
        datalist.id = "address_list";
        datalist.classList.add("hide");

        const search = async () => {
            datalist.classList.remove("hide");
            const result = await sendInfo({ url: `/cabinet/suggestion?address=${_this.inputStreet.value}&search_type=${_this.addressType}`, date: "" });
            datalist.innerHTML = "";
            _this.streetId = "";
            if (_this.inputStreet === "") {
                _this.streetId = "";
                // _this.inputHouse?.value = "";
                // _this.inputAppartament?.value = "";
            }
            if (result.is_error) {
                _this.createManuallyAddress();
                is_error = true;
                _this.inputStreet.removeEventListener("input", search, false);
                return;
            }
            if (result) {

                result.forEach(op => {
                    const option = document.createElement("label");
                    option.textContent = op.value;
                    option.addEventListener("click", () => {
                        _this.inputStreet.value = op.value;
                        _this.streetId = op.id;
                        _this.addressText = op.value;

                        _this.inputStreet.focus();

                        datalist.innerHTML = "";
                        datalist.classList.add("hide");


                        if (op.is_complete) {
                            _this.btnContinue.disabled = false;
                            _this.btnContinue.classList.remove('disabled');
                        }

                        if (op.house) {
                            _this.createHouse(false, op.house);
                        } else if (op.apartment) {
                            _this.createHouse(false, op.house);
                        } else {
                            _this.createHouse();
                        }
                    });

                    datalist.append(option);
                });
            }
        };

        _this.inputStreet.addEventListener("input", search, false);
        _this.inputStreet.addEventListener("focus", search, false);
        // _this.inputStreet.addEventListener("blur", (e)=>{
        //     console.log(e);
        //     datalist.classList.add("hide");
        //     datalist.innerHTML = "";
        // }, true);

        _this.btnContinue.addEventListener("click", () => _this.continue());

        inputBox.append(_this.inputStreet, datalist);
        this.modalContent.append(inputBox, _this.checkBoxHouse, _this.btnContinue);
        _this.btnContinue.after(btnCancel);
        if (location.host === 'voronezh.sushi-darom.com') {
            const infoBox = document.createElement('div');
            infoBox.style.fontSize = '0.8em';
            infoBox.style.color = 'gray';
            infoBox.textContent = 'Обратите внимание, доставку на левый берег не осуществляем';
            inputBox.before(infoBox);
        }

    }
    createHouse(is_error = false, value = null) {
        const _this = this;
        if (_this.hauseBox) _this.hauseBox.remove();
        _this.hauseBox = document.createElement("div");
        _this.hauseBox.className = "searchAddress";
        _this.inputHouse = document.createElement("input");
        _this.inputHouse.setAttribute("data-inputHouse", "");
        _this.inputHouse.placeholder = "Введите номер дома";
        const datalist = document.createElement("div");
        datalist.id = "address_list";
        console.log(value);
        if (value) {
            _this.inputHouse.value = value;
            _this.houseId = _this.streetId;
        }
        datalist.classList.add("hide");
        !is_error && _this.inputHouse.addEventListener("input", async () => {
            const result = await sendInfo({ url: `/cabinet/suggestion?address=${_this.inputStreet.value} ,д.${_this.inputHouse.value}&search_type=${_this.addressType}&id=${_this.streetId}`, date: "" });
            datalist.innerHTML = "";

            if (result) {
                datalist.classList.remove("hide");
                result.forEach(op => {
                    const option = document.createElement("label");
                    option.textContent = op.value;
                    option.addEventListener("click", () => {

                        _this.inputHouse.value = op.house;
                        _this.houseId = op.id;
                        _this.addressText = op.value;

                        _this.inputHouse.focus();
                        datalist.innerHTML = "";
                        datalist.classList.add("hide");

                        if (op.is_complete) {
                            _this.btnContinue.disabled = false;
                            _this.btnContinue.classList.remove('disabled');
                        }
                    });

                    datalist.append(option);
                });
            }

        });
        const inputBox = _this.modalContent.querySelector(".searchStreet");
        _this.hauseBox.append(_this.inputHouse, datalist);
        inputBox.after(_this.hauseBox);
    }


    continue() {

        const _this = this;
        _this.step++;
        if (_this.addressType == "house") {
            _this.send();
        } else {

            /* отрубаем все инпуты на адрес */
            if (_this.inputStreet) {
                _this.inputStreet.disabled = true;
                _this.inputStreet.classList.add("disabled");
            }
            if (_this.inputHouse) {
                _this.inputHouse.disabled = true;
                _this.inputHouse.classList.add("disabled");
            }
            if (_this.inputApartament) {
                _this.inputApartament.disabled = true;
                _this.inputApartament.classList.add("disabled");
            }
            _this.btnContinue.classList.add("hide");
            /* генерируем формочку с домофоном там, этаж и т.д. */
            const textTitle = document.createElement("div");
            textTitle.textContent = "Помогите курьеру найти вас";
            textTitle.classList.add("textTitle");

            //   Квартира
            _this.apartamentBox = document.createElement("div");

            const apartamentBox = document.createElement("div");
            apartamentBox.className = "order__os-input__box";
            const apartamentLabel = document.createElement("label");
            apartamentLabel.setAttribute("for", "apartament");
            apartamentLabel.textContent = "Квартира ";
            _this.inputApartament = document.createElement("input");
            _this.inputApartament.id = "apartament";

            _this.inputApartament.addEventListener("blur", () => {

            });

            apartamentBox.append(apartamentLabel, _this.inputApartament);
            /*Подьезд */

            const entranceBox = document.createElement("div");
            entranceBox.className = "order__os-input__box";
            const entranceLabel = document.createElement("label");
            entranceLabel.setAttribute("for", "front_door");
            entranceLabel.textContent = "Подъезд";
            _this.inputEnterance = document.createElement("input");
            _this.inputEnterance.id = "front_door";

            _this.inputEnterance.addEventListener("blur", () => {

            });

            entranceBox.append(entranceLabel, _this.inputEnterance);

            /*Этаж */
            const floorBox = document.createElement("div");
            floorBox.className = "order__os-input__box";
            const floorLabel = document.createElement("label");
            floorLabel.setAttribute("for", "floor");
            floorLabel.textContent = "Этаж";
            _this.inputFloor = document.createElement("input");
            _this.inputFloor.id = "floor";

            _this.inputFloor.addEventListener("blur", () => {

            });

            floorBox.append(floorLabel, _this.inputFloor);

            /*Домофон */
            const intercomBox = document.createElement('div');
            intercomBox.classList.add("intercomBox");
            const intercomTitles = document.createElement('div');
            intercomTitles.className = "intercomTitles";
            intercomTitles.textContent = "Домофон";
            const intercomWork = document.createElement('div');
            intercomWork.className = "intercom-btn";
            intercomWork.textContent = "Работает";
            const intercomNoWork = document.createElement('div');
            intercomNoWork.className = "intercom-btn";
            intercomNoWork.textContent = "Не работает";
            intercomBox.append(intercomTitles, intercomWork, intercomNoWork);

            const intercomCodeBox = document.createElement("div");
            intercomCodeBox.className = "order__os-input__box";
            const intercomeCodeTitle = document.createElement("label");
            intercomeCodeTitle.setAttribute("for", "intercome");
            intercomeCodeTitle.textContent = "Код домофона";
            _this.intercomeCodeInput = document.createElement("input");
            _this.intercomeCodeInput.id = "intercome";

            intercomCodeBox.append(intercomeCodeTitle, _this.intercomeCodeInput);

            intercomWork.addEventListener('click', () => {
                intercomWork.classList.add("selected");
                intercomNoWork.classList.remove("selected");
                _this.workIntercom = true;
            });

            intercomNoWork.addEventListener("click", () => {
                intercomNoWork.classList.add("selected");
                intercomWork.classList.remove("selected");
                _this.workIntercom = false;
            });

            /* кнопочка сохранить */
            const btnSave = document.createElement("button");
            btnSave.id = 'confirm-delete';
            btnSave.textContent = "Сохранить";

            btnSave.addEventListener("click", () => {
                _this.send();
            });

            _this.apartamentBox.append(textTitle, apartamentBox, entranceBox, intercomBox, intercomCodeBox, floorBox, btnSave);
            _this.modalContent.querySelector(".btn-cancel").before(_this.apartamentBox);
        }
    }

    send() {
        const _this = this;

        if (_this.isManualu) {
            _this.addressText = `ул. ${_this.inputStreet.value}, д. ${_this.inputHouse.value}`;
            _this.houseId = "0";
            _this.apartamentId = "0";
            if (_this.addressType == "apartament") {
                _this.addressText += `, кв. ${_this.inputApartament.value}`;
            }

        }

        const params = new URLSearchParams();
        params.append("address_fias", _this.houseId);
        params.append("address_type", _this.addressType);
        params.append("address_text", _this.addressText);
        params.append("address_name", _this.inputAddressName.value ?? "Новый адресс");
        params.append("house", _this.inputHouse.value);

        if (_this.sendMethod) {
            params.append("delivery_method", "delivery");
        }

        if (_this.addressType == "apartament") {
            params.append("entrance", _this.inputEnterance.value);
            params.append("entrance_code", _this.inputApartament.value);
            params.append("floor", _this.inputFloor.value);
            params.append("apartment", _this.inputApartament.value);
            params.append("is_work_domofon", _this.workIntercom);
        }

        const date = params.toString();
        sendInfo({ url: "/order/updateCartInfo", date: date }).finally(() => {
            // if (createHeaderInfo && typeof (createHeaderInfo) == "function") createHeaderInfo();
            // перерисовка слишком рано была, не успевает обновиться getClientInfo. перенес в блок finally метода sendInfo()
            _this.render();
        });
        _this.modalContent.closest(".modal").remove();

    }

    cancel() {
        const _this = this;
        switch (_this.step) {
            case 1:
                _this.step--;
                if (_this.modalContent.closest(".modal")) _this.modalContent.closest(".modal").remove();
                break;
            // case 2:
            //     if( _this.modalContent.closest(".modal"))   _this.modalContent.closest(".modal").remove();
            //     _this.createAddress();
            //     _this.step--;
            //     break;

            case 2:
                if (_this.inputStreet) {
                    _this.inputStreet.disabled = false;
                    _this.inputStreet.classList.remove("disabled");
                }
                if (_this.inputHouse) {
                    _this.inputHouse.disabled = false;
                    _this.inputHouse.classList.remove("disabled");
                }
                if (_this.inputApartament) {
                    _this.inputApartament.disabled = false;
                    _this.inputApartament.classList.remove("disabled");
                }
                _this.apartamentBox?.remove();
                _this.btnContinue.classList.remove("hide");
                _this.step--;
                break;
        }

    }

    createManuallyAddress() {
        const _this = this;
        const title = createElement("div", "title_address");
        title.innerHTML = "Не удалось найти адрес. <br> сюда нужно добавить текст, что б объяснить клиенту что случилось и что делать";

        if (_this.modalContent.querySelector(".title_address")) _this.modalContent.querySelector(".title_address").remove();

        _this.modalContent.prepend(title);
        // _this.searchAddress(true);
        _this.createHouse(true);
        if (_this.addressType == "apartament") {
            _this.createApartament(true);
        }

        _this.btnContinue.classList.remove("disabled");
        _this.btnContinue.disabled = false;
        _this.isManualu = true;
    }

    render() {
        const _this = this;
        const state = {
            id: (_this.addressType === "house") ? _this.houseId : _this.apartamentId,
            address_type: _this.addressType,
            address_text: _this.addressText,
            address_name: _this.inputAddressName.value ?? "Новый адрес",
            house: _this.inputHouse.value,
            entrance: _this.inputEnterance ? _this.inputEnterance.value : '',
            entrance_code: _this.inputEnteranceCode ? _this.inputEnteranceCode.value : '',
            floor: _this.inputFloor ? _this.inputFloor.value : '',
            apartment: _this.inputApartament ? _this.inputApartament.value : ''
        };

        try {
            //   if (createAddress && typeof (createAddress) == "function") createAddress(state);
        } catch (error) { }

        if (createHeaderInfo && typeof (createHeaderInfo) == "function") createHeaderInfo();

        _this.removeState();
    }

    removeState() {
        this.addressText = null;
        this.inputStreet = null;
        this.inputHouse = null;
        this.inputApartament = null;
        this.inputFloor = null;
        this.streetId = null;
        this.houseId = null;
        this.apartamentId = null;
        this.addressType = null;
        this.inputAddressName = null;
        this.inputEnterance = null;
        this.inputEnteranceCode = null;

        this.sendMethod = false;

        this.workIntercom = null;
        this.intercomeCodeInput = null;

        /* Кнопки */
        this.btnHouse = null;
        this.btnApartament = null;
        this.btnContinue = null;

        /* Модалка */
        this.modalContent = null;

        /* Контейнеры */
        this.streetBox = null;
        this.hauseBox = null;
        this.apartamentBox = null;
    }
}

globalThis.address = new Address();

