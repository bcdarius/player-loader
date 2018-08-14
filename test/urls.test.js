import QUnit from 'qunit';
import urls from '../src/urls';

QUnit.module('urls');

QUnit.test('getParamString', function(assert) {
  assert.strictEqual(
    urls.getParamString({}, 'x'),
    undefined,
    'an undefined value is undefined'
  );

  assert.strictEqual(
    urls.getParamString({x: 1}, 'x'),
    '1',
    'a number is converted to a string'
  );

  assert.strictEqual(
    urls.getParamString({x: 'foo'}, 'x'),
    'foo',
    'a string remains a string'
  );

  assert.strictEqual(
    urls.getParamString({x: '  foo \t'}, 'x'),
    'foo',
    'strings are trimmed'
  );

  assert.strictEqual(
    urls.getParamString({x: {}}, 'x'),
    '[object Object]',
    'a non-string is cast to a string for params that cannot have JSON'
  );

  assert.strictEqual(
    urls.getParamString({catalogSearch: [{x: 1}]}, 'catalogSearch'),
    '[{"x":1}]',
    'a non-string is JSON-encoded for valid parameters'
  );

  // Circular references will throw.
  const circ = {};

  circ.circ = circ;

  assert.strictEqual(
    urls.getParamString({catalogSearch: circ}, 'catalogSearch'),
    undefined,
    'a non-string is undefined if it could be JSON, but cannot be serialized'
  );
});

QUnit.test('getUrlEncodedParam', function(assert) {
  assert.strictEqual(
    urls.getUrlEncodedParam({}, 'x'),
    undefined,
    'an undefined value is undefined'
  );

  assert.strictEqual(
    urls.getUrlEncodedParam({x: 1}, 'x'),
    '1',
    'a number is converted to a string'
  );

  assert.strictEqual(
    urls.getUrlEncodedParam({x: '?'}, 'x'),
    '%3F',
    'a string remains a string and is URL encoded'
  );

  assert.strictEqual(
    urls.getUrlEncodedParam({x: '  ? \t'}, 'x'),
    '%3F',
    'strings are trimmed'
  );

  assert.strictEqual(
    urls.getUrlEncodedParam({x: {}}, 'x'),
    '%5Bobject%20Object%5D',
    'a non-string is cast to a string for params that cannot have JSON'
  );

  assert.strictEqual(
    urls.getUrlEncodedParam({catalogSearch: [{x: 1}]}, 'catalogSearch'),
    '%5B%7B%22x%22%3A1%7D%5D',
    'a non-string is JSON-encoded for valid parameters'
  );

  // Circular references will throw.
  const circ = {};

  circ.circ = circ;

  assert.strictEqual(
    urls.getUrlEncodedParam({catalogSearch: circ}, 'catalogSearch'),
    undefined,
    'a non-string is undefined if it could be JSON, but cannot be serialized'
  );
});

QUnit.test('getUrl for in-page embed', function(assert) {
  const url = urls.getUrl({
    accountId: '1',
    playerId: '2',
    embedId: '3'
  });

  assert.strictEqual(url, 'https://players.brightcove.net/1/2_3/index.min.js', 'the URL is correct');
});

QUnit.test('getUrl for iframe embed', function(assert) {
  const url = urls.getUrl({
    accountId: '1',
    playerId: '2',
    embedId: '3',
    embedType: 'iframe'
  });

  assert.strictEqual(url, 'https://players.brightcove.net/1/2_3/index.html', 'the URL is correct');
});

QUnit.test('getUrl for iframe embed supports playlistId, playlistVideoId, and videoId as query parameters', function(assert) {
  const url = urls.getUrl({
    accountId: '1',
    playerId: '2',
    embedId: '3',
    embedType: 'iframe',
    playlistId: 'a',
    playlistVideoId: 'b',
    videoId: 'c'
  });

  assert.strictEqual(url, 'https://players.brightcove.net/1/2_3/index.html?playlistId=a&playlistVideoId=b&videoId=c', 'the URL is correct');
});

QUnit.test('getUrl for in-page embed DOES NOT support playlistId, playlistVideoId, and videoId as query parameters', function(assert) {
  const url = urls.getUrl({
    accountId: '1',
    playerId: '2',
    embedId: '3',
    playlistId: 'a',
    playlistVideoId: 'b',
    videoId: 'c'
  });

  assert.strictEqual(url, 'https://players.brightcove.net/1/2_3/index.min.js', 'the URL is correct');
});

QUnit.test('getUrl encodes all possible URL components', function(assert) {
  const url = urls.getUrl({
    accountId: ';',
    playerId: ',',
    embedId: '/',
    embedType: 'iframe',
    playlistId: '?',
    playlistVideoId: ':',
    videoId: '@'
  });

  assert.strictEqual(url, 'https://players.brightcove.net/%3B/%2C_%2F/index.html?playlistId=%3F&playlistVideoId=%3A&videoId=%40', 'the URL is correct');
});