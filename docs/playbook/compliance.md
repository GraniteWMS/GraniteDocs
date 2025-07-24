# Vendor Compliance Approach – Granite WMS

## 1. Purpose

This document outlines our approach as a vendor to supporting compliance, governance, and security best practices within the Granite WMS platform. It is intended to guide both our internal team and our clients in understanding the shared responsibility model we use to maintain secure, reliable, and auditable systems.

> **Note:**  
> Our goal is **not to comply with every formal standard**, but to follow widely accepted **best practices and guidelines** that align with frameworks like COBIT, ISO 27001, NIST, and others. We aim to provide a secure and well-governed system while allowing flexibility for our clients’ specific compliance needs.

---

## 2. Our Compliance Philosophy

We recognize that system compliance is a shared responsibility between the vendor (us) and the client (you). We aim to:

- Provide the **technical controls, features, and logging** required to support your compliance frameworks.
- Maintain **secure coding and system design standards**.
- Collaborate with clients to support **audit preparation**, **incident response**, and **governance processes**.

---

## 3. Shared Responsibility Model

Compliance is a joint effort. Here's how we define responsibilities:

### 3.1 Summary Table

| Area                                      | **Our Responsibility (Vendor)**                           | **Your Responsibility (Client)**                              | **Shared Responsibility**                                     |
| ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| **User Access Management**                | Provide Role-Based Access Control (RBAC) and audit logs   | Define roles, assign access, and review users regularly       | Configure roles properly and remove unused accounts           |
| **Authentication & Passwords**            | Support password complexity, expiry, and lockout settings | Set and enforce policy rules, train users                     | Monitor for weak credentials, handle password reset processes |
| **Security Monitoring**                   | Provide logs, audit trails, and error reports             | Monitor and alert on suspicious behavior using internal tools | Enable alerts and reporting features where available          |
| **Integration Monitoring** | Provide logs for sync events and errors                   | Monitor sync accuracy and reconcile data                      | Work together to resolve interface issues and discrepancies   |
| **Privileged Access**                     | Ensure logs capture admin activity                        | Restrict access to privileged functions                       | Review elevated access regularly and remove where unnecessary |
| **Audit Support**                         | Provide system documentation, logs, and feature overviews | Manage audit response, collect evidence                       | Collaborate on any client-requested audit deliverables        |

---

## 4. What We Build In

We embed the following practices into our systems and development lifecycle:
| ✅ Practice                    | Category                   | Description                                                                                   |
|-------------------------------|----------------------------|-----------------------------------------------------------------------------------------------|
| 🔐 **Security by Design**      | Architecture & Access       | System is designed with secure authentication, access control, and role-based permissions.    |
| 📜 **Audit Logging**           | Monitoring & Auditing       | User actions, data changes, and access events are logged for traceability and accountability. |
| 🚨 **Error Reporting**         | Monitoring & Integration    | Integration and system errors are captured, with logs available to assist in troubleshooting. |
| 🔑 **Data Access & Encryption**| Data Protection & Security  | Data is secured at rest and in transit, with appropriate encryption and access restrictions.  |
| 👥 **User & Role Review Support** | Governance & Operations   | Tools and reports are available to help clients review and manage user roles and permissions. |
| 📣 **Change Notifications**    | Change Management           | Clients are notified in advance of major updates, system changes, or planned downtime.        |
| 🌐 **API Security**            | Integration & Interfaces    | Secure access to APIs is supported via tokens, API keys, and usage limits where appropriate.  |

---

## 5. Your Role as the Client

To ensure effective compliance, clients are expected to:

- Assign dedicated users to review access permissions and usage  
- Define and apply password and access policies using provided system settings  
- Refrain from using shared or generic user accounts  
- Regularly review activity and reconciliation logs  
- Alert our team promptly when anomalies or potential breaches are detected  

---

## 6. Collaboration for Compliance

We actively support clients during:

- 🔍 **Internal and external audits**  
- 🛠️ **Security reviews**  
- 💬 **Risk assessments and incident investigations**  
- 📤 **Evidence preparation**  


---

## 7. Review & Improvements

We continuously review our compliance capabilities and update this document annually or in response to:

- Major product changes  
- Regulatory developments  
- Client feedback or audit outcomes  

---

📌 Final Thought 
We are committed to supporting your compliance and governance efforts by embedding best practices into the design and operation of Granite WMS.

While we do not claim to comply with every global standard, we align with widely accepted frameworks such as COBIT, ISO 27001, and NIST to ensure a secure, reliable, and auditable platform.

Our role is to provide the tools, controls, and transparency needed for you to meet your own internal and regulatory compliance requirements.

We welcome collaboration and are always ready to support your team during audits, reviews, or security assessments.