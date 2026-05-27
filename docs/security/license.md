# Granite Online Licensing – Operational Guide

`Available from Granite V8 onwards`

Starting with Granite V8, we will introduce a centralized online licensing system for all Granite V8 client environments and instances.

The licensing platform will be managed through a dedicated cloud-based licensing server, allowing Granite to:

- Issue and activate licenses
- Monitor license usage
- Suspend or renew licenses
- Manage expiry dates and grace periods
- Maintain full licensing audit history

The system is designed to be simple, self-service oriented, and operationally efficient for both clients and the Granite team.

Automatic notifications and monitoring will help ensure proactive license management and reduce administrative overhead.

---

## Licensing Principles

It is important to understand that licensing is managed **per Granite instance**, not per client.

Each individual environment requires its own license, including:

- Live / Production
- Test
- UAT
- Training
- Upgrade environments
- Internal environments

This design approach improves licensing integrity, traceability, auditing, and overall operational control while aligning with modern licensing best practices.

---

## Get Customer License

Once the client agreement has been signed, Granite will generate the required licenses for activation.

Please ensure that the license information is obtained before or during the installation and setup process.

---

## Activate License

When a license key is activated, it becomes associated with the specific client environment.

During activation, the system generates a unique environment fingerprint linked to information such as:

- Server details
- Database details
- Environment configuration
- Other identifying system information

This ensures that a license cannot be reused, duplicated, moved between environments, or otherwise abused.

For this reason, a separate license is required for every Granite instance.

---

## Internal and Own-Use Licenses

The same licensing process applies to internal, development, and own-use environments.

Each Granite instance requires its own dedicated license key. Reuse of a single license across multiple environments is not supported.

---

## Online License Validation

Client environments must have network access to the Granite licensing server for license validation and maintenance operations.

Where required, clients may need to whitelist the Granite licensing server address within their firewall or network security configuration.

---

# Expiry and License Maintenance

The online licensing platform provides centralized license administration and maintenance capabilities.

## License Suspension

Granite can suspend a license on request or when required operationally.

This process is performed remotely through the Granite licensing platform and does not require direct access to the client environment.

---

## Expiry Dates and Grace Periods

Licenses can be configured with:

- Expiry dates
- Grace periods
- Renewal windows
- Custom client-specific licensing rules

Both the client and Granite team will receive automated notifications before license expiry to allow proactive renewal and maintenance activities.
