import axios from "axios";
import type { Email, SignInCreds, SignUpFormData } from "~/models/common";

export const useApi = () => {
  const config = useRuntimeConfig();
  const localstorage = useLocalStorage();

  const client = axios.create({
    baseURL: config.public.API_BASE_URL,
  });

  const signIn = (creds: SignInCreds) => {
    return client.post("/sign-in", creds);
  };

  const signUp = (formData: SignUpFormData) => {
    return client.post("/sign-up", formData);
  };

  const matchUser = (email: Email) => {
    return client.post("/match-user", {
      email,
    });
  };

  const updatePassword = (creds: SignInCreds, oneTimeToken: string) => {
    return client.post("update-password", creds, {
      headers: {
        Authorization: oneTimeToken,
      },
    });
  };

  const getGifts = (
    channels?: string,
    types?: string,
    brandTitles?: string,
    category?: string,
    sortBy: string = "NEW_IN"
  ) => {
    return client.get(
      `/gifts?channels=${channels}&types=${types}&brandTitles=${brandTitles}&category=${category}&sort=${sortBy}`,
      {
        headers: {
          Authorization: localstorage.get("uniStudentsToken"),
        },
      }
    );
  };

  const search = (input: string, sortBy: string = "NEW_IN") => {
    return client.get(`/gifts/search?input=${input}&sort=${sortBy}`, {
      headers: {
        Authorization: localstorage.get("uniStudentsToken"),
      },
    });
  };

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
