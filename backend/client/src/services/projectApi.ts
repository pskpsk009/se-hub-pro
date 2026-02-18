const resolveBaseUrl = (): string => {
  const meta = import.meta as unknown as { env?: Record<string, string | undefined> };
  const configured = meta.env?.VITE_API_BASE_URL ?? "http://localhost:5001";
  return configured.replace(/\/$/, "");
};

const API_BASE_URL = resolveBaseUrl();

interface ApiErrorResponse {
  error?: string;
}

export interface ApiTeamMember {
  id?: string | number;
  name?: string;
  email: string;
  role?: string;
  isPrimary?: boolean;
}

export interface ApiProjectFile {
  name: string;
  size?: string;
  type?: string;
}

export interface ApiProjectStudent {
  id: number | string;
  name: string;
  email: string;
}

export interface ApiProjectFeedback {
  advisor?: string | null;
  coordinator?: string | null;
}

export interface ApiProject {
  id: number;
  title: string;
  type: string;
  status: string;
  submissionDate: string | null;
  lastModified: string | null;
  description: string;
  students: string[];
  studentDetails?: ApiProjectStudent[];
  advisor: string;
  advisorEmail?: string;
  teamName?: string;
  keywords?: string[];
  competitionName?: string | null;
  award?: string | null;
  externalLinks?: string[];
  files?: ApiProjectFile[];
  teamMembers?: ApiTeamMember[];
  semester?: string;
  year?: string;
  courseCode?: string | null;
  completionDate?: string | null;
  impact?: string;
  grade?: string | null;
  feedback?: ApiProjectFeedback;
}

interface ApiProjectsResponse {
  projects?: ApiProject[] | null;
}

const buildUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export class ApiError extends Error {
  status: number;
  info?: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export const fetchProjects = async (token: string): Promise<ApiProject[]> => {
  const response = await fetch(buildUrl("/projects"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let body: ApiProjectsResponse | ApiErrorResponse | undefined;

  try {
    body = (await response.json()) as typeof body;
  } catch (_error) {
    body = undefined;
  }

  if (!response.ok) {
    const message =
      body && "error" in body && typeof body.error === "string"
        ? body.error
        : "Failed to fetch projects.";
    throw new ApiError(message, response.status, body);
  }

  if (!body || !("projects" in body)) {
    return [];
  }

  return (body.projects ?? []).filter((project): project is ApiProject => Boolean(project));
};
