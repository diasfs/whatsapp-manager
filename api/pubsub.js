import redis from 'redis';

export const publisher = redis.createClient({
    url: 'redis://redis'
});
await publisher.connect();

const client = redis.createClient({
    url: 'redis://redis'
});


export const subscriber = client.duplicate();
await subscriber.connect();


export const publish = async (channel, value) => {
    return publisher.publish(channel, JSON.stringify(value));
}

export const subscribe = async (channel, callback) => {
    subscriber.subscribe(channel, evt => {
        callback(JSON.parse(evt))
    });
}

export const unsubscribe = async (channel) => {
    subscriber.unsubscribe(channel);
}

export default {
    subscribe,
    publish,
    unsubscribe
}