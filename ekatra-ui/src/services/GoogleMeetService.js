import GoogleAuthService from './GoogleAuthService';

class GoogleMeetService {
  constructor() {
    this.baseUrl = 'https://www.googleapis.com/calendar/v3';
  }

  // Create a Google Meet meeting
  async createMeeting(meetingDetails) {
    try {
      const event = {
        summary: meetingDetails.title,
        description: meetingDetails.description || '',
        start: {
          dateTime: meetingDetails.startTime,
          timeZone: meetingDetails.timeZone || 'UTC'
        },
        end: {
          dateTime: meetingDetails.endTime,
          timeZone: meetingDetails.timeZone || 'UTC'
        },
        attendees: meetingDetails.attendees || [],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 1440 }, // 24 hours
            { method: 'popup', minutes: 10 }    // 10 minutes
          ]
        }
      };

      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/calendars/primary/events?conferenceDataVersion=1`,
        {
          method: 'POST',
          body: JSON.stringify(event)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create meeting');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }

  // Get meeting details
  async getMeetingDetails(eventId) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/calendars/primary/events/${eventId}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get meeting details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting meeting details:', error);
      throw error;
    }
  }

  // Update meeting
  async updateMeeting(eventId, updates) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/calendars/primary/events/${eventId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updates)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update meeting');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  }

  // Delete meeting
  async deleteMeeting(eventId) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to delete meeting');
      }

      return response.status === 204;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  }

  // Get upcoming meetings
  async getUpcomingMeetings(timeMin = new Date().toISOString()) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/calendars/primary/events?timeMin=${timeMin}&orderBy=startTime&singleEvents=true&maxResults=50`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get meetings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting meetings:', error);
      throw error;
    }
  }

  // Schedule doubt session meeting
  async scheduleDoubtSession(studentName, subject, topic, dateTime, duration = 30) {
    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    return await this.createMeeting({
      title: `Doubt Session - ${studentName}`,
      description: `
        <div>
          <h3>Doubt Clearing Session</h3>
          <p><strong>Student:</strong> ${studentName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Duration:</strong> ${duration} minutes</p>
        </div>
      `,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees: [
        // Add student email if available
      ]
    });
  }

  // Extract meet link from event
  extractMeetLink(event) {
    if (event.conferenceData && event.conferenceData.entryPoints) {
      const meetEntry = event.conferenceData.entryPoints.find(
        entry => entry.entryPointType === 'video'
      );
      return meetEntry ? meetEntry.uri : null;
    }
    return null;
  }
}

export default new GoogleMeetService();