const Mask = (value, mask) => { 
    if (value == "undefined" || value == "") return '';
    value = value.replace(/\D/g, '');
    let formattedValue = '';
    let maskNumber = mask.replace(/\D/g, '');
    let charIndex = value.indexOf(maskNumber);
    if (maskNumber && charIndex !== -1) {
        value = value.slice(0, charIndex) + value.slice(charIndex + 1);
    }
    let j = 0;
    for (let i = 0; i < mask.length; i++) {
        if (mask[i] === '#') {
            if (value[j] === undefined) {
                break;
            }
            formattedValue += value[j];
            j++;
        } else {
            if (value[j] + 1) {
                formattedValue += mask[i];
            }
        }
    }

    return formattedValue
}