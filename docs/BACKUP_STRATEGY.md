# Database Backup & Disaster Recovery Strategy

Since DigitalOrbit utilizes **MongoDB Atlas** for its primary database, we leverage its fully managed, native backup solutions to ensure high availability and data durability.

## 1. Automated Cloud Backups

For the production environment (Atlas `M10` cluster or higher), Automated Cloud Backups are enabled.

- **Snapshot Frequency**: Snapshots are taken every 6 hours.
- **Retention Policy**:
  - Daily snapshots: Retained for 7 days.
  - Weekly snapshots: Retained for 4 weeks.
  - Monthly snapshots: Retained for 12 months.

### How to Verify Automated Backups
1. Log into your MongoDB Atlas Dashboard.
2. Select your `DigitalOrbit` cluster.
3. Click on the **Backup** tab.
4. Ensure that the "Cloud Backups" toggle is **Active**.

## 2. Point-in-Time Recovery (PITR)

To protect against accidental data deletion or corruption (e.g., mistakenly dropping a collection from the Admin dashboard), Point-in-Time Recovery should be enabled.

- PITR maintains the database's oplog, allowing you to restore the database to *any exact minute* within the last 7 days.
- **How to Use**:
  1. Go to the **Backup** tab in Atlas.
  2. Click **Restore**.
  3. Select **Point in Time**.
  4. Enter the specific date and time right before the data loss occurred.
  5. Choose whether to restore into the existing cluster or a new temporary cluster.

## 3. Manual On-Demand Snapshots

Before deploying major application updates or running large data migration scripts, an on-demand snapshot must be taken.

- **How to trigger**:
  1. In the **Backup** tab, click **Take Snapshot**.
  2. Wait for the snapshot to complete before executing the migration or deployment.

## 4. Local Export (Optional Cold Storage)

For compliance or extreme disaster scenarios, you can occasionally export the database to cold storage (e.g., AWS S3 or a local secure drive).

Use the `mongodump` CLI tool:
```bash
mongodump --uri="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>" --archive=digitalorbit-backup-$(date +%F).gz --gzip
```

*Note: Store these cold backups securely, as they contain sensitive user data (Emails, Hashes, Phone numbers) and must comply with GDPR/Data Privacy regulations.*
