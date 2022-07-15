import _, { Many } from 'lodash';
import { ref, computed } from '@vue/reactivity';

import { filterAny, Filters } from './useFilters';

export interface TableOptions {
    rowsPerPage: number;
    orderByKeyArray?: string[];
    orderByOrderArray?: Many<boolean | 'asc' | 'desc'>;
}

export interface FilterDropdowns {
    [key: string]: string;
}

export function useTable<T>(
    rows: T[],
    filters?: Filters,
    filterDropdowns?: FilterDropdowns,
    options?: TableOptions,
) {
    const rowsPerPage = options?.rowsPerPage || 10;

    const activeRows = computed((): T[] => {
        let filteredRows: T[] = rows;

        if (filters) {
            filteredRows = filterAny(rows, filters);
        }

        if (options?.orderByKeyArray) {
            if (options?.orderByOrderArray) {
                filteredRows = _.orderBy(
                    filteredRows,
                    options?.orderByKeyArray,
                    options?.orderByOrderArray,
                );
            } else {
                filteredRows = _.orderBy(
                    filteredRows,
                    options?.orderByKeyArray,
                );
            }
        }

        const sliced = filteredRows.slice(
            currentRow.value,
            currentRow.value + rowsPerPage,
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
        const lastRow = currentRow.value + rowsPerPage;
        return lastRow >= totalRows.value
            ? totalRows.value - currentRow.value + firstRow.value - 1
            : lastRow;
    });

    const emptyRows = computed((): number => {
        return rowsPerPage - activeRows.value.length;
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
        if (currentRow.value + rowsPerPage < totalRows.value) {
            return true;
        }
        return false;
    });

    const rowsLargerThanLimit = computed((): boolean => {
        return rows.length > rowsPerPage;
    });

    const goToFirstPage = (): void => {
        currentRow.value = 0;
    };

    const goToLastPage = (): void => {
        const remainder = totalRows.value % rowsPerPage;
        if (remainder === 0) {
            currentRow.value = totalRows.value - rowsPerPage;
        } else {
            currentRow.value = totalRows.value - remainder;
        }
    };

    const goToPreviousPage = (): void => {
        if (currentRow.value < rowsPerPage) {
            currentRow.value = 0;
        } else {
            currentRow.value -= rowsPerPage;
        }
    };

    const goToNextPage = (): void => {
        currentRow.value += rowsPerPage;
    };

    const resetFilters = (): void => {
        if (filterDropdowns) {
            for (const key in filterDropdowns) {
                filterDropdowns[key] = '';
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
