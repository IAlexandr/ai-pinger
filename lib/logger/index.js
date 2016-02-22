export default {
  type: 'console', // console, db/ws??
  debugging: false,
  log: function (msg, someObject) { // TODO array params [someObject,..]
    switch (this.type) {
      case 'console':
      default:
        if (someObject) {
          console.log(msg, someObject);
        } else {
          console.log(msg);
        }
        break;
    }
  },
  debug: function (msg, someObject) {
    if (this.debugging) {
      this.log(msg, someObject);
    }
  }
};
