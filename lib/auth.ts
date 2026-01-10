/**
 * Utilitários de autenticação para uso no cliente
 */

/**
 * Obtém o token de autenticação do localStorage
 */
export function getAuthTokenFromClient(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

/**
 * Define o token de autenticação no localStorage e cookie
 */
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
    // Salva também em cookie para o middleware poder verificar
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 dias
  }
}

/**
 * Remove o token de autenticação do localStorage e cookie
 */
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    // Remove também o cookie
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
  }
}

