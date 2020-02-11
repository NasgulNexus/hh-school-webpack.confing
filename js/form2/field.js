
function subscribe(callback) {
    this.handlers.push(callback);
    return () => {
        this.handlers = this.handlers.filter(item => item !== callback);
    };
}

function notify(arg) {
    this.handlers.forEach(callback => {
        callback(arg);
    });
}

export { subscribe, notify } 