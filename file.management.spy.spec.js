const { expect } = require("chai");
const sinon = require("sinon");
const fs = require("fs");
const proxyquire = require("proxyquire");
const fileManagement = require("./file.management");

// Spy example
// Component to test
describe("File Management", () => {
  afterEach(() => {
    sinon.restore();  // restores all spies
  });

  // functionality to test
  describe("When writing a new file", () => {
    // test case
    it("should call writeFileSync", () => {
      /* arrange */
      const writeSpy = sinon.spy(fs, "writeFileSync");
      const writeArgs = ""; // a txt file is created empty by default if no args are passed
      // use proxyquire to provide spies if they cannot be injected manually
      const fileManagement = proxyquire("./file.management", { fs });
      /* act */
      fileManagement.createFile("test.txt");

      /* assert */
      expect(writeSpy.calledWith("./data/test.txt", writeArgs)).to.be.true;
      // not necessary anymore, because of sinon.restore called before each test
      // writeSpy.restore();  // manually restoring the spy before next test
    });

    it("should not create a new file if no file name is specified", () => {
      /* arrange */
      const writeSpy = sinon.spy(fs, "writeFileSync");
      const writeArgs = ""; // a txt file is created empty by default if no args are passed
      // use proxyquire to provide spies if they cannot be injected manually
      const fileManagement = proxyquire("./file.management", { fs });
      /* act */
      try {
        fileManagement.createFile();
      } catch (error) {}
      /* assert */
      expect(writeSpy.notCalled).to.be.true;
    });

    // Would ensure that only this test is run
    // it.only("should call writeFileSync - injected", () => {
    // skip forces the test case to be skipped and reported as pending
    it.skip("should call writeFileSync - injected", () => {
      /* arrange */
      const writeSpy = sinon.spy(fs, "writeFileSync");
      const writeArgs = "";

      /* act */
      fileManagement.createFileInjected("test.txt", fs);

      /* assert */
      expect(writeSpy.calledWith("./data/test.txt", writeArgs)).to.be.true; // this test passes because its using the spied fs function
    });
  });
});
