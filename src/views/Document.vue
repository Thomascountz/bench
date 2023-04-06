<template>
  <div class="container mx-auto my-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-semibold text-gray-800">Document</h1>
      <button @click="addRow" class="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded">
        Add row
      </button>
    </div>
    <div v-for="(row, index) in rows" :key="index" class="mb-8">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <div v-if="row.editingLink">
            <input v-model="row.targetInput" class="border border-gray-300 p-2 w-full rounded" />
            <button @click="submitLink(index)"
              class="bg-gray-800 hover:bg-gray-700 text-white font-medium py-1 px-2 rounded mt-2">
              Submit
            </button>
          </div>
          <div v-else>
            <em-github-embed :target="row.target" />
            <button @click="editLink(index)"
              class="bg-gray-800 hover:bg-gray-700 text-white font-medium py-1 px-2 rounded mt-2">
              Edit
            </button>
          </div>
        </div>
        <div>
          <div v-if="row.editingNote">
            <tip-tap-editor v-model="row.note" />
            <div class="flex justify-end mt-2">
              <button @click="saveNote(index)"
                class="bg-green-500 hover:bg-green-700 text-white font-medium py-1 px-2 rounded mr-2">
                Save
              </button>
              <button @click="cancelNote(index)"
                class="bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-2 rounded">
                Cancel
              </button>
            </div>
          </div>
          <div v-else>
            <div v-html="row.note" class="prose dark:prose-invert m-5 rounded bg-white">
            </div>
            <div class="flex justify-end mt-2">
              <button @click="editNote(index)"
                class="bg-gray-800 hover:bg-gray-700 text-white font-medium py-1 px-2 rounded mr-2">
                Edit
              </button>
              <button @click="confirmDelete(index)"
                class="bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import EmGithubEmbed from '@/components/EmGithubEmbed.vue';
import TipTapEditor from '@/components/TipTapEditor.vue';
import DocumentModel from '@/models/DocumentModel';

export default {
  name: 'DocumentPage',
  components: {
    TipTapEditor,
    EmGithubEmbed,
  },
  setup() {
    const rows = ref([]);
    const route = useRoute();
    const documentId = route.params.id;

    const addRow = () => {
      rows.value.push({
        editingLink: true,
        targetInput: '',
        note: '',
        editingNote: false,
      });
      saveRows(documentId);
    };

    const submitLink = (index) => {
      rows.value[index].target = rows.value[index].targetInput;
      rows.value[index].editing
      rows.value[index].editingLink = false;
      saveRows(documentId);
    };

    const editLink = (index) => {
      rows.value[index].editingLink = true;
      saveRows(documentId);
    };

    const deleteRow = (index) => {
      rows.value.splice(index, 1);
      saveRows(documentId);
    };

    const saveRows = async (docId) => {
      const document = await DocumentModel.getById(docId);
      document.content = rows.value;
      await document.save();
    };

    const loadRows = async (docId) => {
      const document = await DocumentModel.getById(docId);
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

    loadRows(documentId);

    return {
      rows,
      addRow,
      submitLink,
      editLink,
      confirmDelete,
      deleteRow,
      editNote,
      saveNote,
      cancelNote,
    };
  },
};
</script>
