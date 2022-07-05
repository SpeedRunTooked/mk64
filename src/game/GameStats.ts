import _ from 'lodash';
import { Game } from './Game';
import { Run } from './Run';
import { Subcategory } from './Subcategory';
import { Time } from './Time';

export interface MostPlayedSubcategory {
    subcategory: Subcategory;
    attempts: number;
}

export class GameStats {
    public runList: Run[] = [];

    constructor(game: Game, times: Time[]) {
        this.buildRunList(times);
        this.buildMostContestedSubcategories(game);
    }

    public getMostPopularRuns(): Run[] {
        return _.orderBy(this.runList, ['attempts'], ['desc']);
    }

    public getMostContested(): Run[] {
        return _.orderBy(
            this.runList,
            ['timesContested', 'attemts'],
            ['desc', 'desc'],
        );
    }

    public getMostPlayedSubcategories(
        categorySlug?: string,
    ): MostPlayedSubcategory[] {
        let runs = this.runList;
        const mostPlayedSubcategories: MostPlayedSubcategory[] = [];

        if (categorySlug) {
            runs = this.runList.filter(
                (run) => run.category.slug === categorySlug,
            );
        }

        for (const run of runs) {
            const mostPlayedEntry = mostPlayedSubcategories.find(
                (mostPlayed) =>
                    mostPlayed.subcategory.slug === run.subcategory.slug,
            );

            if (mostPlayedEntry) {
                mostPlayedEntry.attempts += run.attempts;
            } else {
                mostPlayedSubcategories.push({
                    subcategory: run.subcategory,
                    attempts: run.attempts,
                });
            }
        }
        return _.orderBy(mostPlayedSubcategories, ['attempts'], ['desc']);
    }

    private buildMostContestedSubcategories(game: Game): void {
        for (const run of this.runList) {
            run.timesContested = this.calculateMostContested(
                game.getTimes(run.category.slug, run.subcategory.slug),
            );
        }
    }

    private calculateMostContested(timeList: Time[]): number {
        const recordImprovements = _.filter(
            timeList,
            (time) => time.isRecordImprovement === true,
        );
        console.log(recordImprovements);
        const recordImprovementsSorted = _.orderBy(
            recordImprovements,
            ['created'],
            ['asc'],
        );
        console.log(recordImprovementsSorted);
        let count = 0;

        for (let i = 0; i < recordImprovementsSorted.length; i++) {
            if (i > 0) {
                if (
                    recordImprovements[i].user !==
                    recordImprovements[i - 1].user
                )
                    count++;
            }
        }

        return count;
    }

    private buildRunList(times: Time[]): void {
        for (const time of times) {
            const existingRun = this.runList.find(
                (run) =>
                    run.category == time.category &&
                    run.subcategory === time.subcategory,
            );
            if (existingRun) {
                existingRun.increaseCounter();
            } else {
                this.runList.push(new Run(time.category, time.subcategory));
            }
        }
    }
}
