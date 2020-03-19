const { expect } = require("chai");
const { createSandbox, spy } = require("sinon");
const fs = require("fs");
const proxyquire = require("proxyquire");
const fileManagement = require("./file.management");

// Spy example
// Component to test
describe("File Management", () => {
  // functionality to test
  describe("When writing a new file", () => {
    // test case
    it("should call writeFileSync", () => {
      /* arrange */
      const writeSpy = spy(fs, "writeFileSync");
      const writeArgs = "";  // a txt file is created empty by default if no args are passed

      /* act */
      fileManagement.createFile("test.txt");
      
      /* assert */
      expect(writeSpy.calledWith("./data/test.txt", writeArgs))
      .to.be.true;  // should pass, but it doesnt, explained in "using a spy"
    });
    
  });

});
