const { dateFormatter } = require('../db/utils/data-manipulation');

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
        }
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
        }
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
        expect(dateFormatter(input)).not.toBe(input);
    })
});
