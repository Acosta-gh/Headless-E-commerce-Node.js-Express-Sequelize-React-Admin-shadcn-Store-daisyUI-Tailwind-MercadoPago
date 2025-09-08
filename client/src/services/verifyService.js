const API_URL = `${import.meta.env.VITE_API_URL}/usuario`;

export async function verificarEmail(token) {
  try {
    const response = await fetch(
      `${API_URL}/verify?token=${encodeURIComponent(token)}`
    );
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Error verificando token.");
    }
    return await response.json();
  } catch (error) {
    console.error("[verificarEmail] error:", error);
    throw error;
  }
}
