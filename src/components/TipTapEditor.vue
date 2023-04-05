<template>
    <div class="tiptap-editor">
        <div class="menu-bar bg-white shadow-md py-2 px-4 space-x-2">
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
        <editor-content :editor="editor" class="border border-gray-300 p-4 mt-2 rounded bg-white" />
    </div>
</template>
  
<script>
import StarterKit from '@tiptap/starter-kit';
import { Editor, EditorContent } from '@tiptap/vue-3';
import Link from '@tiptap/extension-link';

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
            extensions: [StarterKit, Link],
            editorProps: {
                attributes: {
                    class: 'prose dark:prose-invert m-5 focus:outline-none',
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