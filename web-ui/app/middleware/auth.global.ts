export default defineNuxtRouteMiddleware((to) => {
  const storage: LocalStorage = useLocalStorage();

  if (to.path === "/list-gifts") {
    const token = storage.get("uniStudentsToken");
    if (!token) {
      return navigateTo("/sign-in");
    }
  }

  if (to.path === "/") {
    const token = storage.get("uniStudentsToken");
    if (!token) {
      return navigateTo("/sign-in");
    } else {
      return navigateTo("/list-gifts");
    }
  }
});
