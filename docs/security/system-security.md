# Security settings 
`Granite Version 6~`

The following settings are optional and related to Granite security. Configuration is managed within the SystemSettings database table.

Important Notes:
- Each setting is activated by the isActive value in the table.
- The Value field is used to configure the specific parameters for each setting.
- Once a security policy is breached, the **UsersCredential** table will be updated to enforce the policy.

### PasswordFailedAttempts

- Description: Defines the maximum number of failed login attempts allowed before a user account is locked.
- Configuration: Specify the number of failed attempts as the Value.

### PasswordRecoveryMinutes

- Description: Resets the failed login attempt counter after a specified duration (in minutes).
- Dependency: This setting only takes effect if PasswordFailedAttempts is active.
- Configuration: Specify the recovery duration (in minutes) as the Value.

### EnablePasswordStrength

- Description: Enforces a strong password policy for all new passwords while retaining previous passwords.
- Configuration: Set the Value to true to enable password strength enforcement.

### EnablePasswordExpiry

- Description: Activates password expiration, requiring users to update their passwords after a set period.
- Configuration: Specify the expiration period (in days) as the Value.

` Examples of error message`

![Local Image](user-locked.png)


----

![Local Image](password-strength.png)