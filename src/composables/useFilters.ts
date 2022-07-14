import _ from 'lodash';

export type Filters = { [key: string]: boolean };
export type FilterType = 'any' | 'all';

export function useFilters() {
    return { filterAny };
}

export function filterAny<T>(rows: T[], filters: Filters) {
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
