#!/usr/bin/env python3
"""
Backend Test for Ekatra UI - AI Teaching Assistant
Tests the AI functionality and Firebase integration
"""

import requests
import json
import sys
from datetime import datetime

class EkatraAITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.gemini_api_key = "AIzaSyBqMnoCfbZ2r6PnRnGKmSjTBzYJK-dKYiY"
        self.firebase_config = {
            "apiKey": "AIzaSyBph9y5ieyTNDl2ygmTk_WSCAO8mlhvwng",
            "authDomain": "ekatra-ai-35d6e.firebaseapp.com",
            "projectId": "ekatra-ai-35d6e",
            "storageBucket": "ekatra-ai-35d6e.firebasestorage.app",
            "messagingSenderId": "263904598549",
            "appId": "1:263904598549:web:ae6c6cc99534bc55934c1c"
        }

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

    def test_gemini_ai_integration(self):
        """Test Gemini AI API integration"""
        try:
            # Test the Gemini API directly
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
            
            headers = {
                'Content-Type': 'application/json',
            }
            
            data = {
                "contents": [{
                    "parts": [{
                        "text": "You are Alfred, an AI teaching assistant. Help the teacher with their question: What are effective classroom management strategies?"
                    }]
                }]
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    content = result['candidates'][0]['content']['parts'][0]['text']
                    print(f"📝 AI Response Preview: {content[:100]}...")
                    
                    # Check if response contains markdown-like content
                    has_markdown = any(marker in content for marker in ['#', '*', '-', '1.', '2.'])
                    if has_markdown:
                        print("✅ AI response contains structured content (markdown)")
                    else:
                        print("⚠️ AI response may not be properly formatted")
                    
                    return True
                else:
                    print("❌ No content in AI response")
                    return False
            else:
                print(f"❌ API request failed with status: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Gemini AI test failed: {str(e)}")
            return False

    def test_lesson_plan_generation(self):
        """Test lesson plan generation functionality"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
            
            headers = {
                'Content-Type': 'application/json',
            }
            
            data = {
                "contents": [{
                    "parts": [{
                        "text": "Generate a detailed lesson plan for a grade 5 class on the topic of 'Photosynthesis'. The lesson plan should be in English. Include learning objectives, materials needed, step-by-step activities, and an assessment method. Format your response using proper markdown with headers, bullet points, and sections."
                    }]
                }]
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    content = result['candidates'][0]['content']['parts'][0]['text']
                    
                    # Check for lesson plan components
                    required_components = ['objective', 'material', 'activity', 'assessment']
                    found_components = sum(1 for comp in required_components if comp.lower() in content.lower())
                    
                    print(f"📚 Found {found_components}/{len(required_components)} lesson plan components")
                    
                    # Check for markdown formatting
                    markdown_elements = ['#', '*', '-', '1.', '2.']
                    has_formatting = any(element in content for element in markdown_elements)
                    
                    if has_formatting:
                        print("✅ Lesson plan has proper markdown formatting")
                    else:
                        print("⚠️ Lesson plan may lack proper formatting")
                    
                    return found_components >= 2 and has_formatting
                else:
                    return False
            else:
                print(f"❌ Lesson plan generation failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Lesson plan test failed: {str(e)}")
            return False

    def test_translation_functionality(self):
        """Test translation functionality"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
            
            headers = {
                'Content-Type': 'application/json',
            }
            
            data = {
                "contents": [{
                    "parts": [{
                        "text": "Translate the following text from English to Hindi. Only provide the translation, no additional text or explanation: 'Good morning, students! Please submit your homework'"
                    }]
                }]
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    content = result['candidates'][0]['content']['parts'][0]['text']
                    
                    # Check if translation contains Hindi characters
                    has_hindi = any('\u0900' <= char <= '\u097F' for char in content)
                    
                    if has_hindi:
                        print("✅ Translation contains Hindi characters")
                        print(f"🌐 Translation: {content}")
                        return True
                    else:
                        print("⚠️ Translation may not be in Hindi")
                        return False
                else:
                    return False
            else:
                print(f"❌ Translation failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Translation test failed: {str(e)}")
            return False

    def test_quiz_generation(self):
        """Test quiz generation functionality"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
            
            headers = {
                'Content-Type': 'application/json',
            }
            
            data = {
                "contents": [{
                    "parts": [{
                        "text": "Create a quiz for grade 5 students on the topic of 'Solar System'. Generate 5 multiple choice questions with 4 options each. Format your response using proper markdown with headers, bullet points, and clear structure."
                    }]
                }]
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    content = result['candidates'][0]['content']['parts'][0]['text']
                    
                    # Check for quiz elements
                    question_indicators = ['?', 'Question', 'Q1', 'Q2', 'A)', 'B)', 'C)', 'D)']
                    found_indicators = sum(1 for indicator in question_indicators if indicator in content)
                    
                    print(f"❓ Found {found_indicators} quiz indicators")
                    
                    # Check for multiple choice format
                    has_options = 'A)' in content and 'B)' in content
                    
                    if has_options:
                        print("✅ Quiz has multiple choice format")
                    else:
                        print("⚠️ Quiz may not have proper multiple choice format")
                    
                    return found_indicators >= 4 and has_options
                else:
                    return False
            else:
                print(f"❌ Quiz generation failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Quiz generation test failed: {str(e)}")
            return False

    def test_firebase_config(self):
        """Test Firebase configuration"""
        try:
            # Test Firebase Auth REST API
            url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={self.firebase_config['apiKey']}"
            
            # This should return an error for missing email/password, but confirms API key works
            response = requests.post(url, json={}, timeout=10)
            
            if response.status_code == 400:
                error_data = response.json()
                if 'error' in error_data and 'MISSING_EMAIL' in str(error_data['error']):
                    print("✅ Firebase API key is valid")
                    return True
            
            print(f"⚠️ Unexpected Firebase response: {response.status_code}")
            return False
            
        except Exception as e:
            print(f"❌ Firebase config test failed: {str(e)}")
            return False

def main():
    print("🚀 Starting Ekatra UI Backend Testing...")
    print("=" * 50)
    
    tester = EkatraAITester()
    
    # Run all tests
    tests = [
        ("Firebase Configuration", tester.test_firebase_config),
        ("Gemini AI Integration", tester.test_gemini_ai_integration),
        ("Lesson Plan Generation", tester.test_lesson_plan_generation),
        ("Translation Functionality", tester.test_translation_functionality),
        ("Quiz Generation", tester.test_quiz_generation),
    ]
    
    for test_name, test_func in tests:
        tester.run_test(test_name, test_func)
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend functionality is working correctly.")
        return 0
    else:
        print("⚠️ Some tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())