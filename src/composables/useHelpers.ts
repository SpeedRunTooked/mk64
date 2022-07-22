import { Category } from '@/game/Category';
import { Game } from '@/game/Game';
import { createSetFromArray, createArrayFromSet } from '@/helpers';

export function useHelpers() {
    function linkPresent(text: string) {
        return text.substring(0, 4) === 'http';
    }

    function getGameDefaultEntryTypeText(game: Game) {
        if (game.config.defaultEntryType === 'timeMs') return 'Time';
        return 'Score';
    }

    function getEntryTypeText(category: Category) {
        if (category.entryType === 'timeMs') return 'Time';
        return 'Score';
    }

    createSetFromArray;

    return {
        linkPresent,
        getEntryTypeText,
        getGameDefaultEntryTypeText,
        createSetFromArray,
        createArrayFromSet,
    };
}
