<template>
    <video controls class="my-2 w-100" v-if="!loading" >
        <source :src="source.url" :type="source.type" v-for="source in sources" :key="source.url" />
    </video>    
    <div v-else>
        <video class="my-2 w-100"></video>
    </div>    
</template>
<script>

import { createFFmpeg } from '@ffmpeg/ffmpeg/dist/ffmpeg.min.js';
const ffmpeg = createFFmpeg({ log: true });

let inputs = {};
let outputs = {};

const transcode = async (url) => {
    try {
        let filename = new TextEncoder().encode(url);
        filename = await crypto.subtle.digest('SHA-256', filename);
        filename = Array.from(new Uint8Array(filename));
        filename = filename.map(bytes => bytes.toString(16).padStart(2, '0')).join('')

        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
        let sourceBuffer;
        if ('undefined' === typeof inputs[`${filename}.mp4`]) {
            inputs[`${filename}.mp4`] = await fetch(url).then(r => r.arrayBuffer());
        }
        sourceBuffer = inputs[`${filename}.mp4`];

        
        if ('undefined' === typeof outputs[`${filename}.ogg`]) {
            ffmpeg.FS('writeFile',`${filename}.mp4`, new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength));
            await ffmpeg.run('-i', `${filename}.mp4`, `${filename}.ogg`);
            const out = ffmpeg.FS('readFile', `${filename}.ogg`);
        
            outputs[`${filename}.ogg`] = URL.createObjectURL(new Blob([out.buffer], { type: 'video/ogg' }));
        }
        return outputs[`${filename}.ogg`]

    } catch (err) {
        console.error(err);
    }
    return null;
}
export default {
    props: ['url'],
    data() {
        return {
            loading: true,
            sources: [
                {
                    url: this.url,
                    type: 'video/mp4'
                }
            ]
        }
    },
    async created() {
        let url = await transcode(this.url);
        if (url) {

            this.sources = [
                ...this.sources,
                {
                    url,
                    type: 'video/ogg'
                }
            ]
        }
        this.loading = false;
    }
}
</script>