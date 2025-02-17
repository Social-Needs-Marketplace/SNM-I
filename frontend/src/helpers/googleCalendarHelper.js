const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

export class GoogleCalendarService {
  constructor() {
    this.isAuthenticated = false;
    this.tokenClient = null;
  }

  async initialize() {
    // Load the Google API client library
    await this.loadGoogleApi();
    
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: this.handleAuthResponse,
    });
  }

  async loadGoogleApi() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client', async () => {
          try {
            await gapi.client.init({
              apiKey: GOOGLE_API_KEY,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  handleAuthResponse = (response) => {
    if (response.error) {
      throw new Error('Authentication failed');
    }
    this.isAuthenticated = true;
  };

  async authenticate() {
    if (!this.tokenClient) {
      await this.initialize();
    }
    this.tokenClient.requestAccessToken();
  }

  async syncAppointment(appointment) {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const event = {
      summary: appointment.characteristicOccurrences['Appointment Name'],
      start: {
        dateTime: appointment.date.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(appointment.date.getTime() + 60 * 60 * 1000).toISOString(), // Default 1 hour
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      description: `First Name: ${appointment.characteristicOccurrences['First Name']}\nLast Name: ${appointment.characteristicOccurrences['Last Name']}`,
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      return response.result;
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
      throw error;
    }
  }

  async syncMultipleAppointments(appointments) {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const results = [];
    for (const appointment of appointments) {
      try {
        const result = await this.syncAppointment(appointment);
        results.push({ success: true, appointment, result });
      } catch (error) {
        results.push({ success: false, appointment, error });
      }
    }
    return results;
  }
}

export const googleCalendarService = new GoogleCalendarService();