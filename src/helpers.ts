const createSetFromArray = <T>(array: T[]): Set<T> => {
    const result = new Set<T>();
    for (const item of array) {
        result.add(item);
    }
    return result;
};

const createArrayFromSet = <T>(set: Set<T>): T[] => {
    const result = [];
    for (const item of set.values()) {
        result.push(item);
    }
    return result;
};

export { createArrayFromSet, createSetFromArray };
