class RowModel {
    constructor(id, target, note, rawCode) {
        this.id = id;
        this.target = target || '';
        this.note = note || '';
        this.rawCode = rawCode || '';
        this.createdAt = null;
        this.updatedAt = null;
    }
}

export default RowModel;
