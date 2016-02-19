export default {
  level: 'console', // console, db/ws??
  log: function (msg) {
    switch (this.level) {
      case 'console':
      default:
        console.log(msg);
        break;
    }
  }
};
