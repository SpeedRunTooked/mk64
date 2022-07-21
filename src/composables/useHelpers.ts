import { Category } from '@/game/Category';
import { Game } from '@/game/Game';

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

    return { linkPresent, getEntryTypeText, getGameDefaultEntryTypeText };
}
