import {TimeManager as Manager, PriorityType, StatusManager, ThreadIdent} from "./interface";

export default class TimeManager implements Manager {
    #status: StatusManager
    #executionTime: number = 100;
    #waitingTime: number = 100;

    constructor() {
        this.#status = TimeManager.#emptyStatus();
    }

    static #emptyStatus(): StatusManager {
        return {
            critical: {
                ids: [],
                executionTime: 0
            },
            high: {
                ids: [],
                executionTime: 0
            },
            low: {
                ids: [],
                executionTime: 0
            }
        }
    }

    addTask(ident: ThreadIdent, type: PriorityType): void {
        this.#status[type].ids.push(ident);
        this.#updateExecutionTime();
    }

    removeTask(ident: ThreadIdent): void {
        for (let key of Object.keys(this.#status)) {
            this.#status[<PriorityType>key].ids = this.#status[<PriorityType>key].ids.filter(el => el !== ident);
        }
        this.#updateExecutionTime();
    }

    #updateExecutionTime() {
        let free = this.#executionTime;

        let count = Object.keys(this.#status).reduce((initial, key) => {
            if (this.#status[<PriorityType>key].ids.length) {
                initial++;
            }
            return initial;
        }, 0)

        const k = (count: number) => {
            switch (count) {
                case 2: return 0.7;
                case 3: return 0.5;
                default: return 1;
            }
        }

        Object.keys(this.#status).forEach(key => {
            const item = this.#status[<PriorityType>key];
            if (item.ids.length) {
                item.executionTime = free * k(count);
                free -= item.executionTime;
                count--;
            } else {
                item.executionTime = 0;
            }
        });
    }

    setExecutionTime(time: number): void {
        this.#executionTime = time;
    }

    setWaitingTime(time: number): void {
        this.#waitingTime = time;
    }

    getTaskExecutionTime(type: PriorityType): number {
        const data = this.#status[type];
        return Math.floor(data.executionTime / data.ids.length)
    }

    get executionTime(): number {
        return this.#executionTime;
    }

    get waitingTime(): number {
        return this.#waitingTime;
    }

    get countThreads(): number {
        return Object.keys(this.#status).reduce((initial, key) => {
            initial += this.#status[<PriorityType>key].ids.length;
            return initial;
        }, 0)
    }
}