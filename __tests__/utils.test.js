const {
  formatTime,
  formatItems,
  createRefObj,
} = require("../db/utils/data-manipulation");

describe("formatTime", () => {
  it("should return an array when passed an array", () => {
    const input = [];
    const actual = formatTime([]);
    expect(actual).toEqual([]);
  });
  it("should return an object with the time format converted to be js readable", () => {
    const input = [{ created_at: 1289996514171 }];
    const formattedArticles = formatTime(input);
    expect(formattedArticles[0].created_at).toBeInstanceOf(Date);
  });
  it("should return multiple objects with the correct time format", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171,
      },
    ];
    const expected = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: expect.any(Date),
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: expect.any(Date),
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: expect.any(Date),
      },
    ];
    const actual = formatTime(input);
    expect(actual).toEqual(expected);
  });
  it("should not mutate the original array", () => {
    const input = [
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171000,
      },
    ];

    formatTime(input);
    expect(input).toEqual([
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171000,
      },
    ]);
  });
  it("should have a different reference in memory to original array", () => {
    const input = [
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171000,
      },
    ];

    const expected = formatTime(input);

    expect(expected).not.toBe(input);
  });
});
describe("Format Items", () => {
  it("returns an empty array, when passed an empty array", () => {
    const input = [];
    const actual = formatItems(input);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("change one key value pair when passed one item", () => {
    const refObj = { "firstname-b": 1 };
    const input = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
      },
    ];
    const actual = formatItems(input, refObj, "owner", "owner_id");
    const expected = [{ shop_name: "shop-b", slogan: "slogan-b", owner_id: 1 }];
    expect(actual).toEqual(expected);
  });
  it("change multiple key value pair when passed multiple item", () => {
    const refObj = { "firstname-b": 1, "firstname-c": 2, "firstname-d": 3 };
    const input = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
      },
      { shop_name: "shop-d", owner: "firstname-c", slogan: "slogan-d" },
      { shop_name: "shop-e", owner: "firstname-d", slogan: "slogan-e" },
    ];
    const actual = formatItems(input, refObj, "owner", "owner_id");
    const expected = [
      { shop_name: "shop-b", slogan: "slogan-b", owner_id: 1 },
      { shop_name: "shop-d", slogan: "slogan-d", owner_id: 2 },
      { shop_name: "shop-e", slogan: "slogan-e", owner_id: 3 },
    ];
    expect(actual).toEqual(expected);
  });
  it("should not mutate original data", () => {
    const refObj = { "firstname-b": 1 };
    const input = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
      },
    ];
    formatItems(input, refObj, "owner", "owner_id");
    expect(input).toEqual([
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
      },
    ]);
    expect(refObj).toEqual({ "firstname-b": 1 });
    const refObj1 = { "firstname-b": 1 };
    const input1 = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
      },
    ];
    const actual = formatItems(input1, refObj1, "owner", "owner_id");
    expect(actual).not.toBe(input1);
    expect(actual[0]).not.toBe(input1[0]);
  });
});
describe("createRef", () => {
  it("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = createRefObj(input);
    const expected = {};
    expect(actual).toEqual(expected);
  });
  it("returns a ref object with a single key value pair when passed a single element array", () => {
    const input = [
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389,
      },
    ];
    const actual = createRefObj(input, "created_by", "author");
    const expected = { "firstname-b": 1 };
    expect(actual).toEqual(expected);
  });
  it("returns a ref object with multiple key value pairs", () => {
    const input = [
      {
        owner_id: 2,
        forename: "firstname-c",
        surname: "lastname-c",
        age: 21,
      },
      {
        owner_id: 3,
        forename: "firstname-d",
        surname: "lastname-d",
        age: 17,
      },
    ];
    const actual = createRefObj(input, "forename", "owner_id");
    const expected = {
      "firstname-c": 2,
      "firstname-d": 3,
    };
    expect(actual).toEqual(expected);
  });
  it("does not mutate the original data", () => {
    const input = [
      {
        owner_id: 2,
        forename: "firstname-c",
        surname: "lastname-c",
        age: 21,
      },
    ];
    createRefObj(input);
    expect(input).toEqual([
      {
        owner_id: 2,
        forename: "firstname-c",
        surname: "lastname-c",
        age: 21,
      },
    ]);
  });
});
