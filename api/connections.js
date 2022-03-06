import { EventEmitter } from 'events';

export let Connections = {};
export const Events = new EventEmitter();


export const getConnectionsByUserId = UserId => {
    if ('undefined' === typeof Connections[UserId]) {
        return [];
    }
    return Connections[UserId];
}

export const addConnection = (UserId, connection) => {
    if ('undefined' === typeof Connections[UserId]) {
        Connections[UserId] = [];
    }
    Connections[UserId].push(connection);
    Events.emit('updated');
    Events.emit('new_connection', connection);
}

export const addListener = (evt, handler) => Events.addListener(evt, handler);
export const on = (evt, handler) => Events.on(evt, handler);
export const once = (evt, handler) => Events.once(evt, handler);
export const removeListener = (evt, handler) => Events.removeListener(evt, handler);
export const removeAllListener = (evt = null) => Events.removeAllListener(evt);



export default { 
    Connections,
    Events,
    getConnectionsByUserId,
    addConnection,
    addListener,
    removeListener,
    removeAllListener,
    on,
    once
}