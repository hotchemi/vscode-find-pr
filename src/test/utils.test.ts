import * as assert from 'assert';
import { githubUrl, md5 } from '../utils';

suite('utils module tests', () => {
  test('md5', () => {
    assert.equal(md5(undefined), undefined);
    assert.equal(md5('test'), '098f6bcd4621d373cade4e832627b4f6');
  });

  test('githubUrl', () => {
    assert.equal(githubUrl('url', undefined, 'hash', 'md5Hash', true), 'url/commit/hash#diff-md5Hash');
    assert.equal(githubUrl('url', '1', 'hash', 'md5Hash', true), 'url/pull/1');
    assert.equal(githubUrl('url', '1', 'hash', 'md5Hash', false), 'url/pull/1/files#diff-md5Hash');
  });
});
