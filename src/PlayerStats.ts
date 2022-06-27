import _ from 'lodash';
import { Category } from './game/Category';
import { Time } from './game/Time';

export interface SubcategoryStat {
    subcategorySlug: string;
    totalTimes: number;
}

export class PlayerStats {
    public currentRecords: Time[] = [];
    public currentRecordTotal = 0;
    public recordImprovements: Time[] = [];
    public recordImprovementTotal = 0;
    public subcategoryMap: { [key: string]: number } = {};
    public subcategoryStats: SubcategoryStat[] = [];

    constructor(public playerId: string, public times: Time[]) {
        this.buildRecords();
        this.buildSubcategoryMap();
    }

    private buildRecords(): void {
        this.currentRecords = _.filter(this.times, (x) => x.isCurrentRecord);
        this.currentRecordTotal = this.currentRecords.length;
        this.recordImprovements = _.filter(
            this.times,
            (x) => x.isRecordImprovement,
        );
        this.recordImprovementTotal = this.recordImprovements.length;
    }

    private buildSubcategoryMap(): void {
        for (const time of this.times) {
            const key = `${time.category.slug}:${time.subcategory}`;
            if (this.subcategoryMap[key]) {
                this.subcategoryMap[key] = this.subcategoryMap[key] + 1;
            } else {
                this.subcategoryMap[key] = 1;
            }
        }
        const subcategoryStatsArr = [];
        for (const key in this.subcategoryMap) {
            subcategoryStatsArr.push({
                categorySlug:new Category(key.split(':')[0], this.subcategoryMap[key].json)
                subcategorySlug: key.split(':')[1],
                totalTimes: this.subcategoryMap[key],
            });
        }
        this.subcategoryStats = subcategoryStatsArr;
    }

    public getRecord(
        subcategorySlug: string,
        categorySlug: string,
    ): Time | null {
        const filtered = this.times.filter((x) => {
            return (
                x.subcategory === subcategorySlug &&
                x.category.slug === categorySlug
            );
        });
        return _.minBy(filtered, 'timeMs') || null;
    }

    public getFavoriteCategory(): Category {
        const subcategory = _.maxBy(this.subcategoryStats, 'totalTimes');
        return subcategory || 'none';
    }

    public getFavoriteSubcategory(): string {
        const subcategory = _.maxBy(this.subcategoryStats, 'totalTimes');
        return subcategory?.subcategorySlug || 'none';
    }
}
