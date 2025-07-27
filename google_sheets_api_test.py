#!/usr/bin/env python3
"""
Google Sheets API Test for Ekatra UI
Tests the Google Sheets API integration with the updated API key
"""

import requests
import json
import sys
from datetime import datetime

class GoogleSheetsAPITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        # Using the new API key provided by the user
        self.api_key = "AIzaSyAOyFQ4czz4-x8f_CUfziJiQX9EfYLhB4w"
        # Test with a public Google Sheet (Google's sample sheet)
        self.test_sheet_id = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

    def run_test(self, name, test_func):
        """Run a single test"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            success = test_func()
            if success:
                self.tests_passed += 1
                print(f"✅ {name} - PASSED")
            else:
                print(f"❌ {name} - FAILED")
            return success
        except Exception as e:
            print(f"❌ {name} - ERROR: {str(e)}")
            return False

    def test_api_key_validity(self):
        """Test if the API key is valid"""
        try:
            # Test with a simple API call to check if key is valid
            url = f"https://sheets.googleapis.com/v4/spreadsheets/{self.test_sheet_id}?key={self.api_key}"
            
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ API key is valid")
                print(f"📊 Test sheet title: {data.get('properties', {}).get('title', 'Unknown')}")
                return True
            elif response.status_code == 403:
                error_data = response.json()
                print(f"❌ API key error: {error_data.get('error', {}).get('message', 'Unknown error')}")
                return False
            else:
                print(f"❌ Unexpected response: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ API key test failed: {str(e)}")
            return False

    def test_sheets_data_access(self):
        """Test reading data from Google Sheets"""
        try:
            # Test reading data from the sample sheet
            range_name = "Class Data!A:H"  # This is the range used in the StudentManager
            url = f"https://sheets.googleapis.com/v4/spreadsheets/{self.test_sheet_id}/values/{range_name}?key={self.api_key}"
            
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                values = data.get('values', [])
                
                if values:
                    print(f"✅ Successfully retrieved {len(values)} rows of data")
                    print(f"📋 Headers: {values[0] if values else 'No headers'}")
                    print(f"📊 Sample data: {values[1] if len(values) > 1 else 'No data rows'}")
                    return True
                else:
                    print("⚠️ No data found in the sheet")
                    return False
            else:
                error_data = response.json()
                print(f"❌ Data access failed: {error_data.get('error', {}).get('message', 'Unknown error')}")
                return False
                
        except Exception as e:
            print(f"❌ Data access test failed: {str(e)}")
            return False

    def test_api_permissions(self):
        """Test API permissions and enabled services"""
        try:
            # Test with a different range to check permissions
            range_name = "Sheet1!A1:Z1000"  # Broader range
            url = f"https://sheets.googleapis.com/v4/spreadsheets/{self.test_sheet_id}/values/{range_name}?key={self.api_key}"
            
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                print("✅ API has proper read permissions")
                return True
            elif response.status_code == 403:
                error_data = response.json()
                error_message = error_data.get('error', {}).get('message', '')
                
                if 'API has not been used' in error_message:
                    print("❌ Google Sheets API is not enabled for this project")
                    print("💡 Solution: Enable Google Sheets API in Google Cloud Console")
                elif 'quota' in error_message.lower():
                    print("⚠️ API quota exceeded")
                else:
                    print(f"❌ Permission error: {error_message}")
                return False
            else:
                print(f"❌ Unexpected response: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Permission test failed: {str(e)}")
            return False

    def test_error_handling_scenarios(self):
        """Test various error scenarios"""
        try:
            # Test with invalid sheet ID
            invalid_sheet_id = "invalid_sheet_id_12345"
            url = f"https://sheets.googleapis.com/v4/spreadsheets/{invalid_sheet_id}/values/Sheet1!A:H?key={self.api_key}"
            
            response = requests.get(url, timeout=10)
            
            if response.status_code == 400:
                print("✅ Properly handles invalid sheet ID")
                return True
            elif response.status_code == 404:
                print("✅ Properly handles non-existent sheet")
                return True
            else:
                print(f"⚠️ Unexpected response for invalid sheet: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error handling test failed: {str(e)}")
            return False

def main():
    print("🚀 Starting Google Sheets API Testing...")
    print("=" * 60)
    
    tester = GoogleSheetsAPITester()
    
    # Run all tests
    tests = [
        ("API Key Validity", tester.test_api_key_validity),
        ("Sheets Data Access", tester.test_sheets_data_access),
        ("API Permissions", tester.test_api_permissions),
        ("Error Handling", tester.test_error_handling_scenarios),
    ]
    
    for test_name, test_func in tests:
        tester.run_test(test_name, test_func)
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Google Sheets API is properly configured.")
        print("\n💡 Next Steps:")
        print("   1. The API key is working correctly")
        print("   2. Users can now import student data from Google Sheets")
        print("   3. Error handling will provide clear guidance to users")
        return 0
    else:
        print("⚠️ Some tests failed. Check the output above for details.")
        print("\n🔧 Common Solutions:")
        print("   1. Enable Google Sheets API in Google Cloud Console")
        print("   2. Ensure the API key has proper permissions")
        print("   3. Check if the API key is restricted to specific domains")
        return 1

if __name__ == "__main__":
    sys.exit(main())