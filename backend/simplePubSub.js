class SimplePubSub {
  constructor() {
    this.subscriptions = {};
  }

  publish(event, payload) {
    if (!this.subscriptions[event]) return;
    this.subscriptions[event].forEach((callback) => callback(payload));
  }

  subscribe(event, callback) {
    if (!this.subscriptions[event]) {
      this.subscriptions[event] = [];
    }
    this.subscriptions[event].push(callback);

    return () => {
      this.subscriptions[event] = this.subscriptions[event].filter((cb) => cb !== callback);
    };
  }

  asyncIterator(event) {
    const pullQueue = [];
    const pushQueue = [];
    let listening = true;

    const pushValue = (payload) => {
      if (pullQueue.length !== 0) {
        pullQueue.shift()({ value: payload, done: false });
      } else {
        pushQueue.push(payload);
      }
    };

    const pullValue = () =>
      new Promise((resolve) => {
        if (pushQueue.length !== 0) {
          resolve({ value: pushQueue.shift(), done: false });
        } else {
          pullQueue.push(resolve);
        }
      });

    const subscription = this.subscribe(event, pushValue);

    return {
      next() {
        return listening ? pullValue() : this.return();
      },
      return() {
        listening = false;
        subscription();
        return Promise.resolve({ value: undefined, done: true });
      },
      throw(error) {
        listening = false;
        subscription();
        return Promise.reject(error);
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }
}

module.exports = SimplePubSub;
