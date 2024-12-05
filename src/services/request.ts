import { AxiosRequestConfig } from "axios";
import api from "./api";

export const sendRequest = async <Data>(
  config: AxiosRequestConfig
): Promise<Result<Data>> => {
  try {
    const response = await api.request<Data>(config);
    return { type: "success", value: response.data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    return { type: "error", error: err };
  }
};

export const createRequestConfig =
  <Payload = unknown>(baseConfig: AxiosRequestConfig<Payload>) =>
  (payload?: Payload): AxiosRequestConfig<Payload> => ({
    ...baseConfig,
    data: payload,
  });
