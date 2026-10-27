export interface ApplicationItemRef {
    namespace: string,
    code: string,
    id: string,
}

// Возможно переделать в класс
export interface TDatetime {
    day: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    month: number;
    seconds: number;
    year: number;

    // add(duration: TDuration): TDatetime;
    // addDate(years: number, month: number, days: number): TDatetime;
    // after(date: TDatetime): boolean;
    // afterOrEqual(date: TDatetime): boolean;
    // asDate(): globalThis.Date;
    // before(date: TDatetime): boolean;
    // beforeOrEqual(date: TDatetime): boolean;
    // equal(date: TDatetime): boolean;
    // format(format?: string): string;
    // getDate(tz?: TTimezone): TDate;
    // getTime(tz?: TTimezone): TTime;
    // getTz(): TTimezone;
    // sub(date: TDatetime): TDuration;
    // truncateTime(): TDatetime;
    // unix(): number;
    // utc(): TDatetime;
}

export interface TDuration { /* ... */ }
export interface TDate { /* ... */ }
export interface TTime { /* ... */ }
export interface TTimezone { /* ... */ }

export interface ProcessTaskData {
    __id: string;
    __createdAt: TDatetime;
    __createdBy: ApplicationItemRef;
    __updatedAt: TDatetime;
    __updatedBy: ApplicationItemRef;
    __item: ApplicationItemRef;
    performers: ApplicationItemRef[];
    __name: string;
    state: {
        code: string,
        name: string
    };
    dueDate?: TDatetime;
    priority: number
}