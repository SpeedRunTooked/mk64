import { computed } from '@vue/reactivity';

import { Filters, FilterType, filterAny } from './useFilters';

export interface TableOptions {
    filters?: Filters;
    filterType?: FilterType;
    rowsPerPage: number;
}

export function useTable<T>(rows: T[], options: TableOptions) {
    const activeRows = computed((): T[] => {
        let filteredRows: T[] = [];

        if (options?.filters && options?.filterType === 'any') {
            filteredRows = filterAny(rows, options.filters);
        }

        return filteredRows.splice(0, options.rowsPerPage);
    });

    return { activeRows };
}
