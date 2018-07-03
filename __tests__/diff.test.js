import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const testPath = '__tests__/__fixtures__/';

const exts = ['json', 'yml', 'ini'];
exts.forEach((ext) => {
  const expected = fs.readFileSync(path.join(testPath, '/expected')).toString();
  test(`genDiff_pretty_${ext}`, () => {
    expect(genDiff(path.join(testPath, `/before.${ext}`), path.join(testPath, `/after.${ext}`))).toBe(expected);
  });
});

const formats = ['pretty', 'plain', 'json'];
formats.forEach((format) => {
  const expected = fs.readFileSync(path.join(testPath, `/expected_${format}`)).toString();
  test(`genDiff_${format}`, () => {
    expect(genDiff(path.join(testPath, '/before2.json'), path.join(testPath, '/after2.json'), format)).toBe(expected);
  });
});
