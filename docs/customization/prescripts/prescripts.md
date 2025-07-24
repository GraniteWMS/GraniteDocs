
---

### 📚 Teaching Moment: **“A T-SQL Script Should Be Well-Formed, or Not Run at All”**

---

#### **The Situation**

It’s easy to focus on getting a T-SQL script to “just work.” But in a real production system — especially in a live warehouse — scripts run under pressure, on live data, and often as part of an automated process or scanner interaction.

Many failures we’ve traced come down to scripts that:

* Assume inputs are always present
* Lack error handling
* Return nothing when something goes wrong
* Fail silently and leave bad data behind

---

#### **The Impact**

Poorly structured SQL might seem faster to write, but it causes:

* Inconsistent behavior across environments
* Difficult-to-diagnose issues in production
* Rework, cleanup, and loss of trust
* Cascading failures when dependent logic relies on a successful response

This directly undermines:

* 🔒 **Professionalism and Predictability**
* 🎯 **Technical Excellence**
* 🧹 **Minimized Technical Debt**

---

#### **The PRACTICE Way**

All scripts that run as part of Granite WMS must follow a few basic principles:

---

### ✅ 1. **Structured Start**

Begin your script with:

* `SET NOCOUNT ON` to avoid extra result sets
* Declare all variables upfront
* Use comments to separate and label sections

---

### ✅ 2. **Safe Input Parsing**

Always check that required inputs exist before using them. Use `ISNULL(...)` or fallback values.

```sql
DECLARE @Document VARCHAR(30)
SELECT @Document = ISNULL(Value, '') FROM @input WHERE Name = 'Document'
```

---

### ✅ 3. **Defensive Error Handling**

Use `TRY/CATCH` to prevent your script from breaking the scanner.

```sql
BEGIN TRY
   -- Your logic here
END TRY
BEGIN CATCH
   SET @Valid = 0
   SET @Reference = 'Error: ' + ERROR_MESSAGE()
END CATCH
```

---

### ✅ 4. **Consistent Output Structure**

Always return:

* `Valid` (bit, 1 = success, 0 = failure)
* `Reference` (varchar, explanation or result)

These are used by the process engine or UI to continue or block flow.

---

### ✅ 5. **Readable and Maintainable**

Write for the next consultant:

* Clear variable names
* Comments explaining intent
* No cryptic logic or “shortcuts”

---

#### 🔑 Takeaway

> **“If your SQL isn’t safe, readable, and predictable — it doesn’t belong in production.”**

In PRACTICE, we don’t just write SQL that runs.
We write SQL that survives real-world usage, upgrades, and other people.

---
