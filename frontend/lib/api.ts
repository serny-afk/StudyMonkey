export type PublicUser = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type CharacterRecord = {
  id: string;
  userId: string;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
};

export type QuestSessionRecord = {
  id: string;
  userId: string;
  title: string;
  plannedDurationMinutes: number;
  actualDurationSeconds: number;
  status: "created" | "active" | "paused" | "completed";
  startedAt: string | null;
  lastResumedAt: string | null;
  pausedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: PublicUser;
  character?: CharacterRecord;
};

export type CompleteQuestResult = {
  quest: QuestSessionRecord;
  xpAwarded: number;
  character: CharacterRecord;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001");

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  token?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorPayload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(errorPayload.message)) {
        message = errorPayload.message.join(", ");
      } else if (errorPayload.message) {
        message = errorPayload.message;
      }
    } catch {
      // Ignore JSON parse errors and fall back to generic message.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  login(email: string, password: string) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password }
    });
  },
  register(email: string, password: string) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: { email, password }
    });
  },
  getCharacter(token: string) {
    return request<CharacterRecord>("/character/me", { token });
  },
  getQuests(token: string) {
    return request<QuestSessionRecord[]>("/quests", { token });
  },
  createQuest(token: string, title: string, plannedDurationMinutes: number) {
    return request<QuestSessionRecord>("/quests", {
      method: "POST",
      token,
      body: { title, plannedDurationMinutes }
    });
  },
  startQuest(token: string, questId: string) {
    return request<QuestSessionRecord>(`/quests/${questId}/start`, {
      method: "POST",
      token
    });
  },
  pauseQuest(token: string, questId: string) {
    return request<QuestSessionRecord>(`/quests/${questId}/pause`, {
      method: "POST",
      token
    });
  },
  resumeQuest(token: string, questId: string) {
    return request<QuestSessionRecord>(`/quests/${questId}/resume`, {
      method: "POST",
      token
    });
  },
  completeQuest(token: string, questId: string) {
    return request<CompleteQuestResult>(`/quests/${questId}/complete`, {
      method: "POST",
      token
    });
  }
};
