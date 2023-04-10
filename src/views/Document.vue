<template>
  <div class="container mx-auto my-8 px-4">
    <router-link to="/" class="text-black font-medium mr-2 p-2">
      ← Home
    </router-link>
    <div class="flex justify-between items-center mb-6 mt-6">
      <h1 class="text-3xl font-semibold text-neutral-900">{{ documentName }}</h1>
    </div>
    <draggable v-model="rows" handle=".handle" item-key="id" @end="saveRows(documentId)">
      <template #item="{ element, index }">
        <div class="grid grid-cols-2 gap-6 mb-6 border border-black rounded-lg relative">
          <div class="absolute top-2 left-2 cursor-move handle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 6h12V5H4v1zm0 4h12V9H4v1zm0 4h12v-1H4v1z" clip-rule="evenodd" />
            </svg>
          </div>
          <button @click="confirmDelete(index)" class="absolute top-2 right-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M14.707 14.707a1 1 0 0 1-1.414 0L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 1.414-1.414L10 8.586l3.293-3.293a1 1 0 0 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 0 1 0 1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <div class="p-4 border-r border-black">
            <div v-if="element.editingLink">
              <input v-model="element.targetInput" class="border border-black mt-5 p-2 w-full rounded"
                placeholder="Github link" />
              <button @click="submitLink(index)"
                class="bg-green-800 hover:bg-green-900 text-white font-medium py-1 px-2 rounded mt-2 border border-black mr-2">
                Save
              </button>
              <button @click="cancelLink(index)"
                class="bg-slate-300 hover:bg-red-900 text-red-900 hover:text-white border border-red-900 font-medium py-1 px-2 rounded mt-2">
                Cancel
              </button>
            </div>
            <div v-else>
              <em-github-embed v-if="element.target" :target="element.target" />
              <input v-else readonly class="border border-black mt-5 p-2 w-full rounded cursor-not-allowed"
                placeholder="No Github link" />
              <button @click="editLink(index)"
                class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2 mt-2">
                Edit
              </button>
            </div>
          </div>
          <div class="p-4">
            <div v-if="element.editingNote">
              <tip-tap-editor v-model="element.note" />
              <div class="flex justify-end mt-2">
                <button @click="saveNote(index)"
                  class="bg-green-800 hover:bg-green-900 text-white font-medium py-1 px-2 rounded mr-2 border border-black mt-2">
                  Save
                </button>
                <button @click="cancelNote(index)"
                  class="bg-slate-300 hover:bg-red-900 text-red-900 hover:text-white border border-red-900 font-medium py-1 px-2 rounded mt-2">
                  Cancel
                </button>
              </div>
            </div>
            <div v-else>
              <div v-html="element.note" class="prose max-w-full mt-4 p-4 rounded border border-black">
              </div>
              <div class="flex justify-end mt-2">
                <button @click="editNote(index)"
                  class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2 mt-2">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <button @click="addRow"
          class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2">
          + Add row
        </button>
      </template>
    </draggable>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import EmGithubEmbed from '@/components/EmGithubEmbed.vue';
import TipTapEditor from '@/components/TipTapEditor.vue';
import draggable from 'vuedraggable';
import DocumentModel from '@/models/DocumentModel';

export default {
  name: 'DocumentPage',
  components: {
    TipTapEditor,
    EmGithubEmbed,
    draggable,
  },
  setup() {
    const rows = ref([]);
    const rowCounter = ref(0);
    const route = useRoute();
    const documentId = route.params.id;
    const documentName = ref('');


    const addRow = () => {
      const id = rowCounter.value++;
      rows.value.push({
        id: id,
        editingLink: true,
        targetInput: '',
        note: '',
        editingNote: true,
      });
      saveRows(documentId);
    };

    const submitLink = (index) => {
      rows.value[index].target = rows.value[index].targetInput;
      rows.value[index].editingLink = false;
      saveRows(documentId);
    };

    const editLink = (index) => {
      rows.value[index].editingLink = true;
      saveRows(documentId);
    };

    const cancelLink = (index) => {
      rows.value[index].editingLink = false;
    };

    const deleteRow = (index) => {
      rows.value.splice(index, 1);
      saveRows(documentId);
    };

    const saveRows = async () => {
      const document = await DocumentModel.getById(documentId);
      document.content = JSON.stringify(rows.value);
      await DocumentModel.save(document);
    };

    const loadDocument = async () => {
      const document = await DocumentModel.getById(documentId);
      if (document) {
        documentName.value = document.name;
      }
      if (document && document.content) {
        rows.value = JSON.parse(document.content);
      }
    };

    const confirmDelete = (index) => {
      if (confirm("Are you sure you want to delete this row?")) {
        deleteRow(index);
      }
    };

    const editNote = (index) => {
      if (rows.value.some(row => row.editingNote)) {
        if (confirm("You have unsaved changes in another note. Do you want to discard those changes and edit this note?")) {
          rows.value.forEach(row => row.editingNote = false);
        } else {
          return;
        }
      }
      rows.value[index].editingNote = true;
    };

    const saveNote = (index) => {
      rows.value[index].editingNote = false;
      saveRows(documentId);
    };

    const cancelNote = (index) => {
      rows.value[index].editingNote = false;
    };

    loadDocument();

    return {
      rows,
      addRow,
      saveRows,
      submitLink,
      editLink,
      cancelLink,
      confirmDelete,
      deleteRow,
      editNote,
      saveNote,
      cancelNote,
      documentName
    };
  },
};
</script>
