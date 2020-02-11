import { subscribers, subscribe, notify } from './field.js'

const selectors = {
    code: ".js-phone-code",
    number: ".js-phone-number",
    country: ".js-phone-country"
}

export default function field(form, conditions) {
    const number = form.querySelector(selectors.number);
    const code = form.querySelector(selectors.code);
    const country = form.querySelector(selectors.country);

    function validate(field) {
        if (!field.value.trim()) {
            return {
                error: true,
                text: "empty"
            };
        }
        const match = field.value.match(/[0-9\s]+/);
        if (!match) {
            return {
                error: true,
                text: "incorrect character"
            };
        }
        if (match[0] === field.value) {
            return {
                error: false,
                text: ""
            };
        }
        return {
            error: true,
            text: "incorrect character"
        };
    }

    let validateResultNumber = validate(number);
    let validateResultCode = validate(code);
    let numberError = validateResultNumber.error;
    let codeError = validateResultCode.error;
    let error = numberError || codeError;
    let text = validateResultNumber.text + validateResultCode.text;
    let touched = false;
    let value = {
        number: number.value,
        code: code.value
    };
    let handlers = [];

    return {
        subscribe,
        notify,
        handlers,
        error,
        touched,
        value,
        validate: (field) => {
            let validateResult = validate(field);
            error = validateResult.error;
            text = validateResult.text;
            value = {
                [field.name]: field.value
            }
            return {
                error,
                touched,
                value,
                field,
                text
            };
        },
        prepareToSubmit: () => {
            touched = true;
        },
        fields: [number, code]
    };
}
63 