
var InputListner = new Array();
var mask;

const PhoneMask = function(input_phone, myMask) {


   const input = document.querySelector(input_phone);

   input.removeEventListener("input", mask, false);
   input.removeEventListener("focus", mask, false);
   input.removeEventListener("focus", mask, false);
   input.removeEventListener("keydown", mask, false);
   input.removeEventListener("paste", mask, false);

    if (InputListner.indexOf(input) != "-1") {
        console.log(InputListner.indexOf(input))
        let clone = input.cloneNode(true);
        let Phone = clone.value;

        clone.value = "";
        InputListner[InputListner.indexOf(input)].after(clone);
        InputListner[InputListner.indexOf(input)].remove();
        InputListner.splice(InputListner.indexOf(input), 1);

        //input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        //input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);

        input = document.querySelector(input_phone);
        input.selectionStart = input.value.length;
        // input.value = Phone;
    }

    var keyCode;

    mask = function(event) {
        if(event.type == 'paste') {
            const pastDate = (event.clipboardData || window.clipboardData).getData('text');
            const isValid = /^8.*8$/.test(pastDate) && pastDate.length === 11;
            if(!isValid) this.value += pastDate.slice(1);
        }
        event.keyCode && (keyCode = event.keyCode);
        if (event.keyCode == 8) return;
        var pos = this.selectionStart;
        if (pos < 3) event.preventDefault();

        if (pos >= myMask.length) {
            event.preventDefault();
        }
        var matrix = myMask,
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function(a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");

        if (i != -1) {
            i < 3 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function(a) {
                return "\\d{1," + a.length + "}"

            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");

        if (event.type == "blur" && this.value.length < 3) this.value = "";
        if (event.type == "keydown" && event.code == "Backspace" && this.value.length < 3) this.value = "";
        if (!reg.test(this.value) || this.value.length < 3 || keyCode > 47 && keyCode < 58) this.value = new_value;

        //this.dispatchEvent(new Event('update'));

    }

    input.addEventListener("paste", mask, false);
    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    
    //input.addEventListener("blur", mask, false);
    //input.addEventListener("keydown", mask, false);
}



///////////////////*//////////////////
///////////////////*//////////////////
///////////////////*//////////////////
///////////////////*//////////////////
///////////////////*//////////////////
///////////////////*//////////////////
///////////////////*//////////////////
