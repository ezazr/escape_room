import { test, expect } from '@playwright/test';

const PATH = '/escape';

test('runs three generators and saves each output', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByTestId('escape-root')).toBeVisible();

  // 1) Format stage
  await page.getByRole('button', { name: 'Format code correctly' }).click(); // disambiguated
  await page.getByTestId('run-format').click();
  await expect(page.getByTestId('output')).toContainText('function add(a, b)');

  await page.getByTestId('save').click();
  await expect(page.getByTestId('status')).toHaveText(/Saved/i);

  // 2) Numbers stage
  await page.getByRole('button', { name: 'Generate numbers 0…1000' }).click(); // disambiguated
  await page.getByTestId('run-numbers').click();
  await expect(page.getByTestId('output')).toContainText('0,1,2,3');

  await page.getByTestId('save').click();
  await expect(page.getByTestId('status')).toHaveText(/Saved/i);

  // 3) Port CSV → JSON stage
  await page.getByRole('button', { name: 'Port data: CSV → JSON' }).click(); // disambiguated
  await page.getByTestId('run-port').click();
  await expect(page.getByTestId('output')).toContainText('"name": "Ada"');

  await page.getByTestId('save').click();
  await expect(page.getByTestId('status')).toHaveText(/Saved/i);

  // instrumentation check
  // instrumentation check (use full URL to avoid any baseURL/context issues)
const resp = await page.request.get('http://localhost:3000/api/metrics');
expect(resp.ok()).toBeTruthy();
expect((resp.headers()['content-type'] || '')).toContain('application/json');
const metrics = await resp.json();
expect(metrics.saveCount).toBeGreaterThanOrEqual(3);

});

test('debug stage shows output when clicking room image', async ({ page }) => {
  await page.goto(PATH);

  // pick the stage by its button (not the heading)
  await page.getByRole('button', { name: 'Click the correct debug hotspot' }).click();

  const room = page.getByRole('button', { name: 'Escape room image' });
  await room.click({ position: { x: 10, y: 10 } }); // wrong spot
  await expect(page.getByTestId('output')).toContainText('Wrong area');
});
