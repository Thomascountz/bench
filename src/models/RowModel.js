class RowModel {
    constructor(id, target, note) {
        this.id = id;
        this.target = target || '';
        this.note = note || '';
    }
}

export default RowModel;
