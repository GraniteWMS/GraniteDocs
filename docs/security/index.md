# Security and Permissions

## Granite WMS Security Policies and Measures
The following security measures should be considered within the context of on-premises hosting, which
provides several inherent benefits that enhance overall security, control, and data protection:
- Complete Control Over Security: On-premises hosting allows organizations to fully manage their security infrastructure, with the ability to implement and adjust tailored configurations as needed.
- Physical Security: With servers located on-site, organizations benefit from direct physical security measures, such as secure access and surveillance, which add an extra layer of protection against unauthorized access.
- Data Privacy and Compliance: On-premises environments allow organizations to keep sensitive data under their direct control, making it easier to comply with privacy regulations and reducing the risk of third-party access.
- Custom Security Measures: On-premises hosting enables organizations to implement custom security solutions tailored to their specific requirements, offering flexibility beyond what’s typically available with cloud-based services.
- Reduced Dependency on Internet Connectivity: Systems hosted on-premises can continue to function during internet outages, providing increased reliability and security in the event of connectivity issues.
- Controlled Access: Access to on-premises systems is tightly controlled and can be secured through internal policies and technologies like VPNs, adding further protection from external threats.

## Application Security
### Authentication and Authorization
- Custom Application Authentication: We use our own custom authentication mechanisms tailored
specifically to our application's requirements, ensuring secure user access control.
- Access to application features is managed through permission-based authorization, ensuring users can
only perform actions that align with their assigned roles.
### Password Encryption
- Salt and Hashing: Passwords are securely hashed with a unique salt for each user, making it harder for
attackers to crack passwords.
### Session Management
- UseSecureCookies: Cookies are only sent over HTTPS connections, preventing them from being
transmitted in plaintext over insecure networks.
- UseHttpOnlyCookies: Cookies cannot be accessed by client-side scripts, which mitigates Cross-Site
Scripting (XSS) attacks.
- UseSameSiteCookies: Cross-Site Request Forgery (CSRF) attacks are prevented by restricting cookies
from being sent with cross-site requests.
- Session Timeout: Sessions are time-limited, with automatic logouts occurring after periods of inactivity.
### Allowed Origins and Cross-Origin Resource Sharing (CORS)
- CORS Implementation: Strict CORS policies are enforced to control which domains can interact with our
.NET applications, preventing unauthorized cross-origin requests.
- Allowed Origins: Only explicitly allowed origins are permitted to interact with the APIs and web services,
ensuring that only trusted sources can access sensitive resources.

### Application Patching and Updates
- We use the GitHub Dependencies Bot to monitor and manage updates to .NET Framework, libraries,
and dependencies. This ensures that any vulnerabilities in third-party libraries are addressed promptly
and efficiently.
### Application Configurations
- DebugMode: Debug mode is set to false by default, ensuring that sensitive information, such as stack
traces and error messages, is not exposed to users in production. This prevents attackers from gaining
insights into the internal workings of the application.
## Web Server Security
### IIS Hardening
- Disable Unnecessary Features: All unnecessary IIS modules (e.g., WebDAV, FTP) are disabled to minimize
the attack surface.
- Application Pool Isolation: Each application is hosted in its own dedicated application pool. This ensures
that if one application is compromised, others remain unaffected.
### Secure Communication
- SSL/TLS Encryption: All communication with the IIS-hosted applications is encrypted via SSL/TLS to
ensure data integrity and confidentiality.

---

Learn how to secure your system with API keys, manage user permissions, and implement best practices for system security. This section covers everything you need to control access, authenticate users, and protect sensitive data. Explore the guides below to ensure your setup is both secure and efficient.

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

</div>