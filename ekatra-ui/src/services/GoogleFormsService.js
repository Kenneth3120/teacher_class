import GoogleAuthService from './GoogleAuthService';

class GoogleFormsService {
  constructor() {
    this.baseUrl = 'https://forms.googleapis.com/v1/forms';
  }

  // Create a new Google Form
  async createForm(title, description) {
    try {
      const response = await GoogleAuthService.apiRequest(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify({
          info: {
            title: title,
            description: description,
            documentTitle: title
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create form');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  }

  // Add questions to a form
  async addQuestionsToForm(formId, questions) {
    try {
      const batchRequests = questions.map((question, index) => ({
        createItem: {
          item: {
            title: question.title,
            description: question.description || '',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: question.options.map(option => ({
                    value: option
                  }))
                }
              }
            }
          },
          location: {
            index: index
          }
        }
      }));

      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/${formId}:batchUpdate`,
        {
          method: 'POST',
          body: JSON.stringify({
            requests: batchRequests
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to add questions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding questions:', error);
      throw error;
    }
  }

  // Get form responses
  async getFormResponses(formId) {
    try {
      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/${formId}/responses`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get responses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting form responses:', error);
      throw error;
    }
  }

  // Generate shareable link
  getShareableLink(formId) {
    return `https://docs.google.com/forms/d/${formId}/viewform`;
  }

  // Generate edit link
  getEditLink(formId) {
    return `https://docs.google.com/forms/d/${formId}/edit`;
  }
}

export default new GoogleFormsService();