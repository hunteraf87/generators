export type ThreadIdent = unknown;
export type GeneratorType = Generator<0>
export type PriorityType = 'critical' | 'high' | 'low';

export type ThreadOptions = {
    priority?: PriorityType,
    id?: ThreadIdent
}

export type StatusTypeThread = {
    ids: Array<ThreadIdent>,
    executionTime: number
}

export type StatusManager = {
    [key in PriorityType]: StatusTypeThread;
};

export interface ThreadsManager {
    forEach<T>(
        iterable: Iterable<T>,
        callback: (value?: T) => unknown,
        options?: ThreadOptions
    ): Promise<unknown>;
    stop(threadIdent: ThreadIdent): void;
    setExecutionTime(time: number): void;
    setWaitingTime(time: number): void;
    break(): void;

    get count(): number;
    get executionTime(): number;
    get waitingTime(): number;
}

export interface TimeManager {
    addTask(ident: ThreadIdent, type: PriorityType): void;
    removeTask(ident: ThreadIdent): void;
    setExecutionTime(time: number): void;
    setWaitingTime(time: number): void;
    getTaskExecutionTime(type: PriorityType): number;
    get executionTime(): number;
    get waitingTime(): number;
    get countThreads(): number;
}