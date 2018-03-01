import * as assert from 'assert';
import { convertToHttpsSchema } from '../git';

suite('git module Tests', () => {
  test('convertToHttpsSchema', () => {
    assert.equal(
      convertToHttpsSchema('git@github.com:hotchemi/vscode-find-pr.git'),
      'https://github.com/hotchemi/vscode-find-pr',
    );

    assert.equal(
      convertToHttpsSchema('prefixgit@'),
      'prefixgit@',
    );

    assert.equal(
      convertToHttpsSchema('.gitsuffix'),
      '.gitsuffix',
    );

    assert.equal(
      convertToHttpsSchema('github.com:'),
      'github.com/',
    );
  });
});
