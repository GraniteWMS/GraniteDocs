# Security settings (Granite Version 6~)


The settings below related to Granite security are optional in.
Take Note each setting is activated by the isActive value. The Value is used for configuration of each setting.


- PasswordFailedAttempts
Number of failed login attempts before user account get locked

- PasswordRecoveryMinutes
Reset Failed Attempts after duration. This setting will only take effect if the `PasswordFailedAttempts` is active.

- EnablePasswordStrength 
Enforce password policy for strong passwords
This will enforce password strength on all new password, and keep previous passwords.

- EnablePasswordExpiry
Enable password expiration. Set expiry in days.
