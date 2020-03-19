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
    // use proxyquire to provide spies if they cannot be injected manually
    const fileManagement = proxyquire("./file.management", { fs });
    /* act */
    fileManagement.createFile("test.txt");

    /* assert */
    expect(writeStub.callCount).to.equal(1);
  });

  it("should throw an exception if the file already exists", () => {
    /* arrange */
    const writeStub = sinon.stub(fs, "writeFileSync");
    // force stub to throw exception on any call
    writeStub.throws(new Error());
    // use proxyquire to provide spies if they cannot be injected manually
    const fileManagement = proxyquire("./file.management", { fs });

    /* assert and act */
    expect(() => fileManagement.createFile("test.txt")).to.throw();
  });

});
