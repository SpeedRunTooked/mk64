import _ from 'lodash';

// export type Filters = { [key: string]: string };
export type Filter = {
    key: string;
    value: string | boolean;
    // eslint-disable-next-line
    getFilterValue: (row: any) => string | boolean;
};

export function useFilters() {
    return { filterAny };
}

export function filterAny<T>(rows: T[], filters: Filter[]) {
    return _.filter(rows, (row) => {
        // Returns true if any of the conditions are true, or if no filter is active
        for (const filter of filters) {
            const rowValue = filter.getFilterValue(row);

            if (filter.value) {
                if (rowValue !== filter.value) {
                    return false;
                }
            }
        }
        return true;
    });
}
