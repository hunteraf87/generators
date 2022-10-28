"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _TimeManager_instances, _a, _TimeManager_status, _TimeManager_executionTime, _TimeManager_waitingTime, _TimeManager_emptyStatus, _TimeManager_updateExecutionTime;
Object.defineProperty(exports, "__esModule", { value: true });
class TimeManager {
    constructor() {
        _TimeManager_instances.add(this);
        _TimeManager_status.set(this, void 0);
        _TimeManager_executionTime.set(this, 100);
        _TimeManager_waitingTime.set(this, 100);
        __classPrivateFieldSet(this, _TimeManager_status, __classPrivateFieldGet(TimeManager, _a, "m", _TimeManager_emptyStatus).call(TimeManager), "f");
    }
    addTask(ident, type) {
        __classPrivateFieldGet(this, _TimeManager_status, "f")[type].ids.push(ident);
        __classPrivateFieldGet(this, _TimeManager_instances, "m", _TimeManager_updateExecutionTime).call(this);
    }
    removeTask(ident) {
        for (let key of Object.keys(__classPrivateFieldGet(this, _TimeManager_status, "f"))) {
            __classPrivateFieldGet(this, _TimeManager_status, "f")[key].ids = __classPrivateFieldGet(this, _TimeManager_status, "f")[key].ids.filter(el => el !== ident);
        }
        __classPrivateFieldGet(this, _TimeManager_instances, "m", _TimeManager_updateExecutionTime).call(this);
    }
    setExecutionTime(time) {
        __classPrivateFieldSet(this, _TimeManager_executionTime, time, "f");
    }
    setWaitingTime(time) {
        __classPrivateFieldSet(this, _TimeManager_waitingTime, time, "f");
    }
    getTaskExecutionTime(type) {
        const data = __classPrivateFieldGet(this, _TimeManager_status, "f")[type];
        return Math.floor(data.executionTime / data.ids.length);
    }
    get executionTime() {
        return __classPrivateFieldGet(this, _TimeManager_executionTime, "f");
    }
    get waitingTime() {
        return __classPrivateFieldGet(this, _TimeManager_waitingTime, "f");
    }
    get countThreads() {
        return Object.keys(__classPrivateFieldGet(this, _TimeManager_status, "f")).reduce((initial, key) => {
            initial += __classPrivateFieldGet(this, _TimeManager_status, "f")[key].ids.length;
            return initial;
        }, 0);
    }
}
exports.default = TimeManager;
_a = TimeManager, _TimeManager_status = new WeakMap(), _TimeManager_executionTime = new WeakMap(), _TimeManager_waitingTime = new WeakMap(), _TimeManager_instances = new WeakSet(), _TimeManager_emptyStatus = function _TimeManager_emptyStatus() {
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
    };
}, _TimeManager_updateExecutionTime = function _TimeManager_updateExecutionTime() {
    let free = __classPrivateFieldGet(this, _TimeManager_executionTime, "f");
    let count = Object.keys(__classPrivateFieldGet(this, _TimeManager_status, "f")).reduce((initial, key) => {
        if (__classPrivateFieldGet(this, _TimeManager_status, "f")[key].ids.length) {
            initial++;
        }
        return initial;
    }, 0);
    const k = (count) => {
        switch (count) {
            case 2: return 0.7;
            case 3: return 0.5;
            default: return 1;
        }
    };
    Object.keys(__classPrivateFieldGet(this, _TimeManager_status, "f")).forEach(key => {
        const item = __classPrivateFieldGet(this, _TimeManager_status, "f")[key];
        if (item.ids.length) {
            item.executionTime = free * k(count);
            free -= item.executionTime;
            count--;
        }
        else {
            item.executionTime = 0;
        }
    });
};
