const { expect } = require("chai");
const sinon = require("sinon");
const fs = require("fs");
const proxyquire = require("proxyquire");

describe("file management", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should write a new file", () => {
    /* arrange */
    const writeStub = sinon.stub(fs, "writeFileSync");
    const writeArgs = ""; // a txt file is created empty by default if no args are passed
    // use proxyquire to provide spies if they cannot be injected manually
    const fileManagement = proxyquire("./file.management", { fs });
    /* act */
    fileManagement.createFile("test.txt");

    /* assert */
    expect(writeStub.callCount).to.equal(1);
  });
});
