import _ from 'lodash';

// export type Filters = { [key: string]: string };
export type Filters = {
    [key: string]: Filter;
};

export type Filter = {
    value: string | boolean;
    // eslint-disable-next-line
    getFilterValue: (row: any) => string | boolean;
};

export function useFilters() {
    return { filterAny };
}

export function filterAny<T>(rows: T[], filters: Filters) {
    return _.filter(rows, (row) => {
        // Returns true if any of the conditions are true, or if no filter is active
        for (const filter in filters) {
            const currentFilter = filters[filter];
            const rowValue = currentFilter.getFilterValue(row);

            if (currentFilter.value) {
                if (rowValue !== currentFilter.value) {
                    return false;
                }
            }
        }
        return true;
    });
}
