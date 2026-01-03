#!/bin/bash

# Google Maps Setup Verification Script
# This script checks if all necessary components are in place

echo "========================================="
echo "Google Maps Setup Verification"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: .env file exists
echo -n "1. Checking if .env file exists... "
if [ -f "client/.env" ]; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${RED}✗ Missing${NC}"
    echo "   Run: cp client/.env.example client/.env"
fi

# Check 2: API key is set
echo -n "2. Checking if Google Maps API key is configured... "
if [ -f "client/.env" ]; then
    if grep -q "VITE_GOOGLE_MAPS_API_KEY=.*[A-Za-z0-9]" client/.env && ! grep -q "VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here" client/.env; then
        echo -e "${GREEN}✓ Configured${NC}"
    else
        echo -e "${YELLOW}⚠ Not configured or using placeholder${NC}"
        echo "   Edit client/.env and add your actual API key"
    fi
else
    echo -e "${RED}✗ Cannot check (no .env file)${NC}"
fi

# Check 3: GoogleMapPicker component exists
echo -n "3. Checking GoogleMapPicker component... "
if [ -f "client/src/components/common/GoogleMapPicker.tsx" ]; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${RED}✗ Missing${NC}"
fi

# Check 4: Dependencies installed
echo -n "4. Checking @react-google-maps/api dependency... "
if [ -f "client/package.json" ]; then
    if grep -q "@react-google-maps/api" client/package.json; then
        echo -e "${GREEN}✓ Listed in package.json${NC}"
        if [ -d "client/node_modules/@react-google-maps" ]; then
            echo "   ${GREEN}✓ Installed in node_modules${NC}"
        else
            echo "   ${YELLOW}⚠ Not installed - run: cd client && npm install${NC}"
        fi
    else
        echo -e "${RED}✗ Not found in package.json${NC}"
    fi
else
    echo -e "${RED}✗ Cannot check (no package.json)${NC}"
fi

# Check 5: ReportForm integration
echo -n "5. Checking ReportForm integration... "
if [ -f "client/src/components/reports/ReportForm.tsx" ]; then
    if grep -q "GoogleMapPicker" client/src/components/reports/ReportForm.tsx; then
        echo -e "${GREEN}✓ Integrated${NC}"
    else
        echo -e "${YELLOW}⚠ Not integrated${NC}"
    fi
else
    echo -e "${RED}✗ ReportForm not found${NC}"
fi

# Check 6: SOSForm integration
echo -n "6. Checking SOSForm integration... "
if [ -f "client/src/components/sos/SOSForm.tsx" ]; then
    if grep -q "GoogleMapPicker" client/src/components/sos/SOSForm.tsx; then
        echo -e "${GREEN}✓ Integrated${NC}"
    else
        echo -e "${YELLOW}⚠ Not integrated${NC}"
    fi
else
    echo -e "${RED}✗ SOSForm not found${NC}"
fi

echo ""
echo "========================================="
echo "Next Steps:"
echo "========================================="
echo ""
echo "1. Get Google Maps API Key:"
echo "   → Visit: https://console.cloud.google.com/"
echo "   → Enable: Maps JavaScript API & Geocoding API"
echo "   → Create an API key"
echo ""
echo "2. Add API key to client/.env:"
echo "   → Edit: client/.env"
echo "   → Set: VITE_GOOGLE_MAPS_API_KEY=your_actual_key"
echo ""
echo "3. Install dependencies (if needed):"
echo "   → cd client && npm install"
echo ""
echo "4. Start the application:"
echo "   → Terminal 1: cd client && npm run dev"
echo "   → Terminal 2: cd server && npm run dev"
echo ""
echo "5. Test the features:"
echo "   → Go to Reports page → Create Report"
echo "   → Click on the map to pin a location"
echo "   → Drag the marker to adjust"
echo "   → Try 'Use My Location' button"
echo ""
echo "For detailed instructions, see:"
echo "→ GOOGLE_MAPS_COMPLETE_SETUP.md"
echo ""
