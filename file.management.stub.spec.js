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

  it("createFileSafe should create a file named test1 when test already exists", () => {
    /* arrange */
    const writeStub = sinon.stub(fs, "writeFileSync");
    const readStub = sinon.stub(fs, "readdirSync");
    const fileManagement = proxyquire("./file.management", { fs });

    // When these args are passed in the stub throws an exception
    writeStub.withArgs("./data/test.txt").throws(new Error());

    // In any other case it returns undefined
    writeStub.returns(undefined);
    readStub.returns(["test.txt"]);
  });
});
