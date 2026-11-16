import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CUSTOMER } from '../test-data/users';

/**
 * Bugs found by exploratory testing with the site's special accounts.
 * Full write-ups: BUGS.md
 *
 * Each test checks the CORRECT behaviour and is marked test.fail():
 * - the suite stays green while the bug is still there (expected failure)
 * - the day a bug gets fixed, Playwright reports it ("expected to fail, but passed"),
 *   so the team knows to close the ticket and turn it into a normal test.
 */

const bug = (id: string, title: string) => ({ annotation: { type: 'bug', description: `${id}: ${title}` } });

test.use({ actionTimeout: 5000 });

async function loginAs(page, user: string) {
  const login = new LoginPage(page);
  await login.open();
  await login.login(user);
  return new InventoryPage(page);
}

test.describe('Known bugs: problem_user', () => {
  test('BUG-01 every product should have its own image', bug('BUG-01', 'All products show the same placeholder (404) image'), async ({ page }) => {
    test.fail();
    await loginAs(page, USERS.problem);
    const imgs = page.locator('.inventory_item img');
    await expect(imgs).toHaveCount(6); // wait until the list has rendered, or the check would pass on an empty page
    const images = await imgs.evaluateAll(els => els.map(e => (e as HTMLImageElement).src));
    expect(new Set(images).size).toBe(images.length);
  });

  test('BUG-02 sort by price low to high should sort', bug('BUG-02', 'Sorting does nothing'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.problem);
    await inventory.sortBy('lohi');
    const prices = await inventory.priceList();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('BUG-03 "Add to cart" should work for every product', bug('BUG-03', 'Add to cart does nothing for 3 of 6 products'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.problem);
    for (const name of await inventory.names.allTextContents()) {
      await inventory.addToCart(name);
    }
    await expect(inventory.cartBadge).toHaveText('6', { timeout: 3000 });
  });

  test('BUG-04 "Remove" should take the item out of the cart', bug('BUG-04', 'Remove button does nothing'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.problem);
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.removeFromCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toBeHidden({ timeout: 3000 });
  });

  test('BUG-05 clicking a product should open that same product', bug('BUG-05', 'Product link opens a different product'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.problem);
    await inventory.names.filter({ hasText: 'Sauce Labs Backpack' }).click();
    await expect(page.getByTestId('back-to-products')).toBeVisible(); // wait for the detail page
    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack', { timeout: 3000 });
  });

  test('BUG-06 Last Name field should keep what the buyer types', bug('BUG-06', 'Typing in Last Name overwrites First Name; order cannot be placed'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.problem);
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.openCart();
    await page.getByTestId('checkout').click();
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await expect(page).toHaveURL(/checkout-step-two/, { timeout: 3000 });
  });
});

test.describe('Known bugs: error_user', () => {
  test('BUG-07 sort by price low to high should sort', bug('BUG-07', 'Sorting does nothing'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.error);
    await inventory.sortBy('lohi');
    const prices = await inventory.priceList();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('BUG-08 "Add to cart" should work for every product', bug('BUG-08', 'Add to cart does nothing for 3 of 6 products'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.error);
    for (const name of await inventory.names.allTextContents()) {
      await inventory.addToCart(name);
    }
    await expect(inventory.cartBadge).toHaveText('6', { timeout: 3000 });
  });

  test('BUG-09 checkout should block an empty Last Name', bug('BUG-09', 'Last Name cannot be typed, and checkout continues without it'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.error);
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.openCart();
    await page.getByTestId('checkout').click();
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    // Correct behaviour: either the last name is saved, or the form stops with an error.
    await expect(page).not.toHaveURL(/checkout-step-two/, { timeout: 3000 });
  });

  test('BUG-10 "Finish" should place the order', bug('BUG-10', 'Finish button does nothing; order is never placed'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.error);
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.openCart();
    await page.getByTestId('checkout').click();
    const checkout = new CheckoutPage(page);
    await checkout.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.finishButton.click();
    await expect(page).toHaveURL(/checkout-complete/, { timeout: 3000 });
  });
});

test.describe('Known bugs: visual_user', () => {
  test('BUG-11 product prices should not change between page loads', bug('BUG-11', 'List prices change randomly on every load'), async ({ page }) => {
    test.fail();
    const inventory = await loginAs(page, USERS.visual);
    const first = await inventory.priceList();
    await page.reload();
    const second = await inventory.priceList();
    expect(second).toEqual(first);
  });
});
