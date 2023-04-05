<template>
    <div class="container mx-auto px-4">
        <h1 class="text-3xl font-semibold mb-4">Documents</h1>
        <div class="grid grid-cols-3 gap-4">
            <div v-for="(doc, index) in documents" :key="index">
                <div class="border border-gray-300 p-4 rounded">
                    <router-link :to="{ name: 'Document', params: { id: index } }">
                        Document {{ index + 1 }}
                    </router-link>
                </div>
            </div>
            <div class="border border-gray-300 p-4 rounded">
                <button @click="addDocument" class="btn btn-primary">New Document</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { ref } from 'vue';
import localforage from 'localforage';

export default {
    name: 'HomePage',
    setup() {
        const documents = ref([]);
        const addDocument = () => {
            documents.value.push([]);
            saveDocuments();
        };

        const saveDocuments = async () => {
            await localforage.setItem('documents', documents.value);
        };

        return { documents, addDocument, saveDocuments };
    },
};
</script>
  