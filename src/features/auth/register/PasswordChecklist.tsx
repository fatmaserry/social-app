import { CloseCircle, TickCircle } from "iconsax-reactjs";
import { passwordRules, passwordsMatch } from "./password.rules";

function PasswordChecklist({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) {
  const checks = [
    ...passwordRules.map((rule) => ({ label: rule.label, passed: rule.test(password) })),
    { label: "Passwords match", passed: passwordsMatch(password, confirmPassword) },
  ];

  return (
    <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      {checks.map((check) => (
        <li
          key={check.label}
          className={`flex items-center gap-1.5 text-xs ${check.passed ? "text-success" : "text-danger"}`}
        >
          {check.passed ? (
            <TickCircle size="14" variant="Bold" />
          ) : (
            <CloseCircle size="14" variant="Bold" />
          )}
          {check.label}
        </li>
      ))}
    </ul>
  );
}

export default PasswordChecklist;
