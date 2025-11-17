// Global authentication middleware
export default defineNuxtRouteMiddleware((to) => {
  const storage: LocalStorage = useLocalStorage();

  // Protect the /list-gifts route
  if (to.path === "/list-gifts") {
    const token = storage.get("uniStudentsToken");
    if (!token) {
      return navigateTo("/sign-in");
    }
  }

  // Redirect from root based on authentication status
  if (to.path === "/") {
    const token = storage.get("uniStudentsToken");
    if (!token) {
      return navigateTo("/sign-in");
    } else {
      return navigateTo("/list-gifts");
    }
  }
});
