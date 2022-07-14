import { ref, computed } from '@vue/reactivity';

import { Filters, FilterType, filterAny } from './useFilters';

export interface TableOptions {
    filters?: Filters;
    filterType?: FilterType;
    rowsPerPage: number;
}

export function useTable<T>(rows: T[], options: TableOptions) {
    const activeRows = computed((): T[] => {
        let filteredRows: T[] = rows;

        if (options?.filters && options?.filterType === 'any') {
            filteredRows = filterAny(rows, options.filters);
        }

        // filteredRows = filteredRows.splice(0, options.rowsPerPage);
        return filteredRows.slice(
            currentRow.value,
            currentRow.value + options.rowsPerPage,
        );
    });

    const currentRow = ref(0);

    const totalRows = computed((): number => {
        return rows.length;
    });

    const firstRow = computed((): number => {
        if (totalRows.value === 0) {
            return 0;
        }
        return currentRow.value + 1;
    });

    const lastRow = computed((): number => {
        if (totalRows.value === 0) {
            return 0;
        }
        const lastRow = currentRow.value + options.rowsPerPage;
        return lastRow >= totalRows.value
            ? totalRows.value - currentRow.value + firstRow.value - 1
            : lastRow;
    });

    const emptyRows = computed((): number => {
        return options.rowsPerPage - activeRows.value.length;
    });

    const isEmpty = computed((): boolean => {
        return rows.length === 0;
    });

    const previousPageExists = computed((): boolean => {
        if (currentRow.value > 0) {
            return true;
        }
        return false;
    });

    const nextPageExists = computed((): boolean => {
        if (currentRow.value + options.rowsPerPage < totalRows.value) {
            return true;
        }
        return false;
    });

    const rowsLargerThanLimit = computed((): boolean => {
        return rows.length > options.rowsPerPage;
    });

    const goToFirstPage = (): void => {
        currentRow.value = 0;
    };

    const goToLastPage = (): void => {
        const remainder = totalRows.value % options.rowsPerPage;
        if (remainder === 0) {
            currentRow.value = totalRows.value - options.rowsPerPage;
        } else {
            currentRow.value = totalRows.value - remainder;
        }
    };

    const goToPreviousPage = (): void => {
        if (currentRow.value < options.rowsPerPage) {
            currentRow.value = 0;
        } else {
            currentRow.value -= options.rowsPerPage;
        }
    };
    const goToNextPage = (): void => {
        currentRow.value += options.rowsPerPage;
    };

    return {
        rows,
        options,
        activeRows,
        totalRows,
        firstRow,
        lastRow,
        emptyRows,
        isEmpty,
        previousPageExists,
        nextPageExists,
        rowsLargerThanLimit,
        goToFirstPage,
        goToLastPage,
        goToPreviousPage,
        goToNextPage,
    };
}
