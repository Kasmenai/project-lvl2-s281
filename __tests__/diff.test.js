import fs from 'fs';
import genDiff from '../src';

test('genDiff_json', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expected').toString();
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(expected);
});

test('genDiff_yml', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expected').toString();
  expect(genDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml')).toBe(expected);
});

test('genDiff_ini', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expected').toString();
  expect(genDiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini')).toBe(expected);
});

test('genDiff_ast', () => {
  const expected2 = fs.readFileSync('__tests__/__fixtures__/expected2').toString();
  expect(genDiff('__tests__/__fixtures__/before2.json', '__tests__/__fixtures__/after2.json')).toBe(expected2);
});
