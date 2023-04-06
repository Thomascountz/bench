import localforage from 'localforage';

class DocumentModel {
    constructor(id, name, content = []) {
        this.id = id;
        this.name = name;
        this.content = content;
    }

    static async getAllDocuments() {
        const documentIds = await localforage.getItem('documents');
        const documents = [];
        if (!documentIds) {
            return documents;
        }
        for (const id of documentIds) {
            const document = await localforage.getItem(`doc-${id}`);
            documents.push(document);
        }
        return documents;
    }

    static async getById(id) {
        const document = await localforage.getItem(`doc-${id}`);
        return new DocumentModel(document.id, document.name, document.content);
    }

    static async save(document) {
        await localforage.setItem(`doc-${document.id}`, document);
        const documents = await localforage.getItem('documents');
        if (!documents) {
            await localforage.setItem('documents', [document.id]);
            return;
        }
        documents.push(document.id);
        await localforage.setItem('documents', documents);
    }

    static async update(document) {
        await localforage.setItem(`doc-${document.id}`, document);
    }

    static async delete(id) {
        const documents = await localforage.getItem('documents');
        const index = documents.indexOf(id);
        documents.splice(index, 1)
        await localforage.setItem('documents', documents);
        await localforage.removeItem(`doc-${id}`);
    }
}

export default DocumentModel;
