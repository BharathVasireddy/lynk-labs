#!/bin/bash

# Lynk Labs Emergency Database Restore Script
# Use this script to quickly restore from backup in case of data corruption

set -e  # Exit on any error

# Configuration
BACKUP_DIR="/tmp/lynk-labs-backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}🚨 EMERGENCY DATABASE RESTORE${NC}"
echo -e "${YELLOW}⚠️  This will REPLACE your current database with a backup!${NC}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL environment variable is not set${NC}"
    exit 1
fi

# List available backups
echo -e "${BLUE}📋 Available backups:${NC}"
if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR/*.gz 2>/dev/null)" ]; then
    echo -e "${RED}❌ No backups found in $BACKUP_DIR${NC}"
    echo -e "${YELLOW}💡 Make sure you have created backups using the backup script${NC}"
    exit 1
fi

# Show backups with numbers
backups=($(ls -t $BACKUP_DIR/lynklabs_backup_*.sql.gz))
for i in "${!backups[@]}"; do
    backup_file=$(basename "${backups[$i]}")
    backup_date=$(echo "$backup_file" | sed 's/lynklabs_backup_\(.*\)\.sql\.gz/\1/')
    formatted_date=$(echo "$backup_date" | sed 's/\([0-9]\{4\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)_\([0-9]\{2\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)/\1-\2-\3 \4:\5:\6/')
    file_size=$(du -h "${backups[$i]}" | cut -f1)
    echo -e "${GREEN}$((i+1)). $backup_file${NC}"
    echo -e "   📅 Date: $formatted_date"
    echo -e "   📊 Size: $file_size"
    echo ""
done

# Get user selection
echo -e "${BLUE}Please select a backup to restore (1-${#backups[@]}):${NC}"
read -r selection

# Validate selection
if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#backups[@]} ]; then
    echo -e "${RED}❌ Invalid selection${NC}"
    exit 1
fi

selected_backup="${backups[$((selection-1))]}"
backup_name=$(basename "$selected_backup")

echo ""
echo -e "${YELLOW}Selected backup: $backup_name${NC}"

# Verify backup integrity before proceeding
echo -e "${YELLOW}🔍 Verifying backup integrity...${NC}"
if ! pg_restore --list "$selected_backup" > /dev/null 2>&1; then
    echo -e "${RED}❌ Backup file is corrupted or invalid${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backup integrity verified${NC}"

# Final confirmation
echo ""
echo -e "${RED}⚠️  FINAL WARNING:${NC}"
echo -e "${RED}This will PERMANENTLY DELETE your current database and replace it with the backup.${NC}"
echo -e "${RED}All data created after the backup date will be LOST.${NC}"
echo ""
echo -e "${BLUE}Type 'RESTORE' to confirm (case sensitive):${NC}"
read -r confirmation

if [ "$confirmation" != "RESTORE" ]; then
    echo -e "${YELLOW}❌ Restore cancelled${NC}"
    exit 0
fi

# Create a backup of current state before restore
echo -e "${YELLOW}💾 Creating backup of current state...${NC}"
current_backup_file="current_state_before_restore_$(date +%Y%m%d_%H%M%S).sql"
if pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$current_backup_file"; then
    echo -e "${GREEN}✅ Current state backed up to: $current_backup_file${NC}"
else
    echo -e "${RED}❌ Failed to backup current state${NC}"
    echo -e "${BLUE}Do you want to continue anyway? (y/N):${NC}"
    read -r continue_anyway
    if [ "$continue_anyway" != "y" ] && [ "$continue_anyway" != "Y" ]; then
        echo -e "${YELLOW}❌ Restore cancelled${NC}"
        exit 0
    fi
fi

# Perform the restore
echo ""
echo -e "${YELLOW}🔄 Starting database restore...${NC}"
echo -e "${YELLOW}This may take a few minutes depending on database size...${NC}"

# Drop existing database connections (if possible)
echo -e "${YELLOW}🔌 Terminating existing connections...${NC}"
psql "$DATABASE_URL" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid();" 2>/dev/null || true

# Restore from backup
if gunzip -c "$selected_backup" | psql "$DATABASE_URL"; then
    echo -e "${GREEN}✅ Database restore completed successfully!${NC}"
else
    echo -e "${RED}❌ Database restore failed${NC}"
    echo -e "${YELLOW}💡 You may need to restore manually or contact support${NC}"
    exit 1
fi

# Verify restore
echo -e "${YELLOW}🔍 Verifying restore...${NC}"
if psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;" > /dev/null 2>&1; then
    user_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')
    order_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM orders;" | tr -d ' ')
    test_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM tests;" | tr -d ' ')
    
    echo -e "${GREEN}✅ Restore verification successful${NC}"
    echo -e "${BLUE}📊 Database statistics:${NC}"
    echo -e "   👥 Users: $user_count"
    echo -e "   📋 Orders: $order_count"
    echo -e "   🧪 Tests: $test_count"
else
    echo -e "${RED}❌ Restore verification failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Emergency restore completed successfully!${NC}"
echo -e "${GREEN}📁 Restored from: $backup_name${NC}"
echo -e "${GREEN}💾 Current state backup: $current_backup_file${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "1. Test your application to ensure everything works correctly"
echo -e "2. Check that all critical data is present"
echo -e "3. Monitor the application for any issues"
echo -e "4. Consider investigating what caused the data loss"

exit 0 