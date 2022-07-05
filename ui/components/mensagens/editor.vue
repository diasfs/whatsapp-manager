<template>
    <div>
        <div ref="ed" class="border bg-body"></div>
    </div>
</template>
<script>
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import AttachesTool from "@editorjs/attaches";

export default {
    props: ["template", "upload_url"],
    data() {
        return {
            editor: null,
        };
    },
    methods: {
        async setEditor() {
            if (this.editor) {
                console.log(typeof this.editor.destroy, "editor");
                this.editor.destroy();
                this.editor = null;
            }
            let config = {
                holder: this.$refs.ed,                    
                onChange: async () => {
                    let template = await this.editor.save();
                    this.$emit("change", template);
                },
                tools: {
                    attaches: {
                        class: AttachesTool,
                        config: {
                            endpoint: this.upload_url,
                        },
                    },
                    image: {
                        class: ImageTool,
                        inlineToolbar: true,
                        config: {
                            endpoints: {
                                byFile: this.upload_url,
                            },
                        },
                    },
                },
                data: {
                    ...this.template
                }
            };
            console.log(config);
            this.editor = new EditorJS(config);
            await this.editor.isReady;
            this.$emit("ready", this.editor);
            if (!this.template) {
                return;
            }
            
            let template = JSON.parse(JSON.stringify(this.template));
            if (template.blocks && template.blocks.length) {
                this.editor.blocks.render({
                    blocks: template.blocks
                })

            }
        },
    },
    created() {
        console.log("editor:created");
    },
    mounted() { 
        console.log("editor:mounted");
        this.$nextTick(() => { 
            this.setEditor();
        });
    },
    updated() {
        console.log("editor:updated");
        this.$nextTick(() => {
            this.setEditor();
        });
    },
    watch: {
        template: {
            immediate: true,
            async handler(v) {
                if (this.editor) {
                    await this.editor.isReady;
                    if (!this.template) {
                        return;
                    }
                    console.log('tempol')
                    this.editor.blocks.render(this.template);
                }
            },
        },
    },
};
</script>