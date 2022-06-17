import _ from 'lodash';
import { TimeEntry } from './ApiData';

export interface TrackStat {
    trackSlug: string;
    totalTimes: number;
}

export class PlayerStats {
    public currentRecords: TimeEntry[] = [];
    public currentRecordTotal = 0;
    public recordImprovements: TimeEntry[] = [];
    public recordImprovementTotal = 0;
    public trackMap: { [key: string]: number } = {};
    public trackStats: TrackStat[] = [];

    constructor(public playerId: string, public times: TimeEntry[]) {
        this.buildRecords();
        this.buildTrackMap();
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

    private buildTrackMap(): void {
        for (const time of this.times) {
            if (this.trackMap[time.trackSlug]) {
                this.trackMap[time.trackSlug] =
                    this.trackMap[time.trackSlug] + 1;
            } else {
                this.trackMap[time.trackSlug] = 1;
            }
        }
        const trackStatsArr = [];
        for (const track in this.trackMap) {
            trackStatsArr.push({
                trackSlug: track,
                totalTimes: this.trackMap[track],
            });
        }
        this.trackStats = trackStatsArr;
    }

    public getFavoriteTrack(): string {
        const track = _.maxBy(this.trackStats, 'totalTimes');
        return track?.trackSlug || 'none';
    }
}
