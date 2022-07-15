import _, { Many } from 'lodash';
import { ref, computed } from '@vue/reactivity';

import { filterAny, Filter } from './useFilters';

export interface TableOptions {
    filters?: Filter[];
    rowsPerPage: number;
    orderByKeyArray?: string[];
    orderByOrderArray?: Many<boolean | 'asc' | 'desc'>;
}

export function useTable<T>(rows: T[], options: TableOptions) {
    const activeRows = computed((): T[] => {
        let filteredRows: T[] = rows;

        if (options.filters) {
            filteredRows = filterAny(rows, options.filters);
        }

        if (options.orderByKeyArray) {
            if (options.orderByOrderArray) {
                filteredRows = _.orderBy(
                    filteredRows,
                    options.orderByKeyArray,
                    options.orderByOrderArray,
                );
            } else {
                filteredRows = _.orderBy(filteredRows, options.orderByKeyArray);
            }
        }

        const sliced = filteredRows.slice(
            currentRow.value,
            currentRow.value + options.rowsPerPage,
        );

        return sliced;
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

    const resetFilters = (): void => {
        if (options.filters) {
            for (const filter of options.filters) {
                filter.value = '';
            }
        }
        goToFirstPage();
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
        resetFilters,
    };
}
