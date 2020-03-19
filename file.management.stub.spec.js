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

    /* assert */
    readStub.returns(["test.txt"]);
  });

  it("getAllFiles should return a list of files", () => {
    /* arrange */
    const readStub = sinon.stub(fs, "readdir");
    const fileManagement = proxyquire("./file.management", { fs });

    // Specifies that readStub should yield the data in these params when used
    // null maps to the error param, the second param is the expected data
    readStub.yields(null, ["test.txt"]);

    fileManagement.getAllFiles((err, data) => {
      expect(data).to.eql(["test.txt"]);
    });
  });

  it("getAllFilesPromise should return a list of files", () => {
    /* arrange */
    const readStub = sinon.stub(fs, "readdir");
    // Wrapper for promises to test promise-based async.
    // Needed because fs requires node util.promisify to return promises
    const util = {
      promisify: sinon.stub().returns(readStub)
    };

    const fileManagement = proxyquire("./file.management", { fs, util });

    // sets readStub to return the arg when promise is resolved
    // check reject for rejecting promises
    readStub.resolves(["test.txt"]);

    /* assert and act */    
    return fileManagement.getAllFilesPromise().then(files => {
      expect(files).to.eql(["test.txt"]);
    });
  });
});
