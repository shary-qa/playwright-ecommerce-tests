import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS } from '../test-data/users';

test.describe('Cart', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard);
    inventory = new InventoryPage(page);
  });

  test('cart badge counts items as they are added and removed', async () => {
    await expect(inventory.cartBadge).toBeHidden();
    await inventory.addToCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');
    await inventory.addToCart('Sauce Labs Bike Light');
    await expect(inventory.cartBadge).toHaveText('2');
    await inventory.removeFromCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('cart shows exactly the items that were added', async ({ page }) => {
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.addToCart('Sauce Labs Onesie');
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.names).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Onesie']);
  });

  test('cart is kept after a page reload', async ({ page }) => {
    await inventory.addToCart('Sauce Labs Fleece Jacket');
    await page.reload();
    await expect(inventory.cartBadge).toHaveText('1');
  });
});
