export default {
  level: 'console', // console, db/ws??
  log: function (msg, someObject) { // TODO array params [someObject,..]
    switch (this.level) {
      case 'console':
      default:
        if (someObject) {
          console.log(msg, someObject);
        } else {
          console.log(msg);
        }
        break;
    }
  }
};
