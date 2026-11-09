import assert from 'node:assert/strict';
import test from 'node:test';
import { splitLinkedText } from './linked-text.ts';

test('keeps trailing sentence punctuation visible outside the link', () => {
  for (const punctuation of ['.', ',!?', ':;', ').']) {
    const parts = splitLinkedText(`Confira https://www.ameliasaude.com.br/rede-credenciada${punctuation}`);
    assert.equal(parts[1].href, 'https://www.ameliasaude.com.br/rede-credenciada');
    assert.equal(parts[2].text, punctuation);
  }
});

test('preserves legitimate paths, queries, fragments, balanced parentheses and multiple links', () => {
  const first = 'https://www.ameliasaude.com.br/a.b/teste(1)?tipo=pme&pagina=2#rede';
  const second = 'https://www.ameliasaude.com.br/';
  const parts = splitLinkedText(`Veja ${first} e ${second}.`);
  assert.deepEqual(parts.filter(part => part.href).map(part => part.href), [first, second]);
  assert.equal(parts.at(-1).text, '.');
  assert.deepEqual(splitLinkedText('Sem links'), [{ text: 'Sem links' }]);
});
