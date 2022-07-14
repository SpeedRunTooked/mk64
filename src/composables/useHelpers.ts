export function useHelpers() {
    function linkPresent(text: string) {
        return text.substring(0, 4) === 'http';
    }

    return { linkPresent };
}
