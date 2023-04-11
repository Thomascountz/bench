<template>
    <div class="container mx-auto my-8 px-4">
        <h1 class="text-4xl font-bold text-center text-neutral-900 font-black">Bench <span class="text-base text-gray-500 font-normal">0.0.1.alpha</span></h1>
      <div class="flex justify-between items-center mb-6 mt-6">
        <h1 class="text-3xl font-semibold text-neutral-900">Documents</h1>
        <button @click="addDocument()"
          class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2">
          + New Document
        </button>
      </div>
      <div class="border border-black rounded-lg">
        <div v-for="(doc, index) in documents" :key="index"
          class="border-b border-black py-4 px-4 flex items-center justify-between last:rounded-b-none last:border-b-0">
          <router-link :to="'/document/' + doc.id"
            class="text-xl font-medium text-black hover:text-green-900 hover:underline">
            {{ doc.name }}
          </router-link>
          <div>
            <button @click="startRename(index)"
              class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2">
              Rename
            </button>
            <button @click="confirmDelete(index)"
              class="bg-slate-300 hover:bg-red-900 text-red-900 hover:text-white border border-red-900 font-medium py-1 px-2 rounded">
              Delete
            </button>
          </div>
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
  