export interface PasswordRule {
  label: string;
  test: (password: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  { label: "At least 8 characters", test: (password) => password.length >= 8 },
  { label: "One uppercase letter", test: (password) => /[A-Z]/.test(password) },
  { label: "One lowercase letter", test: (password) => /[a-z]/.test(password) },
  { label: "One number", test: (password) => /[0-9]/.test(password) },
  { label: "One symbol (#?!@$%^&*-)", test: (password) => /[#?!@$%^&*-]/.test(password) },
];

export const passwordRequirementsMessage =
  "Must be 8+ characters with upper, lower, a number and a symbol (#?!@$%^&*-)";

export function isValidPassword(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password));
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password.length > 0 && password === confirmPassword;
}
