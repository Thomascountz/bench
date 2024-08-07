<template>
    <div class="container mx-auto my-8 px-4">
        <h1 class="text-4xl font-bold text-center text-neutral-900 font-black">Bench <span class="text-base text-gray-500 font-normal">0.1.alpha</span></h1>
      <div class="flex justify-between items-center mb-6 mt-6">
        <h1 class="text-3xl font-semibold text-neutral-900">Documents</h1>
        <div class="flex space-x-2">
          <button @click="addDocument()"
            class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2">
            + New Document
          </button>
          <button @click="toggleSettings()"
          class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Settings form -->
      <div v-if="showSettings" class="p-8">
        <h1 class="text-xl font-bold text-neutral-700 font-black mb-4">Settings</h1>
        <input v-model="githubToken" type="password" class="border border-black p-2 w-full rounded mb-2" placeholder="Enter GitHub Token" />
        <div class="flex space-x-2">
          <button @click="saveGithubToken()"
            class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded">
            Save Token
          </button>
          <button @click="deleteGithubToken()"
            class="bg-slate-300 hover:bg-red-900 text-red-900 hover:text-white border border-red-900 font-medium py-1 px-2 rounded">
            Delete Token
          </button>
        </div>
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
import { ref, onMounted } from 'vue';
import DocumentModel from '@/models/DocumentModel';
import GithubTokenModel from '@/models/GithubTokenModel';


export default {
    name: 'HomePage',
    setup() {
        const documents = ref([]);
        const githubToken = ref('');
        const showSettings = ref(false);

        const toggleSettings = () => {
            showSettings.value = !showSettings.value;
        };

        const saveGithubToken = async () => {
            await GithubTokenModel.saveToken(githubToken.value);
            alert('GitHub token saved successfully!');
        };

        const deleteGithubToken = async () => {
            await GithubTokenModel.deleteToken();
            githubToken.value = '';
            alert('GitHub token deleted successfully!');
        };

        const loadGithubTokenStatus = async () => {
            const token = await GithubTokenModel.getToken();
            if (token) { githubToken.value = token; }
        };

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

        onMounted(() => {
            loadDocuments();
            loadGithubTokenStatus();
        });

        return { documents, showSettings, toggleSettings, githubToken, saveGithubToken, deleteGithubToken, addDocument, startRename, confirmDelete, deleteDocument };
    },
};
</script>
