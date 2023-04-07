<template>
    <div class="container mx-auto my-8 px-4">
        <h1 class="text-3xl font-semibold mb-4 text-gray-800">Documents</h1>
        <div class="grid grid-cols-3 gap-4">
            <div v-if="documents.length > 0">
                <div v-for="(doc, index) in documents" :key="doc.id">
                    <div class="border border-gray-300 p-4 rounded bg-white">
                        <router-link :to="{ name: 'Document', params: { id: doc.id } }"
                            class="text-gray-800 hover:text-gray-600">
                            {{ doc.name }}
                        </router-link>
                        <div class="flex justify-end mt-2">
                            <button @click="startRename(index)"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded mr-2">
                                Rename
                            </button>
                            <button @click="confirmDelete(index)"
                                class="bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border border-gray-300 p-4 rounded bg-white">
                <button @click="addDocument" class="bg-gray-800 hover:bg-gray-700 text-white font-medium py-1 px-2 rounded">
                    New Document
                </button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { ref } from 'vue';
import DocumentModel from '@/models/DocumentModel';

export default {
    name: 'HomePage',
    setup() {
        const documents = ref([]);
        const addDocument = async () => {
            const newId = `${Date.now()}-${Math.random().toString(36)}`;
            const newDocument = new DocumentModel(newId, 'New Document');
            await DocumentModel.save(newDocument)
            await loadDocuments();
        };

        const startRename = async (index) => {
            const document = await DocumentModel.getById(documents.value[index].id)
            const newName = prompt('Enter a new name for the document:', document.name);
            if (newName && newName.trim()) {
                document.name = newName.trim();
                await DocumentModel.update(document);
                await loadDocuments();
            }
        };

        const confirmDelete = async (index) => {
            if (confirm('Are you sure you want to delete this document?')) {
                await deleteDocument(index);
            }
        };

        const deleteDocument = async (index) => {
            await DocumentModel.delete(documents.value[index].id);
            await loadDocuments();
        };

        const loadDocuments = async () => {
            const storedDocuments = await DocumentModel.getAllDocuments();
            if (storedDocuments) {
                documents.value = storedDocuments;
            }
        };

        loadDocuments();

        return { documents, addDocument, startRename, confirmDelete, deleteDocument };
    },
};
</script>
  