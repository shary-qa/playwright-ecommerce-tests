import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../test-data/users';

test.describe('Product list', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard);
    inventory = new InventoryPage(page);
    await inventory.expectLoaded();
  });

  test('shows 6 products, each with a name, price and image', async () => {
    await expect(inventory.items).toHaveCount(6);
    for (const item of await inventory.items.all()) {
      await expect(item.getByTestId('inventory-item-name')).not.toBeEmpty();
      await expect(item.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
      await expect(item.locator('img')).toBeVisible();
    }
  });

  test('sort by price low to high', async () => {
    await inventory.sortBy('lohi');
    const prices = await inventory.priceList();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', async () => {
    await inventory.sortBy('hilo');
    const prices = await inventory.priceList();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sort by name Z to A', async () => {
    await inventory.sortBy('za');
    const names = await inventory.names.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('product detail page matches the list (name and price)', async ({ page }) => {
    const name = await inventory.names.first().textContent();
    const price = await inventory.prices.first().textContent();
    await inventory.names.first().click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(name!);
    await expect(page.getByTestId('inventory-item-price')).toHaveText(price!);
  });
});
