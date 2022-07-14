import { computed } from '@vue/reactivity';
import _ from 'lodash';

export interface TableOptions {
    booleanFilters?: { [key: string]: boolean };
    rowsPerPage: number;
}

export function useTable<T>(rows: T[], options: TableOptions) {
    const activeRows = computed((): T[] => {
        let filteredRows: T[] = [];

        if (options?.booleanFilters) {
            filteredRows = _.filter(rows, (row) => {
                for (const filter in options.booleanFilters) {
                    // eslint-disable-next-line
                    const rowValue: boolean = (row as any)[filter];

                    if (options.booleanFilters[filter]) {
                        if (options.booleanFilters[filter] === rowValue) {
                            return true;
                        }
                        if (options.booleanFilters[filter] !== rowValue) {
                            return false;
                        }
                    }
                }
                return true;
            });
        }
        return filteredRows.splice(0, options.rowsPerPage);
    });

    return { activeRows };
}
