const {
  formatTime,
  formatData,
  createRefObject,
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
describe("createRefObject", () => {
  it("returns an object", () => {
    expect(createRefObject([])).toEqual({});
  });
  it("takes a single element array, returns reference object of key-value pair", () => {
    const input = [
      {
        article_id: 34,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const expected = { "Living in the shadow of a great man": 34 };
    expect(createRefObject(input, "title", "article_id")).toEqual(expected);
  });
  it("takes a multiple element array and returns a reference object with multiple key value pairs", () => {
    const input = [
      {
        article_id: 12,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        article_id: 13,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
      {
        article_id: 14,
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171,
      },
    ];
    const expected = {
      "Eight pug gifs that remind me of mitch": 12,
      "Student SUES Mitch!": 13,
      "UNCOVERED: catspiracy to bring down democracy": 14,
    };

    expect(createRefObject(input, "title", "article_id")).toEqual(expected);
  });
  it("the original input is not mutated", () => {
    const input = [
      {
        article_id: 13,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ];
    createRefObject(input, "title", "article_id"),
      expect(input).toEqual([
        {
          article_id: 13,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body:
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: 1163852514171,
        },
      ]);
  });
});
describe("Reformat Data", () => {
  it("returns an array when passed an array", () => {
    expect(formatData([])).toEqual([]);
  });
  it("changes keys of one array element", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const refObj = { "They're not exactly dogs, are they?": 22 };
    expect(
      formatData(
        input,
        "created_by",
        "author",
        "belongs_to",
        "article_id",
        refObj
      )
    ).toEqual([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 22,
        author: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ]);
  });
  it("changes keys of multiple array elements", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
      {
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        belongs_to: "UNCOVERED: catspiracy to bring down democracy",
        created_by: "icellusedkars",
        votes: 16,
        created_at: 1101386163389,
      },
      {
        body: "This is a bad article name",
        belongs_to: "A day in the life",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389,
      },
    ];
    const refObj = {
      "Living in the shadow of a great man": 22,
      "UNCOVERED: catspiracy to bring down democracy": 23,
      "A day in the life": 24,
    };
    expect(
      formatData(
        input,
        "created_by",
        "author",
        "belongs_to",
        "article_id",
        refObj
      )
    ).toEqual([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 22,
        author: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
      {
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        article_id: 23,
        author: "icellusedkars",
        votes: 16,
        created_at: 1101386163389,
      },
      {
        body: "This is a bad article name",
        article_id: 24,
        author: "butter_bridge",
        votes: 1,
        created_at: 1038314163389,
      },
    ]);
  });
  it("doesn't mutate the original input", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const refObj = { "They're not exactly dogs, are they?": 22 };
    formatData(
      input,
      "created_by",
      "author",
      "belongs_to",
      "article_id",
      refObj
    );
    expect(input).toEqual([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ]);
  });
});
