# Security and Permissions

Granite WMS runs in your own environment, so you keep control of your data, infrastructure and network access. Security is a shared responsibility between Granite and your IT team. This page sets out how we approach it and who looks after what.

## How Granite protects your system

### Access control
Every user has their own account, and permissions assigned through user groups determine which features are available to them. Deactivating a user stops that user from logging in, and integrations authenticate with their own API keys rather than user passwords.

### Passwords
Passwords are never stored in plaintext. Each one is hashed using PBKDF2 with SHA-256 and a unique salt. Password strength, password expiry and account lockout policies are available, so you can align Granite with your own security policy.

### Sessions
User sessions are time-limited and require users to log in again once they expire. Session cookies cannot be read by client-side scripts, and are marked Secure when used over HTTPS.

### Encryption in transit
Granite supports encrypted HTTPS connections for its web applications, and our installer configures new sites to use HTTPS. We recommend HTTPS for every Granite site, using a certificate from a trusted certificate authority.

### Software maintenance
We monitor our main application repositories for known vulnerabilities in third-party libraries, and we do not release our software unless it has passed our automated tests. Fixes are delivered through versioned releases, and changes are recorded in our [release notes](https://granitewms.canny.io/changelog).

## Shared responsibility

Security is everyone's responsibility. Good software and careful configuration only go so far. The table below shows who is responsible for each area.
Granite consultants work through the [Hardening Checklist](hardening-checklist.md) alongside the customer's IT team before go-live.

| Area | Granite | Your IT team |
|------|:-------:|:------------:|
| Application software and security fixes | **Responsible** | |
| Installation and upgrades | **Responsible** | Assists |
| HTTPS configuration | **Responsible** | Assists |
| Certificates | Assists | **Responsible** |
| Users and permissions | Assists | **Responsible** |
| Password and lockout policies | Assists | **Responsible** |
| Servers, operating systems and databases | Assists | **Responsible** |
| Backups | | **Responsible** |
| Network, firewall and remote access | Assists | **Responsible** |
| Physical security | | **Responsible** |


---

The guides below cover the settings and controls in more detail.

<div class="grid cards" markdown>

 -	[__System Security__](system-security.md)

    ---

    Optional settings allowing you to enforce industry standard policies, like account lockouts and password expiration.

 -	[__User Permissions__](user-permissions.md)

    --- 

    A complete list of the user permissions in Granite and what they map to.

 -	[__API Keys__](api-keys.md) 

    ---

    A guide on using API Keys to authenticate with our APIs.

 -	[__Hardening Checklist__](hardening-checklist.md)

    ---

    The steps to take when installing and maintaining Granite, for Granite consultants and your IT team.

</div>
