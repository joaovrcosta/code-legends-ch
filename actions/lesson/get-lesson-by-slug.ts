"use server";

import type { Lesson } from "./list-lessons";

export interface LessonResponse {
  lesson: Lesson;
}

/**
 * Busca uma aula pelo slug
 */
export async function getLessonBySlug(slug: string, token: string): Promise<Lesson | null> {
  if (!slug) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Erro ao buscar aula");
    }

    const data: LessonResponse = await response.json();
    return data.lesson;
  } catch (error) {
    console.error("Erro ao buscar aula por slug:", error);
    return null;
  }
}

