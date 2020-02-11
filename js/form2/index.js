import makePhone from "./phone.js";
import makeUsername from "./username.js";
import makeEmail from "./email.js";


const form = document.querySelector(".js-order-form");
const submit = form.querySelector(".js-submit");
const deliveryWays = form.querySelectorAll(".js-deliveryway");
const adress = form.querySelector(".js-textarea");
const citySelect = form.querySelector(".js-cities-select");
const paymentMethods = form.querySelectorAll(".js-payment-method");
const smsAssigment = form.querySelector(".js-sms-checkbox");
const phone = makePhone(form);
const username = makeUsername(form);
const email = makeEmail(form);

const initInvalidFields = (...args) => {
    let invalidFields = new Set([]);

    args.forEach(arg => {
        arg.fields.forEach(field => {
            invalidFields.add(field);
        });
    });

    return invalidFields;
}

const state = {
    invalidFields: initInvalidFields(username, email, phone),
    username: "",
    email: "",
    number: "",
    code: "",
    adress: "",
    city: "",
    paymentMethod: form.querySelector(".js-payment-method:checked").value,
    deliveryWays: form.querySelector(".js-deliveryway:checked").value,
    smsAssigment: false
};

for (let deliveryWay of deliveryWays) {
    deliveryWay.addEventListener('click', e => {
        state.deliveryWay = e.target.value;
        if (e.target.value === "Самовывоз") {
            form.querySelector('.js-form-adress').classList.add('hidden');
        } else {
            form.querySelector('.js-form-adress').classList.remove('hidden');
        }
    });
}

for (let paymentMethod of paymentMethods) {
    paymentMethod.addEventListener('click', e => {
        state.paymentMethod = e.target.value;
    });
}

citySelect.addEventListener('change', e => {
    state.city = e.target.value;
});

adress.addEventListener('change', e => {
    state.adress = e.target.value;
});

smsAssigment.addEventListener('change', e => {
    state.smsAssigment = e.target.checked;
});

function showValidation({ touched, error, value, field, text }) {
    Object.assign(state, value);
    if (touched && error) {
        field.classList.add("input_error");
        field.nextElementSibling.innerHTML = (text.trim() == '')
            ? (field.nextElementSibling.innerHTML.trim() == '') ? 'empty' : field.nextElementSibling.innerHTML.trim()
            : text;
        field.nextElementSibling.classList.remove('hidden');
        state.invalidFields.add(field);
        return;
    }
    state.invalidFields.delete(field);
    field.classList.remove("input_error");
    field.nextElementSibling.innerHTML = text;
    field.nextElementSibling.classList.add('hidden');
}

const unsubscribeUserNameCallback = username.subscribe(showValidation);
const unsubscribeEmailCallback = email.subscribe(showValidation);
const unsubscribePhoneCallback = phone.subscribe(showValidation);

username.fields.forEach(field => {
    field.addEventListener("keyup", () => {
        let temp = username.validate(field);
        temp.touched = true;
        username.notify(temp);
    });
});

email.fields.forEach(field => {
    field.addEventListener("keyup", () => {
        let temp = email.validate(field);
        temp.touched = true;
        email.notify(temp);
    });
});

phone.fields.forEach(field => {
    field.addEventListener("keyup", () => {
        let temp = phone.validate(field);
        temp.touched = true;
        phone.notify(temp);
    });
});

submit.addEventListener("click", e => {
    e.preventDefault();
    state.invalidFields.forEach(field => {
        showValidation({
            touched: true,
            error: true,
            value: { [field.name]: field.value },
            field: field,
            text: ""
        }
        )
    })
    console.log(state);
});