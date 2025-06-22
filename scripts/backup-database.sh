#!/bin/bash

# Lynk Labs Database Backup Script
# Run this script every 6 hours via cron job

set -e  # Exit on any error

# Configuration
BACKUP_DIR="/tmp/lynk-labs-backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="lynklabs_backup_$DATE.sql"
MAX_BACKUPS=10  # Keep last 10 backups

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Starting database backup...${NC}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL environment variable is not set${NC}"
    exit 1
fi

# Create database backup
echo -e "${YELLOW}📊 Creating database backup...${NC}"
if pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILE"; then
    echo -e "${GREEN}✅ Database backup created: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ Database backup failed${NC}"
    exit 1
fi

# Compress backup
echo -e "${YELLOW}🗜️ Compressing backup...${NC}"
if gzip "$BACKUP_DIR/$BACKUP_FILE"; then
    COMPRESSED_FILE="$BACKUP_FILE.gz"
    echo -e "${GREEN}✅ Backup compressed: $COMPRESSED_FILE${NC}"
else
    echo -e "${RED}❌ Backup compression failed${NC}"
    exit 1
fi

# Verify backup integrity
echo -e "${YELLOW}🔍 Verifying backup integrity...${NC}"
if pg_restore --list "$BACKUP_DIR/$COMPRESSED_FILE" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backup integrity verified${NC}"
else
    echo -e "${RED}❌ Backup integrity check failed${NC}"
    exit 1
fi

# Clean up old backups (keep only last MAX_BACKUPS)
echo -e "${YELLOW}🧹 Cleaning up old backups...${NC}"
cd "$BACKUP_DIR"
ls -t lynklabs_backup_*.sql.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
REMAINING_BACKUPS=$(ls -1 lynklabs_backup_*.sql.gz 2>/dev/null | wc -l)
echo -e "${GREEN}✅ Cleanup complete. Keeping $REMAINING_BACKUPS backups${NC}"

# Upload to cloud storage (if configured)
if [ ! -z "$AWS_S3_BUCKET" ]; then
    echo -e "${YELLOW}☁️ Uploading to S3...${NC}"
    if aws s3 cp "$BACKUP_DIR/$COMPRESSED_FILE" "s3://$AWS_S3_BUCKET/database-backups/"; then
        echo -e "${GREEN}✅ Backup uploaded to S3${NC}"
    else
        echo -e "${YELLOW}⚠️ S3 upload failed (continuing anyway)${NC}"
    fi
fi

# Log backup completion
echo -e "${GREEN}🎉 Backup completed successfully!${NC}"
echo -e "${GREEN}📁 Backup file: $BACKUP_DIR/$COMPRESSED_FILE${NC}"
echo -e "${GREEN}📊 File size: $(du -h "$BACKUP_DIR/$COMPRESSED_FILE" | cut -f1)${NC}"

# Optional: Send notification (uncomment if you have notification system)
# curl -X POST "https://your-webhook-url.com/backup-success" \
#   -H "Content-Type: application/json" \
#   -d '{"message": "Database backup completed successfully", "file": "'$COMPRESSED_FILE'"}'

exit 0 