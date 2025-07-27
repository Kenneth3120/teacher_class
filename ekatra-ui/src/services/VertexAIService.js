import GoogleAuthService from './GoogleAuthService';

class VertexAIService {
  constructor() {
    this.projectId = process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID || 'ekatra-ai-35d6e';
    this.location = 'us-central1';
    this.baseUrl = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}`;
    this.isAvailable = false;
  }

  // Check if Vertex AI is properly configured
  async checkAvailability() {
    try {
      // For now, we'll use a placeholder approach since Vertex AI requires complex OAuth setup
      // In production, this would require proper Google Cloud OAuth2 setup
      this.isAvailable = false;
      return false;
    } catch (error) {
      console.error('Vertex AI not available:', error);
      this.isAvailable = false;
      return false;
    }
  }

  // Generate images using placeholder approach (since Vertex AI requires OAuth2)
  async generateImage(prompt, options = {}) {
    try {
      // Check if service is available
      if (!await this.checkAvailability()) {
        throw new Error('Vertex AI Image Generation is not currently available. This feature requires Google Cloud OAuth2 authentication which needs to be configured by an administrator.');
      }

      // This would normally make the actual API call to Vertex AI
      const requestBody = {
        instances: [{
          prompt: prompt,
          ...options
        }],
        parameters: {
          sampleCount: options.sampleCount || 1,
          aspectRatio: options.aspectRatio || "1:1",
          safetyFilterLevel: "block_some",
          personGeneration: "dont_allow",
          ...options.parameters
        }
      };

      const response = await GoogleAuthService.apiRequest(
        `${this.baseUrl}/publishers/google/models/imagegeneration:predict`,
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate image');
      }

      const result = await response.json();
      return result.predictions || [];
    } catch (error) {
      console.error('Error generating image:', error);
      // Provide helpful error messages for common issues
      if (error.message.includes('authentication') || error.message.includes('UNAUTHENTICATED')) {
        throw new Error('Image Generation requires Google Cloud authentication. Please contact your administrator to enable Vertex AI access with proper OAuth2 credentials.');
      }
      throw error;
    }
  }

  // Generate educational content images
  async generateEducationalContent(subject, topic, gradeLevel, style = 'cartoon') {
    const prompt = `Create an educational ${style} illustration for ${gradeLevel} students about ${topic} in ${subject}. The image should be child-friendly, colorful, and help explain the concept clearly. Include visual elements that make learning engaging and fun.`;
    
    return await this.generateImage(prompt, {
      aspectRatio: "16:9",
      parameters: {
        guidanceScale: 15,
        seed: Math.floor(Math.random() * 1000000)
      }
    });
  }

  // Generate infographic
  async generateInfographic(title, keyPoints, theme = 'modern') {
    const prompt = `Create a ${theme} educational infographic titled "${title}" with the following key points: ${keyPoints.join(', ')}. Use clear typography, icons, and a professional layout suitable for classroom display.`;
    
    return await this.generateImage(prompt, {
      aspectRatio: "3:4",
      parameters: {
        guidanceScale: 12,
        seed: Math.floor(Math.random() * 1000000)
      }
    });
  }

  // Generate diagram
  async generateDiagram(concept, type = 'flowchart', complexity = 'simple') {
    const prompt = `Create a ${complexity} ${type} diagram showing "${concept}". Use clear labels, arrows, and organized layout. The diagram should be educational and easy to understand for students.`;
    
    return await this.generateImage(prompt, {
      aspectRatio: "16:9",
      parameters: {
        guidanceScale: 10,
        seed: Math.floor(Math.random() * 1000000)
      }
    });
  }

  // Generate worksheet illustration
  async generateWorksheetIllustration(subject, activity, ageGroup) {
    const prompt = `Create a fun, engaging illustration for a ${subject} worksheet about ${activity} for ${ageGroup}. The image should be educational, colorful, and appropriate for the age group. Include relevant visual elements that support learning.`;
    
    return await this.generateImage(prompt, {
      aspectRatio: "1:1",
      parameters: {
        guidanceScale: 12,
        seed: Math.floor(Math.random() * 1000000)
      }
    });
  }

  // Generate presentation slide background
  async generateSlideBackground(topic, mood = 'professional', colors = 'blue and white') {
    const prompt = `Create a ${mood} presentation slide background for the topic "${topic}". Use ${colors} color scheme with subtle patterns or gradients. The background should be clean and not distract from text content.`;
    
    return await this.generateImage(prompt, {
      aspectRatio: "16:9",
      parameters: {
        guidanceScale: 8,
        seed: Math.floor(Math.random() * 1000000)
      }
    });
  }

  // Process and convert base64 image to downloadable format
  processGeneratedImage(prediction) {
    if (prediction.bytesBase64Encoded) {
      return {
        base64: prediction.bytesBase64Encoded,
        mimeType: prediction.mimeType || 'image/png',
        downloadUrl: `data:${prediction.mimeType || 'image/png'};base64,${prediction.bytesBase64Encoded}`
      };
    }
    return null;
  }

  // Download generated image
  downloadImage(imageData, filename) {
    const link = document.createElement('a');
    link.href = imageData.downloadUrl;
    link.download = filename || 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Save image to Google Drive (if needed)
  async saveToGoogleDrive(imageData, filename, folderId = null) {
    try {
      const metadata = {
        name: filename,
        parents: folderId ? [folderId] : undefined
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      
      // Convert base64 to blob
      const byteCharacters = atob(imageData.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: imageData.mimeType });
      
      form.append('file', blob);

      const response = await GoogleAuthService.apiRequest(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          body: form
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save to Google Drive');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      throw error;
    }
  }

  // Get predefined prompts for different subjects
  getSubjectPrompts() {
    return {
      mathematics: [
        'Create a visual representation of fractions using pizza slices',
        'Design a colorful number line for learning addition and subtraction',
        'Illustrate geometric shapes with real-world examples',
        'Create a multiplication table with visual elements',
        'Design a chart showing different types of angles'
      ],
      science: [
        'Create a diagram of the water cycle with labels',
        'Design an illustration of plant photosynthesis',
        'Create a solar system diagram with planets and labels',
        'Illustrate the human digestive system',
        'Design a food chain diagram with animals'
      ],
      english: [
        'Create a visual guide to parts of speech',
        'Design a story structure diagram',
        'Illustrate different types of punctuation marks',
        'Create a vocabulary building poster',
        'Design a reading comprehension strategy chart'
      ],
      history: [
        'Create a timeline of ancient civilizations',
        'Design a map of historical trade routes',
        'Illustrate important historical events',
        'Create a comparison chart of different cultures',
        'Design a historical figure biography template'
      ],
      geography: [
        'Create a world map with continents and oceans',
        'Design a diagram of the Earth\'s layers',
        'Illustrate different climate zones',
        'Create a mountain formation diagram',
        'Design a river system illustration'
      ]
    };
  }
}

export default new VertexAIService();