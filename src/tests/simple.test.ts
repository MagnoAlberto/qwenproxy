/*
 * File: simple.test.ts
 * Teste simples para validar que o ambiente de testes funciona.
 * Execute com: npm run test:simple
 */

import { test } from 'node:test';
import assert from 'node:assert';

// ─── Teste 1: Verificação básica de tipos ──────────────────────────────────────

test('tipos básicos do JavaScript funcionam corretamente', () => {
  assert.strictEqual(typeof 'hello', 'string');
  assert.strictEqual(typeof 42, 'number');
  assert.strictEqual(typeof true, 'boolean');
  assert.strictEqual(typeof undefined, 'undefined');
  assert.strictEqual(typeof null, 'object'); // famoso "bug" do JS!
});

// ─── Teste 2: Operações com arrays ─────────────────────────────────────────────

test('operações com arrays', () => {
  const arr = [1, 2, 3, 4, 5];

  assert.strictEqual(arr.length, 5);
  assert.deepStrictEqual(arr.filter(n => n > 3), [4, 5]);
  assert.strictEqual(arr.reduce((a, b) => a + b, 0), 15);
  assert.ok(arr.includes(3), 'Array deveria conter o número 3');
});

// ─── Teste 3: Manipulação de strings ────────────────────────────────────────────

test('manipulação de strings', () => {
  const texto = '  QwenProxy - Parser Test  ';

  assert.strictEqual(texto.trim(), 'QwenProxy - Parser Test');
  assert.ok(texto.includes('QwenProxy'));
  assert.strictEqual(texto.trim().split(' - ').length, 2);
});

// ─── Teste 4: Objetos e desestruturação ─────────────────────────────────────────

test('objetos e desestruturação', () => {
  const config = {
    port: 3000,
    browser: 'chromium',
    features: { streaming: true, tools: true }
  };

  const { port, browser } = config;
  assert.strictEqual(port, 3000);
  assert.strictEqual(browser, 'chromium');
  assert.deepStrictEqual(config.features, { streaming: true, tools: true });
});

// ─── Teste 5: Promises e async ──────────────────────────────────────────────────

test('promises resolvem corretamente', async () => {
  const resultado = await Promise.resolve('sucesso');
  assert.strictEqual(resultado, 'sucesso');

  const valores = await Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ]);
  assert.deepStrictEqual(valores, [1, 2, 3]);
});

// ─── Teste 6: Tratamento de erros ───────────────────────────────────────────────

test('erros são capturados corretamente', () => {
  assert.throws(
    () => { throw new Error('falha proposital'); },
    { message: 'falha proposital' }
  );

  assert.doesNotThrow(() => {
    JSON.parse('{"valid": true}');
  });
});
