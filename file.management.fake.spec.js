const { expect } = require("chai");
const sinon = require("sinon");
const fs = require("fs");
const proxyquire = require("proxyquire");

describe("File Management Fake", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should create a new file", () => {
    /* arrange */
    // fakes can only take functions as args
    const writeFake = sinon.fake(fs.writeFileSync);

    // Unlike spies and mocks, fakes dont auto replace functions
    // replace must be called after creating the fake, but before calling proxyquire
    sinon.replace(fs, "writeFileSync", writeFake);

    const fileManagement = proxyquire("./file.management", { fs });

    fileManagement.createFile("test.txt");

    /* assert */
    expect(writeFake.calledWith("./data/test.txt")).to.be.true;
  });

  // example of fake throwing errors
  it("should throw an exception when file already exists", () => {
    /* arrange */
    const writeFake = sinon.fake.throws(new Error());
    sinon.replace(fs, "writeFileSync", writeFake);

    const fileManagement = proxyquire("./file.management", { fs });

    /* assert */
    expect(() => {
      fileManagement.createFile("test.txt");
    }).to.throw();
  });

  it("getAllFiles should return a list of files", () => {
    const readFake = sinon.fake.yields(null, ["test.txt"]);
    sinon.replace(fs, "readdir", readFake);
    const fileManagement = proxyquire("./file.management", { fs });

    fileManagement.getAllFiles((err, data) => {
      // eql is not equal to equal
      expect(data).to.eql(["test.txt"]);
    });
  });
});
