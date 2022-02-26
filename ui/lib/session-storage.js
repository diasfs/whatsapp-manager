export default {
    setItem(name, value = null) {
        window.sessionStorage.setItem(name, JSON.stringify(value));
        let event = new Event('storage');
        window.dispatchEvent(event);
    },
    getItem(name) {
        try {
            return JSON.parse(window.sessionStorage.getItem(name));
        } catch (err) {
            return null;
        }
    },
    removeItem(name) {
        window.sessionStorage.removeItem(name);
        let event = new Event('storage');
        window.dispatchEvent(event);
    }
}