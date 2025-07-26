import { auth } from '../firebase';

// Google OAuth scopes for all required APIs
const SCOPES = [
  'https://www.googleapis.com/auth/forms',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/cloud-platform'
].join(' ');

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "790890898686-f17121o7o5m87qeq7jvmlukiocsqplg5.apps.googleusercontent.com";
const REDIRECT_URI = window.location.origin + '/auth/callback';

class GoogleAuthService {
  constructor() {
    this.accessToken = localStorage.getItem('google_access_token');
    this.refreshToken = localStorage.getItem('google_refresh_token');
    this.tokenExpiry = localStorage.getItem('google_token_expiry');
  }

  // Initialize Google Sign-In
  async initGoogleAuth() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            redirect_uri: REDIRECT_URI
          }).then(() => {
            resolve(window.gapi.auth2.getAuthInstance());
          }).catch(reject);
        });
      } else {
        reject(new Error('Google API not loaded'));
      }
    });
  }

  // Authenticate and get access token
  async authenticate() {
    try {
      const authInstance = await this.initGoogleAuth();
      
      if (!authInstance.isSignedIn.get()) {
        const user = await authInstance.signIn();
        const authResponse = user.getAuthResponse();
        
        this.accessToken = authResponse.access_token;
        this.tokenExpiry = authResponse.expires_at;
        
        // Store tokens
        localStorage.setItem('google_access_token', this.accessToken);
        localStorage.setItem('google_token_expiry', this.tokenExpiry);
        
        return this.accessToken;
      } else {
        // Check if token is still valid
        if (this.isTokenValid()) {
          return this.accessToken;
        } else {
          return await this.refreshAccessToken();
        }
      }
    } catch (error) {
      console.error('Google authentication failed:', error);
      throw new Error('Failed to authenticate with Google. Please try again.');
    }
  }

  // Check if current token is valid
  isTokenValid() {
    if (!this.accessToken || !this.tokenExpiry) return false;
    return Date.now() < parseInt(this.tokenExpiry);
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const authInstance = await this.initGoogleAuth();
      const user = authInstance.currentUser.get();
      await user.reloadAuthResponse();
      
      const authResponse = user.getAuthResponse();
      this.accessToken = authResponse.access_token;
      this.tokenExpiry = authResponse.expires_at;
      
      localStorage.setItem('google_access_token', this.accessToken);
      localStorage.setItem('google_token_expiry', this.tokenExpiry);
      
      return this.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error('Failed to refresh authentication token');
    }
  }

  // Get valid access token
  async getAccessToken() {
    if (this.isTokenValid()) {
      return this.accessToken;
    }
    return await this.authenticate();
  }

  // Make authenticated API request
  async apiRequest(url, options = {}) {
    const token = await this.getAccessToken();
    
    return fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  // Sign out
  async signOut() {
    try {
      const authInstance = await this.initGoogleAuth();
      await authInstance.signOut();
      
      // Clear stored tokens
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');
      localStorage.removeItem('google_token_expiry');
      
      this.accessToken = null;
      this.refreshToken = null;
      this.tokenExpiry = null;
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
}

export default new GoogleAuthService();