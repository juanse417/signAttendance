var Attendance = artifacts.require("./SignAttendance.sol");
module.exports = function(deployer) {
  deployer.deploy(Attendance);
};
