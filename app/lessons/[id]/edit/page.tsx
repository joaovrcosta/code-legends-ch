"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLessonBySlug, updateLesson, type UpdateLessonData } from "@/actions/lesson";
import { getAuthTokenFromClient } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState<UpdateLessonData>({
    title: "",
    description: "",
    type: "video",
    slug: "",
    url: "",
    isFree: false,
    video_url: "",
    video_duration: "",
    locked: false,
    order: 0,
  });

  // Gera slug automaticamente quando o título mudar
  useEffect(() => {
    if (formData.title && !slugManuallyEdited) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title ?? ""),
      }));
    }
  }, [formData.title, slugManuallyEdited]);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoadingLesson(true);
      const token = getAuthTokenFromClient();
      if (!token) {
        alert("Token de autenticação não encontrado");
        return;
      }
      // Nota: A API usa slug para buscar, mas aqui estamos usando ID
      const lesson = await getLessonBySlug(lessonId, token);
      if (!lesson) {
        alert("Aula não encontrada");
        return;
      }
      setFormData({
        title: lesson.title,
        description: lesson.description,
        type: lesson.type,
        slug: lesson.slug,
        url: lesson.url || "",
        isFree: lesson.isFree,
        video_url: lesson.video_url || "",
        video_duration: lesson.video_duration || "",
        locked: lesson.locked,
        order: lesson.order || 0,
      });
      // Marca o slug como editado manualmente para não sobrescrever ao carregar
      setSlugManuallyEdited(true);
    } catch (error) {
      console.error("Erro ao carregar aula:", error);
      alert("Erro ao carregar aula");
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getAuthTokenFromClient();
      if (!token) {
        alert("Token de autenticação não encontrado");
        return;
      }
      await updateLesson(lessonId, formData, token);
      router.push("/lessons");
    } catch (error: any) {
      console.error("Erro ao atualizar aula:", error);
      alert(error.message || "Erro ao atualizar aula");
    } finally {
      setLoading(false);
    }
  };

  if (loadingLesson) {
    return (
      <MainLayout>
        <div className="text-center py-8">Carregando...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/lessons">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Aula</h1>
            <p className="text-gray-600 mt-2">Atualize as informações da aula</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Aula</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData({ ...formData, slug: e.target.value });
                        setSlugManuallyEdited(true);
                      }}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newSlug = generateSlug(formData.title || "");
                        setFormData({ ...formData, slug: newSlug });
                        setSlugManuallyEdited(true);
                      }}
                    >
                      Gerar Slug
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="video">Vídeo</option>
                    <option value="text">Texto</option>
                    <option value="quiz">Quiz</option>
                    <option value="task">Tarefa</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_url">URL do Vídeo</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) =>
                      setFormData({ ...formData, video_url: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_duration">Duração do Vídeo</Label>
                  <Input
                    id="video_duration"
                    value={formData.video_duration}
                    onChange={(e) =>
                      setFormData({ ...formData, video_duration: e.target.value })
                    }
                    placeholder="00:00:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) =>
                      setFormData({ ...formData, isFree: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span>Aula Gratuita</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.locked}
                    onChange={(e) =>
                      setFormData({ ...formData, locked: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span>Bloqueada</span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <Link href="/lessons">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

