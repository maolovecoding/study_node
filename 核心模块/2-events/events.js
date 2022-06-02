class EventEmitter {
  constructor() {
    this._events = new Map();
  }
  on(type, callback) {
    if (type !== "newListener") {
      // newListener 可以监控用户是否绑定（订阅）了某个事件
      this.emit("newListener", type);
    }
    if (!this._events.get(type)) this._events.set(type, []);
    this._events.get(type).push(callback);
  }
  once(type, callback) {
    const once = () => {
      callback();
      this.off(type, once);
    };
    // 标识once 用户在外面once以后，可以在未执行之前通过off解绑
    once.once = callback;
    this.on(type, once);
  }
  off(type, callback) {
    this._events.set(
      type,
      this._events
        .get(type)
        ?.filter((cb) => cb !== callback && cb.once !== callback)
    );
  }
  emit(type, ...args) {
    this._events.get(type)?.forEach((cb) => cb(...args));
  }
}
module.exports = EventEmitter;
