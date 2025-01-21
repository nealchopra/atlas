import { useState } from "react";
import useSWR from "swr";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const getAuthHeader = () => {
  const token = localStorage.getItem("sb-clctegxbrezqfxtkcdft-auth-token");
  if (!token) return null;
  
  try {
    const parsed = JSON.parse(token);
    return `Bearer ${parsed.access_token}`;
  } catch (e) {
    return null;
  }
};

const fetcher = async (url: string) => {
  const authHeader = getAuthHeader();
  if (!authHeader) throw new Error("No auth token");

  const res = await fetch(url, {
    headers: {
      Authorization: authHeader,
    },
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  
  return res.json();
};

export function useProjects() {
  const { data: projects, error, mutate } = useSWR<Project[]>("/api/projects", fetcher);

  const createProject = async (title: string, description?: string) => {
    const authHeader = getAuthHeader();
    if (!authHeader) throw new Error("No auth token");

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      throw new Error("Failed to create project");
    }

    const newProject = await res.json();
    mutate([...(projects || []), newProject]);
    return newProject;
  };

  const updateProject = async (id: string, title: string, description?: string) => {
    const authHeader = getAuthHeader();
    if (!authHeader) throw new Error("No auth token");

    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      throw new Error("Failed to update project");
    }

    const updatedProject = await res.json();
    mutate(
      projects?.map((p) => (p.id === id ? updatedProject : p)) || []
    );
    return updatedProject;
  };

  const deleteProject = async (id: string) => {
    const authHeader = getAuthHeader();
    if (!authHeader) throw new Error("No auth token");

    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete project");
    }

    mutate(projects?.filter((p) => p.id !== id) || []);
  };

  return {
    projects,
    isLoading: !error && !projects,
    isError: error,
    createProject,
    updateProject,
    deleteProject,
  };
} 