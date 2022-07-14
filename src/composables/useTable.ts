import { computed } from '@vue/reactivity';
import _ from 'lodash';

export interface TableOptions {
    filters?: { [key: string]: boolean };
    filterType?: string;
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

function filterAny<T>(rows: T[], filters: TableOptions['filters']) {
    return _.filter(rows, (row) => {
        // Returns true if any of the conditions are true, or if no filter is active
        for (const filter in filters) {
            // eslint-disable-next-line
            const rowValue: boolean = (row as any)[filter];

            if (filters[filter]) {
                if (filters[filter] === rowValue) {
                    return true;
                }
                if (filters[filter] !== rowValue) {
                    return false;
                }
            }
        }
        return true;
    });
}
