import _, { Many } from 'lodash';
import { ref, computed, Ref } from '@vue/reactivity';

import { filterAny, Filters } from './useFilters';

export interface TableOptions {
    rowsPerPage: Ref<string>;
    orderByKeyArray?: string[];
    orderByOrderArray?: Many<boolean | 'asc' | 'desc'>;
}

export interface FilterDropdowns {
    [key: string]: string | number;
}

export function useTable<T>(
    rows: T[],
    options: TableOptions,
    filters?: Filters,
    filterDropdowns?: FilterDropdowns,
) {
    const rowsPerPage = computed(() => Number(options.rowsPerPage.value));
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
            currentRow.value + rowsPerPage.value,
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
        const lastRow = currentRow.value + rowsPerPage.value;
        return lastRow >= totalRows.value
            ? totalRows.value - currentRow.value + firstRow.value - 1
            : lastRow;
    });

    const emptyRows = computed((): number => {
        return rowsPerPage.value - activeRows.value.length;
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
        if (currentRow.value + rowsPerPage.value < totalRows.value) {
            return true;
        }
        return false;
    });

    const rowsLargerThanLimit = computed((): boolean => {
        return rows.length > rowsPerPage.value;
    });

    const goToFirstPage = (): void => {
        currentRow.value = 0;
    };

    const goToLastPage = (): void => {
        const remainder = totalRows.value % rowsPerPage.value;
        if (remainder === 0) {
            currentRow.value = totalRows.value - rowsPerPage.value;
        } else {
            currentRow.value = totalRows.value - remainder;
        }
    };

    const goToPreviousPage = (): void => {
        if (currentRow.value < rowsPerPage.value) {
            currentRow.value = 0;
        } else {
            currentRow.value -= rowsPerPage.value;
        }
    };

    const goToNextPage = (): void => {
        currentRow.value += rowsPerPage.value;
    };

    const resetFilters = (): void => {
        if (filterDropdowns) {
            for (const key in filterDropdowns) {
                filterDropdowns[key] = '';
            }
        }
        goToFirstPage();
    };

    const setFilter = (key: string, filterValue: string): void => {
        if (filterDropdowns) {
            filterDropdowns[key] = filterValue;
        }
        goToFirstPage();
    };

    const filterOn = computed((): boolean => {
        for (const key in filterDropdowns) {
            if (filterDropdowns[key]) return true;
        }
        return false;
    });

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
        setFilter,
        resetFilters,
        filterOn,
    };
}
