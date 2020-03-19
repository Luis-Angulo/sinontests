const sinon = require("sinon");
const fs = require("fs");
const proxyquire = require("proxyquire");

// mocks differ from fakes and stubs because they set expectations
// before evaluation
describe("File Management Mocks", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should call writeFileSync when creating a test", () => {
    /* arrange */
    const writeMock = sinon.mock(fs);
    writeMock.expects("writeFileSync").once();

    const fileManagement = proxyquire("./file.management", { fs });

    fileManagement.createFile("test.txt");

    // Checks that the expectation is met at evaluation time
    writeMock.verify();
  });

  it("createFileSafe should create a new file with a number appended", () => {
      /* arrange */
    const writeMock = sinon.mock(fs);

    // set several expectations in a batch
    writeMock
      .expects("writeFileSync")
      .withArgs("./data/test.txt")
      .throws();

    writeMock
      .expects("writeFileSync")
      .withArgs("./data/test1.txt")
      .returns(1);

    writeMock
      .expects("readdirSync")
      .returns(["test.txt"])
      .once();

    const fileManagement = proxyquire("./file.management", { fs });

    fileManagement.createFileSafe("test.txt");

    writeMock.verify();
  });

  it("createFile should never call writeFileSync when the file is empty", () => {
      /* arrange */
    const writeMock = sinon.mock(fs);
    writeMock.expects("writeFileSync").never();

    const fileManagement = proxyquire("./file.management", { fs });

    // we don't need to catch the error because the mock is already
    // checking that the function was not called
    try {
      fileManagement.createFile();
    } catch (err) {}

    writeMock.verify();
  });
});
