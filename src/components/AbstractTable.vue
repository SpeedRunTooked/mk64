<script>
import { mapState } from 'vuex';

export default {
    data: () => ({
        showFilters: false,
        currentRow: 0,
        filters: {},
        sortBy: '',
        orderBy: 'desc',
        rowsPerPage: 10,
    }),

    computed: {
        ...mapState(['account', 'options']),
        rows() {
            return [];
        },
        totalRows() {
            return this.rows.length;
        },
        firstRow() {
            if (this.totalRows === 0) {
                return 0;
            }
            return this.currentRow + 1;
        },
        lastRow() {
            if (this.totalRows === 0) {
                return 0;
            }
            const lastRow = this.currentRow + this.rowsPerPage;
            return lastRow >= this.totalRows
                ? this.totalRows - this.currentRow + this.firstRow - 1
                : lastRow;
        },
        activeRows() {
            return this.rows.slice(
                this.currentRow,
                this.currentRow + this.rowsPerPage,
            );
        },
        emptyRows() {
            return this.rowsPerPage - this.activeRows.length;
        },
    },

    methods: {
        isEmpty() {
            return this.rows.length === 0;
        },
        previousPageExists() {
            if (this.currentRow > 0) {
                return true;
            }
            return false;
        },
        nextpageExists() {
            if (this.currentRow + this.rowsPerPage < this.totalRows) {
                return true;
            }
            return false;
        },
        rowsLargerThanLimit() {
            return this.rows.length > this.rowsPerPage;
        },
        goToFirstPage() {
            this.currentRow = 0;
        },
        goToLastPage() {
            const remainder = this.totalRows % this.rowsPerPage;
            if (remainder === 0) {
                this.currentRow = this.totalRows - this.rowsPerPage;
            } else {
                this.currentRow = this.totalRows - remainder;
            }
        },
        goToPreviousPage() {
            if (this.currentRow < this.rowsPerPage) {
                this.currentRow = 0;
            } else {
                this.currentRow -= this.rowsPerPage;
            }
        },
        goToNextPage() {
            this.currentRow += this.rowsPerPage;
        },
        changeSort(name, order) {
            if (order) {
                this.orderBy = order;
            } else {
                if (name === this.sortBy) {
                    this.orderBy = this.orderBy === 'asc' ? 'desc' : 'asc';
                }
            }
            this.sortBy = name;
        },
        getSet(field, transform = (i) => i, reverseSort = false) {
            const values = this.rows.map((p) => p[field]);
            values.sort();
            if (reverseSort) {
                values.reverse();
            }
            var transformedValued = values.map((i) => transform(i));
            return new Set(transformedValued);
        },
    },
};
</script>
