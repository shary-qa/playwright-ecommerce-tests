import { Page, Locator, expect } from '@playwright/test';
import { PASSWORD } from '../test-data/users';

/** Login screen. Page objects keep selectors in one place, so a UI change is fixed once. */
export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(private page: Page) {
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.error = page.getByTestId('error');
  }

  async open() {
    await this.page.goto('/');
  }

  async login(user: string, password = PASSWORD) {
    await this.username.fill(user);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectError(text: string) {
    await expect(this.error).toContainText(text);
  }
}
