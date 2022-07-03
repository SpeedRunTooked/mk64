import _ from 'lodash';
import { Run } from './Run';
import { Subcategory } from './Subcategory';
import { Time } from './Time';

export interface MostPlayedSubcategory {
    subcategory: Subcategory;
    attempts: number;
}

export class RunStats {
    public runList: Run[] = [];

    constructor(times: Time[]) {
        this.buildRunList(times);
    }

    public getMostPopularRuns(): Run[] {
        return _.orderBy(this.runList, ['attempts'], ['desc']);
    }

    public getMostPlayedSubcategories(categorySlug?: string) {
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
