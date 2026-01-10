"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, type User } from "@/actions/user";
import { getAuthTokenFromClient } from "@/lib/auth";
import { Users as UsersIcon } from "lucide-react";

export default function UsersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      const token = getAuthTokenFromClient();
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await getCurrentUser(token);
      setUser(data);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-2">Gerenciamento de usuários</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuário Atual</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : user ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Função</p>
                  <p className="text-lg font-medium">{user.role}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Não foi possível carregar informações do usuário
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nota</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              A API atual não possui endpoint para listar todos os usuários. 
              Para implementar o gerenciamento completo de usuários, é necessário 
              adicionar endpoints na API para listar, atualizar e excluir usuários.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

