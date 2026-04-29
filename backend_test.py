import requests
import sys
from datetime import datetime
import json

class LandingPageAPITester:
    def __init__(self, base_url="https://interim-security.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.results.append({
                'test': name,
                'success': success,
                'status_code': response.status_code,
                'expected_status': expected_status
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                'test': name,
                'success': False,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "company": "Test Company",
            "message": "This is a test message for the contact form submission."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "api/contact",
            200,
            data=test_data
        )
        
        if success and response:
            # Verify response structure
            required_fields = ['id', 'name', 'email', 'message', 'submitted_at', 'status']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False
            print(f"✅ Contact form response has all required fields")
            return True
        return False

    def test_contact_form_validation(self):
        """Test contact form validation with invalid data"""
        # Test missing required fields
        invalid_data = {
            "name": "",  # Empty name
            "email": "invalid-email",  # Invalid email
            "message": "short"  # Too short message
        }
        
        success, response = self.run_test(
            "Contact Form Validation (Invalid Data)",
            "POST",
            "api/contact",
            422,  # Expecting validation error
            data=invalid_data
        )
        
        return success

    def test_get_contact_submissions(self):
        """Test getting contact submissions"""
        return self.run_test(
            "Get Contact Submissions",
            "GET",
            "api/contact",
            200
        )

def main():
    print("🚀 Starting Landing Page API Tests")
    print("=" * 50)
    
    # Setup
    tester = LandingPageAPITester()
    
    # Run backend API tests
    print("\n📡 Testing Backend API Endpoints...")
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test contact form functionality
    tester.test_contact_form_submission()
    
    # Test form validation
    tester.test_contact_form_validation()
    
    # Test getting submissions
    tester.test_get_contact_submissions()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Backend API Test Results:")
    print(f"   Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print detailed results
    print("\n📋 Detailed Results:")
    for result in tester.results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"   {status} - {result['test']}")
        if not result['success'] and 'error' in result:
            print(f"      Error: {result['error']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())