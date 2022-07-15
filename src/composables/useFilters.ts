import _ from 'lodash';

// export type Filters = { [key: string]: string };
export type Filter = {
    key: string;
    value: string | boolean;
    getFilterValue: (row: any) => string | boolean;
};
export type FilterType = 'any' | 'all';

export function useFilters() {
    return { filterAny };
}

export function filterAny<T>(rows: T[], filters: Filter[]) {
    return _.filter(rows, (row) => {
        // Returns true if any of the conditions are true, or if no filter is active
        for (const filter of filters) {
            // eslint-disable-next-line
            const rowValue: string | boolean = filter.getFilterValue(row);

            if (filter.value) {
                if (rowValue !== filter.value) {
                    return false;
                }
            }
        }
        return true;
    });
}

// export function filterAll<T>(rows: T[], filters: Filter[]) {
//     return _.filter(rows, (row) => {
//         // Returns true if all of the conditions are true, or if no filter is active\
//         let rowValue: string;
//         for (const filter of filters) {
//             // eslint-disable-next-line
//             const rowValue: string | boolean = filter.getFilterValue(row);

//             if (!filter.value) {
//                 return true;
//             } else {

//             }
//         }
//         return true;
//     });
// }
