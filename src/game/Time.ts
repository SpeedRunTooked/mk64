import { TimeJSON } from 'ApiTypes';
import { Game } from './Game';
import { Entry } from './Entry';

export class Time extends Entry {
    public timeMs: number;
    public timeElapsed: string;
    public entryTypeSlug = 'time';

    constructor(id: string, timeJson: TimeJSON, game: Game) {
        super(id, timeJson, game);
        this.timeMs = Number(timeJson.timeMs);
        this.timeElapsed = Time.msToElapsedTime(Number(timeJson.timeMs));
    }

    public static zeroPad(num: number, places: number): string {
        return String(num).padStart(places, '0');
    }
    public static msToElapsedTime(ms: number): string {
        const min = Math.floor(ms / 60000);
        const sec = Time.zeroPad(Math.floor((ms - min * 60000) / 1000), 2);
        const dec = Time.zeroPad(Math.floor((ms / 10) % 100), 2);
        return `${min}'${sec}"${dec}`;
    }
    public static elapsedTimeToMs(elapsed: string): number {
        const min = elapsed.split("'")[0];
        const sec = elapsed.split("'")[1].split('"')[0];
        const dec = elapsed.split("'")[1].split('"')[1];
        const ms = 10 ** (3 - dec.length) * Number(dec);

        return Number(min) * 60 * 1000 + Number(sec) * 1000 + Number(ms);
    }
}
