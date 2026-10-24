import ChangePasswordForm from "../ChangePassword/ChangePasswordForm";

function AccountSettings() {
  return (
    <>
      <h1 className="text-lg font-bold text-foreground">Account settings</h1>

      <div className="rounded-3xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Change password
        </h2>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}

export default AccountSettings;
