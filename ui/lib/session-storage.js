export default {
    setItem(name, value = null) {
        window.localStorage.setItem(name, JSON.stringify(value));
        let event = new Event('storage');
        window.dispatchEvent(event);
    },
    getItem(name) {
        try {
            return JSON.parse(window.localStorage.getItem(name));
        } catch (err) {
            return null;
        }
    },
    removeItem(name) {
        window.localStorage.removeItem(name);
        let event = new Event('storage');
        window.dispatchEvent(event);
    }
}