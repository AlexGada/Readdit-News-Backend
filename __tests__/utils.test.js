const { formatTime } = require("../db/utils");

describe("formatTime", () => {
  it("should return an object when passed an array", () => {
    const input = [];
    const actual = formatTime([]);
    expect(actual).toEqual({});
  });
});
