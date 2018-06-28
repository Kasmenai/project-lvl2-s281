import fs from 'fs';
import genDiff from '../src';

const expected = fs.readFileSync('__tests__/__fixtures__/expected').toString();
const expected2 = fs.readFileSync('__tests__/__fixtures__/expected2').toString();
test('genDiff_json', () => {
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(expected);
});

test('genDiff_yml', () => {
  expect(genDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml')).toBe(expected);
});

test('genDiff_ini', () => {
  expect(genDiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini')).toBe(expected);
});

test('genDiff_ast', () => {
  expect(genDiff('__tests__/__fixtures__/before2.json', '__tests__/__fixtures__/after2.json')).toBe(expected2);
});
