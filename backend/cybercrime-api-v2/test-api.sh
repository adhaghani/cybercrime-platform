#!/bin/bash

# Backend API Testing Script
# Tests the new OOP backend endpoints

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL
BASE_URL="${API_URL:-http://localhost:4000/api/v2}"

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Backend API Testing Script${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "Testing API at: ${YELLOW}${BASE_URL}${NC}"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -e "${BLUE}Testing:${NC} ${description}"
    echo -e "  ${method} ${endpoint}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "${BASE_URL}${endpoint}")
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | sed '$d')
    elif [ "$method" = "POST" ] || [ "$method" = "PUT" ] || [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${BASE_URL}${endpoint}")
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | sed '$d')
    fi
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓ Success (${http_code})${NC}"
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
        echo -e "  ${YELLOW}⚠ Client Error (${http_code})${NC}"
    else
        echo -e "  ${RED}✗ Failed (${http_code})${NC}"
    fi
    
    # Show response preview
    if [ -n "$body" ] && [ "$body" != "" ]; then
        echo -e "  Response: $(echo "$body" | head -c 100)..."
    fi
    echo ""
    
    return 0
}

# 1. Health Check
echo -e "${YELLOW}1. Health & Status Checks${NC}"
test_endpoint "GET" "/health" "Health check"
test_endpoint "GET" "/" "Root endpoint"
echo ""

# 2. Reports Endpoints
echo -e "${YELLOW}2. Reports Endpoints${NC}"
test_endpoint "GET" "/reports" "Get all reports"
test_endpoint "GET" "/reports/pending" "Get pending reports"
test_endpoint "GET" "/reports/active" "Get active reports"
test_endpoint "GET" "/reports/recent" "Get recent reports"
test_endpoint "GET" "/reports/statistics" "Get report statistics"
echo ""

# 3. Crime Reports
echo -e "${YELLOW}3. Crime Reports Endpoints${NC}"
test_endpoint "GET" "/crimes" "Get all crimes"
test_endpoint "GET" "/crimes/active" "Get active crimes"
test_endpoint "GET" "/crimes/statistics/category" "Get crime stats by category"
test_endpoint "GET" "/crimes/statistics/severity" "Get crime stats by severity"
echo ""

# 4. Facility Reports
echo -e "${YELLOW}4. Facility Reports Endpoints${NC}"
test_endpoint "GET" "/facilities" "Get all facilities"
test_endpoint "GET" "/facilities/active" "Get active facilities"
test_endpoint "GET" "/facilities/statistics/type" "Get facility stats by type"
test_endpoint "GET" "/facilities/total-cost" "Get total estimated cost"
echo ""

# 5. Emergency Contacts
echo -e "${YELLOW}5. Emergency Contacts${NC}"
test_endpoint "GET" "/emergency" "Get all emergency contacts"
test_endpoint "GET" "/emergency/grouped/state" "Get contacts grouped by state"
test_endpoint "GET" "/emergency/grouped/type" "Get contacts grouped by type"
echo ""

# 6. Announcements
echo -e "${YELLOW}6. Announcements${NC}"
test_endpoint "GET" "/announcements/active" "Get active announcements (public)"
echo ""

# Summary
echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "To test authenticated endpoints:"
echo -e "  1. Login via ${YELLOW}/auth/login${NC}"
echo -e "  2. Use the JWT token in Authorization header"
echo ""
echo -e "Example:"
echo -e "  ${BLUE}curl -X POST ${BASE_URL}/auth/login \\${NC}"
echo -e "  ${BLUE}  -H 'Content-Type: application/json' \\${NC}"
echo -e "  ${BLUE}  -d '{\"email\":\"admin@example.com\",\"password\":\"password123\"}'${NC}"
echo ""
