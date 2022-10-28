import {
    ThreadsManager as Manager,
    GeneratorType,
    ThreadIdent,
    ThreadOptions, PriorityType
} from "./interface";
import TimeManager from "./time-manager";

export default class ThreadsManager implements Manager {
    #threads: Map<ThreadIdent, GeneratorType> = new Map();
    #currentIdent: number = 0;
    #timeManager: TimeManager;

    constructor() {
        this.#timeManager = new TimeManager();
    }

    forEach<T>(
        iterable: Iterable<T>,
        callback: (value?: T) => unknown,
        options: ThreadOptions = {}
    ): Promise<unknown> {

        const priority = options.priority ?? "low";
        const ident = options.id === undefined ? this.#currentIdent++ : options.id;
        if (this.#threads.has(ident)) {
            throw new Error('Invalid thread id');
        }

        const gen = this.#initGenerator(iterable, callback, priority);

        this.#threads.set(ident, gen);
        this.#timeManager.addTask(ident, priority);

        return new Promise((resolve => this.#executor(gen, resolve, ident)))
    }

    get count(): number {
        return this.#timeManager.countThreads;
    }

    get executionTime(): number {
        return this.#timeManager.executionTime;
    }

    get waitingTime(): number {
        return this.#timeManager.waitingTime;
    }

    stop(threadIdent: ThreadIdent): void {
        if (this.#threads.has(threadIdent)) {
            const thread = this.#threads.get(threadIdent);
            if (thread !== undefined) {
                thread.return(null);
            }
        }
    }

    break(): void {
        for (let thread of this.#threads.values()) {
            thread.return(null);
        }
    }

    setExecutionTime(time: number): void {
        this.#timeManager.setExecutionTime(time);
    }

    setWaitingTime(time: number): void {
        this.#timeManager.setWaitingTime(time);
    }

    #executor(
        generator: Generator<0>,
        resolve: (value?: unknown) => void,
        ident: ThreadIdent
    ): void {
        let next = generator.next();
        if (!next.done) {
            setTimeout(() => this.#executor(generator, resolve, ident), this.#timeManager.waitingTime);
        } else {
            this.#timeManager.removeTask(ident);
            resolve()
        }
    }

    *#initGenerator<T>(
        iterable: Iterable<T>,
        callback: (value: T) => unknown,
        priority: PriorityType
    ): GeneratorType {

        const iter = iterable[Symbol.iterator]();
        let next = iter.next();
        let start = new Date().getTime();

        while (!next.done) {
            callback(next.value);
            let currentTime = new Date().getTime() - start;
            let maxExecutionTime = this.#timeManager.getTaskExecutionTime(priority);
            if (currentTime > maxExecutionTime) {
                yield 0;
                start = new Date().getTime();
            }
            next = iter.next();
        }
    }
}
