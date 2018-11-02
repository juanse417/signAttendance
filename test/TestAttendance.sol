pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Attendance.sol";

contract TestAttendance {
  Attendance attendance = Attendance(DeployedAddresses.Attendance());


  // Testing the SignFunciton() function
function testStudentCanSign() public {
  uint returnedId = attendance.sign(0x01001001,22,'SQmasd',44);

  uint expected = 22;

  Assert.equal(returnedId, expected, "Student 22 should have signed.");
}

}
