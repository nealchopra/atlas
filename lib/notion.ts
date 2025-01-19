let accessToken: string | null = null;

export function getNotionAccessToken() {
  if (typeof window !== 'undefined' && !accessToken) {
    const token = localStorage.getItem('sb-jigunwyibqeuukezbyzy-auth-token');
    if (token) {
      const parsedToken = JSON.parse(token);
      accessToken = parsedToken?.access_token;
    }
  }
  return accessToken;
}

export async function listNotionDatabases() {
  const access_token = getNotionAccessToken();
  if (!access_token) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'list_databases',
        access_token,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch databases');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Notion databases:", error);
    throw error;
  }
}

export async function createNotionDatabase(title: string, pageId: string) {
  const access_token = getNotionAccessToken();
  if (!access_token) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create_database',
        access_token,
        title,
        pageId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create database');
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Notion database:", error);
    throw error;
  }
}

export async function addPaperToDatabase(databaseId: string, paper: any, analysis: any) {
  const access_token = getNotionAccessToken();
  if (!access_token) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add_to_database',
        access_token,
        databaseId,
        paper,
        analysis,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add paper to database');
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding paper to Notion database:", error);
    throw error;
  }
} 