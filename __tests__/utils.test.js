const {
  dateFormatter,
  createArticlesRef,
  commentFormatter,
} = require('../db/utils/data-manipulation');

describe('dateFormatter', () => {
  it('should take an empty array and return an empty array', () => {
    const input = [];
    const actualOutput = dateFormatter(input);
    const expectedOutput = [];
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('should return array of singular object with created_at formatted correctly', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const actualOutput = dateFormatter(input);
    const expectedOutput = {
      created_at: expect.any(Date),
    };
    expect(actualOutput[0]).toMatchObject(expectedOutput);
  });
  it('should return array of objects with created_at formatted correctly', () => {
    const input = [
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171,
      },
      {
        title: 'A',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Delicious tin of cat food',
        created_at: 911564514171,
      },
      {
        title: 'Z',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'I was hungry.',
        created_at: 785420514171,
      },
    ];
    const actualOutput = dateFormatter(input);
    const expectedOutput = {
      created_at: expect.any(Date),
    };
    expect(actualOutput[0]).toMatchObject(expectedOutput);
    expect(actualOutput[1]).toMatchObject(expectedOutput);
    expect(actualOutput[2]).toMatchObject(expectedOutput);
  });
  it('Original input array is NOT mutated', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const inputClone = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    dateFormatter(input);

    expect(input).toEqual(inputClone);
  });
});
describe('createArticlesRef', () => {
  it('should return an empty object when passed an empty array', () => {
    const input = [];
    const actualOutput = createArticlesRef(input);
    const expectedOutput = {};
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('should return a reference object with one key pair  - keys being article title and value being article_id ', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        body: 'I find this existence challenging',
        votes: 100,
        topic: 'mitch',
        author: 'butter_bridge',
        created_at: Date.now(),
      },
    ];
    const actualOutput = createArticlesRef(input);
    const expectedOutput = { 'Living in the shadow of a great man': 1 };
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('should return a reference object with multiple key pairs  - keys being article title and value being article_id ', () => {
    const input = [
      {
        article_id: 5,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        votes: 0,
        topic: 'cats',
        author: 'rogersop',
        created_at: Date.now(),
      },
      {
        article_id: 6,
        title: 'A',
        body: 'Delicious tin of cat food',
        votes: 0,
        topic: 'mitch',
        author: 'icellusedkars',
        created_at: Date.now(),
      },
      {
        article_id: 7,
        title: 'Z',
        body: 'I was hungry.',
        votes: 0,
        topic: 'mitch',
        author: 'icellusedkars',
        created_at: Date.now(),
      },
    ];
    const actualOutput = createArticlesRef(input);
    const expectedOutput = {
      'UNCOVERED: catspiracy to bring down democracy': 5,
      A: 6,
      Z: 7,
    };
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('input array should not be mutated', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        body: 'I find this existence challenging',
        votes: 100,
        topic: 'mitch',
        author: 'butter_bridge',
        created_at: Date.now(),
      },
    ];
    const inputClone = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        body: 'I find this existence challenging',
        votes: 100,
        topic: 'mitch',
        author: 'butter_bridge',
        created_at: Date.now(),
      },
    ];
    createArticlesRef(input);
    expect(input).toEqual(inputClone);
  });
});
describe('commentFormatter', () => {
  it('should return an empty array when passed an empty array', () => {
    const input = [];
    const actualOutput = commentFormatter(input);
    const expectedOutput = [];
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('should return a single comment formatted correctly', () => {
    const inputArr = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 16,
        created_at: Date.now(),
      },
    ];
    const inputRefObj = { 'Living in the shadow of a great man': 1 };
    const actualOutput = commentFormatter(inputArr, inputRefObj);
    const expectedOutput = [
      {
        author: 'butter_bridge',
        article_id: 1,
        votes: 16,
        created_at: Date.now(),
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      },
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('should return multiple comments formatted correctly', () => {
    const inputArr = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 16,
        created_at: Date.now(),
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Article name 12',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: Date.now(),
      },
    ];
    const inputRefObj = {
      'Living in the shadow of a great man': 1,
      'Article name 12': 24,
    };
    const actualOutput = commentFormatter(inputArr, inputRefObj);
    const expectedOutput = [
      {
        author: 'butter_bridge',
        article_id: 1,
        votes: 16,
        created_at: Date.now(),
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      },
      {
        author: 'icellusedkars',
        article_id: 24,
        votes: 100,
        created_at: Date.now(),
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
      },
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('input array should not be mutated', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 16,
        created_at: Date.now(),
      },
    ];
    const inputRefObj = {
      'Living in the shadow of a great man': 1,
    };
    const inputClone = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 16,
        created_at: Date.now(),
      },
    ];
    const inputRefObjClone = {
      'Living in the shadow of a great man': 1,
    };
    commentFormatter(input, inputRefObj);
    expect(input).toEqual(inputClone);
    expect(inputRefObj).toEqual(inputRefObjClone);
  });
});
