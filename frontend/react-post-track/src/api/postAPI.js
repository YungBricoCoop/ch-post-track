import axios from "axios";

import { URLS } from "../config/api";

const getEvents = (trackingNumber) => {
    return axios.get(URLS.POST,{ params: { action: "getEvents", trackingNumber} });
};


export { getEvents };