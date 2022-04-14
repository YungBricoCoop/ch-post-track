import axios from "axios";
import * as qs from "qs";
import { URLS } from "../config/api";

const getParcels = () => {
  return axios.get(URLS.PARCEL, {
    params: { action: "getParcels" },
    withCredentials: true,
  });
};

const getEvents = (number) => {
  return axios.get(URLS.PARCEL, {
    params: { action: "getEvents", number },
    withCredentials: true,
  });
};

const addParcel = (name, number) => {
  return axios.post(
    URLS.PARCEL,
    qs.stringify({ action: "addParcel", name, number }),
    { withCredentials: true }
  );
};

const updateParcel = (PK_parcel, name, number) => {
  return axios.post(
    URLS.PARCEL,
    qs.stringify({ action: "updateParcel", PK_parcel, name, number }),
    { withCredentials: true }
  );
};

const removeParcel = (PK_parcel) => {
  return axios.post(
    URLS.PARCEL,
    qs.stringify({ action: "removeParcel", PK_parcel }),
    { withCredentials: true }
  );
};

export { getEvents, getParcels, addParcel, updateParcel, removeParcel };
