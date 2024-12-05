import { token } from "../constants/credentials";
import { createRequestConfig } from "./request";

const fetchAssets = createRequestConfig({
  url: "query/search",
  method: "POST",
  headers: { Authorization: `Basic ${token}` },
});

const createAsset = createRequestConfig({
  url: "invoke/createAsset",
  method: "POST",
  headers: { Authorization: `Basic ${token}` },
});

const updateAsset = createRequestConfig({
  url: "invoke/updateAsset",
  method: "PUT",
  headers: { Authorization: `Basic ${token}` },
});

const deleteAsset = createRequestConfig({
  url: "invoke/deleteAsset",
  method: "DELETE",
  headers: { Authorization: `Basic ${token}` },
});

export { fetchAssets, createAsset, updateAsset, deleteAsset };
