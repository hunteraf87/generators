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
var _TimeManager_instances, _a, _TimeManager_status, _TimeManager_executionTime, _TimeManager_emptyStatus, _TimeManager_updateExecutionTime;
Object.defineProperty(exports, "__esModule", { value: true });
class TimeManager {
    constructor() {
        _TimeManager_instances.add(this);
        _TimeManager_status.set(this, void 0);
        _TimeManager_executionTime.set(this, 100);
        __classPrivateFieldSet(this, _TimeManager_status, __classPrivateFieldGet(TimeManager, _a, "m", _TimeManager_emptyStatus).call(TimeManager), "f");
    }
    addTask(ident, type) {
        __classPrivateFieldGet(this, _TimeManager_status, "f")[type].ids.push(ident);
        __classPrivateFieldGet(this, _TimeManager_instances, "m", _TimeManager_updateExecutionTime).call(this);
    }
    removeTask(ident) {
        for (let { ids } of Object.values(__classPrivateFieldGet(this, _TimeManager_status, "f"))) {
            ids = ids.filter(el => el !== ident);
        }
        __classPrivateFieldGet(this, _TimeManager_instances, "m", _TimeManager_updateExecutionTime).call(this);
    }
    getTime() {
        return __classPrivateFieldGet(this, _TimeManager_status, "f");
    }
}
exports.default = TimeManager;
_a = TimeManager, _TimeManager_status = new WeakMap(), _TimeManager_executionTime = new WeakMap(), _TimeManager_instances = new WeakSet(), _TimeManager_emptyStatus = function _TimeManager_emptyStatus() {
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
    __classPrivateFieldGet(this, _TimeManager_status, "f")['critical'].executionTime = __classPrivateFieldGet(this, _TimeManager_status, "f")['critical'].ids.length ? __classPrivateFieldGet(this, _TimeManager_executionTime, "f") * 0.5 : 0;
    __classPrivateFieldGet(this, _TimeManager_status, "f")['high'].executionTime = __classPrivateFieldGet(this, _TimeManager_status, "f")['high'].ids.length ? __classPrivateFieldGet(this, _TimeManager_executionTime, "f") * 0.3 : 0;
    __classPrivateFieldGet(this, _TimeManager_status, "f")['low'].executionTime = __classPrivateFieldGet(this, _TimeManager_status, "f")['low'].ids.length ? __classPrivateFieldGet(this, _TimeManager_executionTime, "f") * 0.2 : 0;
};
