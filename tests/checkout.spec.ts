import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CUSTOMER } from '../test-data/users';

test.describe('Checkout', () => {
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.standard);
    const inventory = new InventoryPage(page);
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.addToCart('Sauce Labs Bolt T-Shirt');
    await inventory.openCart();
    await new CartPage(page).checkout();
    checkout = new CheckoutPage(page);
  });

  test('happy path: buyer completes an order', async ({ page }) => {
    await checkout.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.finishButton.click();
    await checkout.expectComplete();
    await expect(page.getByTestId('shopping-cart-badge')).toBeHidden(); // cart is emptied
  });

  test('order total = item prices + tax (the maths is checked, not just shown)', async () => {
    await checkout.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    const prices = (await checkout.itemPrices.allTextContents()).map(CheckoutPage.money);
    const itemSum = prices.reduce((a, b) => a + b, 0);
    const subtotal = CheckoutPage.money(await checkout.subtotal.textContent());
    const tax = CheckoutPage.money(await checkout.tax.textContent());
    const total = CheckoutPage.money(await checkout.total.textContent());

    expect(subtotal).toBeCloseTo(itemSum, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  // Data-driven: one test per missing field
  const missing = [
    { field: 'first name', data: ['', CUSTOMER.lastName, CUSTOMER.postalCode], error: 'First Name is required' },
    { field: 'last name', data: [CUSTOMER.firstName, '', CUSTOMER.postalCode], error: 'Last Name is required' },
    { field: 'postal code', data: [CUSTOMER.firstName, CUSTOMER.lastName, ''], error: 'Postal Code is required' },
  ];
  for (const m of missing) {
    test(`cannot continue without ${m.field}`, async () => {
      await checkout.fillInfo(m.data[0], m.data[1], m.data[2]);
      await expect(checkout.error).toContainText(m.error);
    });
  }
});
