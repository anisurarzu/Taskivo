/**
 * Auth service scaffold — no backend calls yet.
 */
export const authService = {
  async login(_email: string, _password: string) {
    return { success: true as const };
  },
  async register(_name: string, _email: string, _password: string) {
    return { success: true as const };
  },
  async forgotPassword(_email: string) {
    return { success: true as const };
  },
  async logout() {
    return { success: true as const };
  },
};
