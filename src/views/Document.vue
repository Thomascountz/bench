<template>
  <div class="container mx-auto my-8 px-4">
    <router-link to="/"
      class="text-black font-medium mr-2 p-2">
      ← Home
    </router-link>
    <div class="flex justify-between items-center mb-6 mt-6">
      <h1 class="text-3xl font-semibold text-neutral-900">{{ documentName }}</h1>
    </div>
    <draggable v-model="rows" item-key="id" @end="saveRows(documentId)">
      <template #item="{ element, index }">
        <div class="grid grid-cols-2 gap-6 mb-6 border border-black rounded-lg">
          <div class="p-4 border-r border-black">
            <div v-if="element.editingLink">
              <input v-model="element.targetInput" class="border border-black mt-5 p-2 w-full rounded"
                placeholder="Github link" />
              <button @click="submitLink(index)"
                class="bg-green-800 hover:bg-green-900 text-white font-medium py-1 px-2 rounded mt-2 border border-black">
                Submit
              </button>
            </div>
            <div v-else>
              <em-github-embed :target="element.target" />
              <button @click="editLink(index)"
                class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2">
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
              <div v-html="element.note" class="prose max-w-full mt-5 p-4 rounded border border-black">
              </div>
              <div class="flex justify-end mt-2">
                <button @click="editNote(index)"
                  class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2 mt-2">
                  Edit
                </button>
                <button @click="confirmDelete(index)"
                  class="bg-slate-300 hover:bg-red-900 text-red-900 hover:text-white border border-red-900 font-medium py-1 px-2 rounded mt-2">
                  Delete
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
        editingNote: false,
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
