---
### 📚 Teaching Moment: **"Let Your Trigger Fail Loud, But Safely"**
---

#### **The Situation**

A consultant implemented a SQL trigger to log inserts. It was wrapped in `TRY/CATCH`, but the failure was silently swallowed — no error message, no rollback, no visibility. The transaction partially committed, leaving the data in an inconsistent state and creating hours of downstream debugging.

---

#### **The Impact**

Triggers that **fail silently or partially succeed** are dangerous. They break the very foundations of reliable data operations. Without logging and proper rollback, they:

- Introduce invisible bugs and corruption
- Undermine client confidence in the system
- Violate core PRACTICE values:

  - _Professionalism & Predictability_
  - _Reliable Delivery_
  - _Minimized Technical Debt_

---

#### **The PRACTICE Way**

A trigger should always:

1. **Catch and log errors visibly**
2. **Rollback cleanly if needed**
3. **Re-throw the error using `THROW`** to ensure the transaction is aborted and upstream systems are notified

Use `SET XACT_ABORT ON` to force full rollback on runtime errors, and use `XACT_STATE()` in the CATCH block to safely handle the transaction state.

---

#### ✅ **Recommended Template**

```sql
CREATE TRIGGER dbo.TR_YourTable_AI_Granite
ON dbo.YourTable
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Ensures entire transaction is rolled back on unhandled errors.
    SET XACT_ABORT ON;

    BEGIN TRY
        -- Your logic here
        RAISERROR ('Testing error', 16, 1); -- for simulation only
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        DECLARE @TriggerName SYSNAME = OBJECT_NAME(@@PROCID);

        DECLARE @LogMessage NVARCHAR(4000) =
            CONCAT('Trigger [', @TriggerName, '] error: ', @ErrorMessage);

        -- Log the error using SQL event log or error table
        EXEC xp_logevent 50001, @LogMessage, 'ERROR';
        -- Optional: INSERT INTO dbo.GraniteErrorLog ...

        -- Roll back the transaction if active
        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;

        -- Re-throw to abort the outer transaction
        THROW;
    END CATCH
END
GO
```

---

#### ❌ **Anti-Pattern: Silent Trigger Failure**

```sql
BEGIN TRY
   -- error occurs here
END TRY
BEGIN CATCH
   -- does nothing, error disappears
END CATCH
```

This creates **invisible failures** and corrupts your audit trail and client trust.

---

#### 🔑 **Takeaway**

> **Log it. Roll it back. Throw it again.**
> A trigger that fails silently is a ticking time bomb.

---

