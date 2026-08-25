import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { htmlToPdf } from '../src/report/pdf.js';

test('Puppeteer renders a valid PDF report', { timeout: 30_000 }, async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'geo-audit-pdf-'));
  const output = path.join(directory, 'smoke.pdf');

  try {
    await htmlToPdf(
      '<!doctype html><html><body><h1>GEO audit smoke test</h1><p>PDF rendering is operational.</p></body></html>',
      output
    );

    const pdf = await readFile(output);
    assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
    assert.ok(pdf.length > 1_000, `expected a non-empty PDF, received ${pdf.length} bytes`);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
