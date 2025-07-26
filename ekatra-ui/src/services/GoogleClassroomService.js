import GoogleAuthService from './GoogleAuthService';

class GoogleClassroomService {
  constructor() {
    this.baseUrl = 'https://classroom.googleapis.com/v1';
  }

  // Get all courses
  async getCourses() {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/courses?teacherId=me&courseStates=ACTIVE`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get courses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  }

  // Get students in a course
  async getStudents(courseId) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/courses/${courseId}/students`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get students');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting students:', error);
      throw error;
    }
  }

  // Get course assignments
  async getAssignments(courseId) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/courses/${courseId}/courseWork`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get assignments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting assignments:', error);
      throw error;
    }
  }

  // Create an assignment
  async createAssignment(courseId, assignment) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/courses/${courseId}/courseWork`,
        {
          method: 'POST',
          body: JSON.stringify(assignment)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create assignment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }

  // Get student submissions
  async getSubmissions(courseId, courseWorkId) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get submissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting submissions:', error);
      throw error;
    }
  }

  // Sync students from Google Classroom to Ekatra
  async syncStudentsFromClassroom(courseId) {
    try {
      const studentsResponse = await this.getStudents(courseId);
      const students = studentsResponse.students || [];

      return students.map(student => ({
        id: student.userId,
        name: student.profile.name.fullName,
        email: student.profile.emailAddress,
        photoUrl: student.profile.photoUrl,
        source: 'google_classroom',
        courseId: courseId,
        joinedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error syncing students:', error);
      throw error;
    }
  }

  // Create announcement
  async createAnnouncement(courseId, announcement) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/courses/${courseId}/announcements`,
        {
          method: 'POST',
          body: JSON.stringify(announcement)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create announcement');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }
}

export default new GoogleClassroomService();