"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ThreadsManager_instances, _ThreadsManager_threads, _ThreadsManager_currentIdent, _ThreadsManager_timeManager, _ThreadsManager_executor, _ThreadsManager_initGenerator;
Object.defineProperty(exports, "__esModule", { value: true });
const time_manager_1 = __importDefault(require("./time-manager"));
class ThreadsManager {
    constructor() {
        _ThreadsManager_instances.add(this);
        _ThreadsManager_threads.set(this, new Map());
        _ThreadsManager_currentIdent.set(this, 0);
        _ThreadsManager_timeManager.set(this, void 0);
        __classPrivateFieldSet(this, _ThreadsManager_timeManager, new time_manager_1.default(), "f");
    }
    forEach(iterable, callback, options = {}) {
        var _a, _b;
        const priority = options.priority ?? "low";
        const ident = options.id === undefined ? (__classPrivateFieldSet(this, _ThreadsManager_currentIdent, (_b = __classPrivateFieldGet(this, _ThreadsManager_currentIdent, "f"), _a = _b++, _b), "f"), _a) : options.id;
        if (__classPrivateFieldGet(this, _ThreadsManager_threads, "f").has(ident)) {
            throw new Error('Invalid thread id');
        }
        const gen = __classPrivateFieldGet(this, _ThreadsManager_instances, "m", _ThreadsManager_initGenerator).call(this, iterable, callback, priority);
        __classPrivateFieldGet(this, _ThreadsManager_threads, "f").set(ident, gen);
        __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").addTask(ident, priority);
        return new Promise((resolve => __classPrivateFieldGet(this, _ThreadsManager_instances, "m", _ThreadsManager_executor).call(this, gen, resolve, ident)));
    }
    get count() {
        return __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").countThreads;
    }
    get executionTime() {
        return __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").executionTime;
    }
    get waitingTime() {
        return __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").waitingTime;
    }
    stop(threadIdent) {
        if (__classPrivateFieldGet(this, _ThreadsManager_threads, "f").has(threadIdent)) {
            const thread = __classPrivateFieldGet(this, _ThreadsManager_threads, "f").get(threadIdent);
            if (thread !== undefined) {
                thread.return(null);
            }
        }
    }
    break() {
        for (let thread of __classPrivateFieldGet(this, _ThreadsManager_threads, "f").values()) {
            thread.return(null);
        }
    }
    setExecutionTime(time) {
        __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").setExecutionTime(time);
    }
    setWaitingTime(time) {
        __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").setWaitingTime(time);
    }
}
exports.default = ThreadsManager;
_ThreadsManager_threads = new WeakMap(), _ThreadsManager_currentIdent = new WeakMap(), _ThreadsManager_timeManager = new WeakMap(), _ThreadsManager_instances = new WeakSet(), _ThreadsManager_executor = function _ThreadsManager_executor(generator, resolve, ident) {
    let next = generator.next();
    if (!next.done) {
        setTimeout(() => __classPrivateFieldGet(this, _ThreadsManager_instances, "m", _ThreadsManager_executor).call(this, generator, resolve, ident), __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").waitingTime);
    }
    else {
        __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").removeTask(ident);
        resolve();
    }
}, _ThreadsManager_initGenerator = function* _ThreadsManager_initGenerator(iterable, callback, priority) {
    const iter = iterable[Symbol.iterator]();
    let next = iter.next();
    let start = new Date().getTime();
    while (!next.done) {
        callback(next.value);
        let currentTime = new Date().getTime() - start;
        let maxExecutionTime = __classPrivateFieldGet(this, _ThreadsManager_timeManager, "f").getTaskExecutionTime(priority);
        if (currentTime > maxExecutionTime) {
            yield 0;
            start = new Date().getTime();
        }
        next = iter.next();
    }
};
