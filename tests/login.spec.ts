import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../test-data/users';

test.describe('Login', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.open();
  });

  test('standard user can log in and sees the product list', async ({ page }) => {
    await login.login(USERS.standard);
    await new InventoryPage(page).expectLoaded();
  });

  test('locked-out user gets a clear error and stays on login', async ({ page }) => {
    await login.login(USERS.lockedOut);
    await login.expectError('Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('wrong password is rejected', async () => {
    await login.login(USERS.standard, 'wrong_password');
    await login.expectError('Username and password do not match');
  });

  test('empty username shows "Username is required"', async () => {
    await login.loginButton.click();
    await login.expectError('Username is required');
  });

  test('empty password shows "Password is required"', async () => {
    await login.username.fill(USERS.standard);
    await login.loginButton.click();
    await login.expectError('Password is required');
  });

  test('inventory page cannot be opened without logging in', async ({ page }) => {
    await page.goto('/inventory.html');
    await login.expectError("You can only access '/inventory.html' when you are logged in.");
  });

  test('user can log out and the back button does not reopen the shop', async ({ page }) => {
    await login.login(USERS.standard);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(login.loginButton).toBeVisible();
    await page.goBack();
    await expect(page).not.toHaveURL(/inventory/);
  });
});
