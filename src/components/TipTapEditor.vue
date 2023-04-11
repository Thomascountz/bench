<template>
    <div class="tiptap-editor mt-4 border rounded border-black">
        <div class="menu-bar bg-gray-200 py-2 px-4 space-x-4 rounded-t">
            <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
                <font-awesome-icon :icon="['fas', 'heading']" />
            </button>
            <button @click="editor.chain().focus().toggleBold().run()">
                <font-awesome-icon :icon="['fas', 'bold']" />
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()">
                <font-awesome-icon :icon="['fas', 'italic']" />
            </button>
            <button @click="editor.chain().focus().toggleBlockquote().run()">
                <font-awesome-icon :icon="['fas', 'quote-right']" />
            </button>
            <button @click="editor.chain().focus().toggleBulletList().run()">
                <font-awesome-icon :icon="['fas', 'list-ul']" />
            </button>
            <button @click="editor.chain().focus().toggleOrderedList().run()">
                <font-awesome-icon :icon="['fas', 'list-ol']" />
            </button>
        </div>
        <editor-content :editor="editor" class="p-1 bg-white rounded" />
    </div>
</template>
  
<script>
import StarterKit from '@tiptap/starter-kit';
import { Editor, EditorContent } from '@tiptap/vue-3';
import Link from '@tiptap/extension-link';
import CodeBlockLowLight from '@tiptap/extension-code-block-lowlight';

import { lowlight } from "lowlight"
import ruby from 'highlight.js/lib/languages/ruby'
lowlight.registerLanguage('ruby', ruby)

export default {
    name: 'TipTapEditor',
    components: {
        EditorContent,
    },

    props: {
        modelValue: {
            type: String,
            default: '',
        },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            editor: null,
        };
    },

    watch: {
        modelValue(value) {
            const isSame = this.editor.getHTML() === value;
            if (isSame) {
                return;
            }
            this.editor.commands.setContent(value, false);
        },
    },

    mounted() {
        this.editor = new Editor({
            extensions: [
                StarterKit,
                Link,
                CodeBlockLowLight.configure({
                    lowlight,
                })],
            editorProps: {
                attributes: {
                    class: 'prose max-w-full m-4 focus:outline-none',
                },
            },
            content: this.modelValue,
            onUpdate: () => {
                this.$emit('update:modelValue', this.editor.getHTML());
            },
        });
    },

    beforeUnmount() {
        this.editor.destroy();
    },
};
</script>
