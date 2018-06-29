import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const testPath = '__tests__/__fixtures__/';

test('genDiff_json', () => {
  const expected = fs.readFileSync(path.join(testPath, '/expected')).toString();
  expect(genDiff(path.join(testPath, '/before.json'), path.join(testPath, '/after.json'))).toBe(expected);
});

test('genDiff_yml', () => {
  const expected = fs.readFileSync(path.join(testPath, '/expected')).toString();
  expect(genDiff(path.join(testPath, '/before.yml'), path.join(testPath, '/after.yml'))).toBe(expected);
});

test('genDiff_ini', () => {
  const expected = fs.readFileSync(path.join(testPath, '/expected')).toString();
  expect(genDiff(path.join(testPath, '/before.ini'), path.join(testPath, '/after.ini'))).toBe(expected);
});

test('genDiff_ast', () => {
  const expected2 = fs.readFileSync(path.join(testPath, '/expected2')).toString();
  expect(genDiff(path.join(testPath, '/before2.json'), path.join(testPath, '/after2.json'))).toBe(expected2);
});
