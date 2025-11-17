import axios from "axios";
import type { Email, SignInCreds, SignUpFormData } from "~/models/common";

// Composable for API interactions
export const useApi = () => {
  // Access runtime config and local storage composable
  const config = useRuntimeConfig();
  const localstorage = useLocalStorage();

  // Create an Axios client with the base URL from runtime config
  const client = axios.create({
    baseURL: config.public.API_BASE_URL,
  });

  //// API methods ////
  // Sign in method
  const signIn = (creds: SignInCreds) => {
    return client.post("/sign-in", creds);
  };

  // Sign up method
  const signUp = (formData: SignUpFormData) => {
    return client.post("/sign-up", formData);
  };

  // Match user method
  const matchUser = (email: Email) => {
    return client.post("/match-user", {
      email,
    });
  };

  // Update password method
  const updatePassword = (creds: SignInCreds, oneTimeToken: string) => {
    return client.post("update-password", creds, {
      headers: {
        Authorization: oneTimeToken,
      },
    });
  };

  // Get gifts method with optional filters and pagination
  const getGifts = (
    channels?: string,
    types?: string,
    brandTitles?: string,
    category?: string,
    page: number = 1,
    sortBy: string = "NEW_IN"
  ) => {
    return client.get(
      `/gifts?channels=${channels}&types=${types}&brandTitles=${brandTitles}&category=${category}&page=${page}&sort=${sortBy}`,
      {
        headers: {
          Authorization: localstorage.get("uniStudentsToken"),
        },
      }
    );
  };

  // Search gifts method
  const search = (
    input: string,
    page: number = 1,
    sortBy: string = "NEW_IN"
  ) => {
    return client.get(
      `/gifts/search?input=${input}&page=${page}&sort=${sortBy}`,
      {
        headers: {
          Authorization: localstorage.get("uniStudentsToken"),
        },
      }
    );
  };

  // Claim gift method
  const claim = (usersEmail: string, giftId: string) => {
    return client.post(
      "/gifts/claim",
      {
        gift: {
          id: giftId,
        },
        user: {
          email: usersEmail,
        },
      },
      {
        headers: {
          Authorization: localstorage.get("uniStudentsToken"),
        },
      }
    );
  };

  // Get user method
  const getUser = (usersEmail: string) => {
    return client.get(`/user?email=${usersEmail}`, {
      headers: {
        Authorization: localstorage.get("uniStudentsToken"),
      },
    });
  };

  return {
    signIn,
    signUp,
    matchUser,
    updatePassword,
    getGifts,
    search,
    claim,
    getUser,
  };
};
