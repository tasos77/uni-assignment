import axios from "axios";
import type { Email, SignInCreds, SignUpFormData } from "~/models/common";

export const useApi = () => {
  const localstorage = useLocalStorage();

  const client = axios.create({
    baseURL: "http://localhost:3000/api/v1/",
  });

  const signIn = (creds: SignInCreds) => {
    console.log(creds);
    return client.post("/sign-in", creds);
  };

  const signUp = (formData: SignUpFormData) => {
    return client.post("/sign-up", formData);
  };

  const matchUser = (email: Email) => {
    return client.post("/match-user", email);
  };

  const updatePassword = (creds: SignInCreds) => {
    return client.post("update-password", creds, {
      headers: {
        Authorization: localstorage.get("uniStudentsToken"),
      },
    });
  };

  const getGifts = (
    channels?: string,
    types?: string,
    brandTitles?: string,
    category?: string
  ) => {
    return client.get(
      `/gifts?channels=${channels}&types=${types}&brandTitles=${brandTitles}&category=${category}`,
      {
        headers: {
          Authorization: localstorage.get("uniStudentsToken"),
        },
      }
    );
  };

  const search = (input: string) => {
    return client.get(`/gifts/search?input=${input}`, {
      headers: {
        Authorization: localstorage.get("uniStudentsToken"),
      },
    });
  };

  return { signIn, signUp, matchUser, updatePassword, getGifts, search };
};
