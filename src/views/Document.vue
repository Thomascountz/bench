<template>
  <div class="container mx-auto my-8 px-4">
    <router-link to="/" class="text-black font-medium mr-2 p-2">
      ← Bench
    </router-link>
    <div class="flex justify-between items-center mb-6 mt-6">
      <h1 class="text-3xl font-semibold text-neutral-900">{{ documentName }}</h1>
    </div>
    <draggable v-model="rows" handle=".handle" item-key="id" @end="saveRows(documentId)">
      <template #item="{ element, index }">
        <div class="grid grid-cols-2 mb-6 border border-black rounded-lg relative">
          <!--  Handle -->
          <div class="absolute top-2 left-2 cursor-move handle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 6h12V5H4v1zm0 4h12V9H4v1zm0 4h12v-1H4v1z" clip-rule="evenodd" />
            </svg>
          </div>
          <!--  Delete Row -->
          <button @click="confirmDelete(index)" class="absolute top-2 right-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M14.707 14.707a1 1 0 0 1-1.414 0L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 1.414-1.414L10 8.586l3.293-3.293a1 1 0 0 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 0 1 0 1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <!-- Github Link -->
          <div class="p-4">
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
          <!-- Note -->
          <div class="p-4 bg-zinc-100 m-1 rounded">
            <div v-if="element.editingNote">
              <tip-tap-editor v-model="element.note" />
              <div class="flex justify-end mt-2">
                <button @click="saveNote(index)"
                  class="bg-green-800 hover:bg-green-900 text-white font-medium py-1 px-2 rounded mr-2 mt-2">
                  Save
                </button>
                <button @click="confirmCancelNote(index)"
                  class="bg-slate-300 hover:bg-red-900 text-red-900 hover:text-white border border-red-900 font-medium py-1 px-2 rounded mt-2">
                  Cancel
                </button>
              </div>
            </div>
            <div v-else>
              <div class="rounded border border-black mt-4">
                <div v-html="element.note" class="prose max-w-full p-4 rounded-t bg-white">
                </div>
                <div class="flex justify-end p-0 rounded-b mt-0 py-2 bg-gray-200 metadata">
                  <span class="mr-4 p-0 text-xs font-mono font-bold text-gray-500">
                    Created: {{ formatDistanceToNow(new Date(element.createdAt), { addSuffix: true }) }}
                  </span>
                  <span v-if="element.updatedAt != element.createdAt"
                    class="mr-4 p-0 text-xs font-mono font-bold text-gray-500 ">
                    edited
                  </span>
                </div>
              </div>
              <div class="flex justify-end mt-2">
                <div>
                  <button @click="editNote(index)"
                    class="bg-slate-300 border border-black hover:bg-slate-400 text-black font-medium py-1 px-2 rounded mr-2 mt-2">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!--  Add Row -->
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
import { formatDistanceToNow } from 'date-fns';
import EmGithubEmbed from '@/components/EmGithubEmbed.vue';
import TipTapEditor from '@/components/TipTapEditor.vue';
import draggable from 'vuedraggable';
import DocumentModel from '@/models/DocumentModel';
import RowModel from '@/models/RowModel';

export default {
  name: 'DocumentPage',
  components: {
    TipTapEditor,
    EmGithubEmbed,
    draggable,
  },
  setup() {
    const rows = ref([]);
    const route = useRoute();
    const documentId = route.params.id;
    const documentName = ref('');

    const addRow = () => {
      const id = Math.max(...rows.value.map((row) => row.id), 0) + 1;
      const newRow = new RowModel(id, '', '');
      newRow.editingLink = true;
      newRow.previousLink = '';
      newRow.editingNote = true;
      newRow.previousNote = '';
      newRow.targetInput = '';
      rows.value.push(newRow);
      saveRows(documentId);
    };

    const submitLink = (index) => {
      rows.value[index].target = rows.value[index].targetInput;
      rows.value[index].editingLink = false;
      saveRows(documentId);
    };

    const editLink = (index) => {
      rows.value[index].previousLink = rows.value[index].target;
      rows.value[index].editingLink = true;
      saveRows(documentId);
    };

    const cancelLink = (index) => {
      rows.value[index].editingLink = false;
      rows.value[index].target = rows.value[index].previousLink;
      saveRows(documentId);
      rows.value[index].previousLink = '';
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
      rows.value[index].previousNote = rows.value[index].note;
      rows.value[index].editingNote = true;
    };

    const saveNote = (index) => {
      const now = new Date()
      rows.value[index].editingNote = false;
      if (rows.value[index].note == rows.value[index].previousNote) {
        cancelNote(index);
      } else {
        rows.value[index].updatedAt = now;
        if (rows.value[index].createdAt == null) {
          rows.value[index].createdAt = now;
        }
        saveRows(documentId);
      }
    };

    const confirmCancelNote = (index) => {
      if (rows.value[index].note == rows.value[index].previousNote) {
        cancelNote(index);
      }
      else if (confirm("Are you sure you want to discard your changes?")) {
        cancelNote(index);
      }
    };

    const cancelNote = (index) => {
      rows.value[index].editingNote = false;
      rows.value[index].note = rows.value[index].previousNote;
      rows.value[index].previousNote = '';
      saveRows(documentId);
    };

    loadDocument();

    return {
      formatDistanceToNow,
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
      confirmCancelNote,
      cancelNote,
      documentName
    };
  },
};
</script>
