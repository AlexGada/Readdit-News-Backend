const { formatTime } = require("../db/utils/data-manipulation");

describe("formatTime", () => {
  it("should return an object when passed an array", () => {
    const input = [];
    const actual = formatTime([]);
    expect(actual).toEqual({});
  });
  it("should return an object with the time format converted to be js readable", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389,
      },
    ];
    const expected = { created_at: 1471522072389000 };
    const actual = formatTime(input, "created_at");
    expect(actual).toEqual(expected);
  });
});
