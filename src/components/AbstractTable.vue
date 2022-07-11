<script lang="ts">
import { defineComponent } from 'vue';

export interface Row {
    [key: string]: string;
}

export default defineComponent({
    data: () => ({
        showFilters: false,
        currentRow: 0,
        filters: {},
        sortBy: '',
        orderBy: 'desc',
        rowsPerPage: 10,
    }),

    computed: {
        rows(): Row[] {
            return [];
        },

        totalRows(): number {
            return this.rows.length;
        },
        firstRow(): number {
            if (this.totalRows === 0) {
                return 0;
            }
            return this.currentRow + 1;
        },
        lastRow(): number {
            if (this.totalRows === 0) {
                return 0;
            }
            const lastRow = this.currentRow + this.rowsPerPage;
            return lastRow >= this.totalRows
                ? this.totalRows - this.currentRow + this.firstRow - 1
                : lastRow;
        },

        emptyRows(): number {
            return this.rowsPerPage - this.getActiveRows().length;
        },
    },

    methods: {
        getActiveRows(): any[] {
            return this.rows.slice(
                this.currentRow,
                this.currentRow + this.rowsPerPage,
            );
        },
        isEmpty(): boolean {
            return this.rows.length === 0;
        },
        previousPageExists(): boolean {
            if (this.currentRow > 0) {
                return true;
            }
            return false;
        },
        nextPageExists(): boolean {
            if (this.currentRow + this.rowsPerPage < this.totalRows) {
                return true;
            }
            return false;
        },
        rowsLargerThanLimit(): boolean {
            return this.rows.length > this.rowsPerPage;
        },
        goToFirstPage(): void {
            this.currentRow = 0;
        },
        goToLastPage(): void {
            const remainder = this.totalRows % this.rowsPerPage;
            if (remainder === 0) {
                this.currentRow = this.totalRows - this.rowsPerPage;
            } else {
                this.currentRow = this.totalRows - remainder;
            }
        },
        goToPreviousPage(): void {
            if (this.currentRow < this.rowsPerPage) {
                this.currentRow = 0;
            } else {
                this.currentRow -= this.rowsPerPage;
            }
        },
        goToNextPage(): void {
            this.currentRow += this.rowsPerPage;
        },
        changeSort(name: string, order: string): void {
            if (order) {
                this.orderBy = order;
            } else {
                if (name === this.sortBy) {
                    this.orderBy = this.orderBy === 'asc' ? 'desc' : 'asc';
                }
            }
            this.sortBy = name;
        },
    },
});
</script>
