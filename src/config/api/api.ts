import axios, { Method } from "axios";
import baseURL from "./baseURL";

export class ApiService {
    private apiURL: any;
    constructor() {
        this.apiURL = baseURL.baseURLDev;
    }
    public RequestData = (
        HTTPMethod: Method,
        endpoint: string,
        data: any = "",
        payload: any = "",
        token: any = localStorage.getItem("@ProductionLine:token") || false,
        INSTANCE_KEY = import.meta.env.VITE_WHATSAPP_API_INSTANCE_KEY
    ) => {
        let url = `${this.apiURL}${endpoint}`;
        if (payload !== "") url = `${url}${payload}`;
        return new Promise((resolve, reject) =>
            axios({
                method: HTTPMethod,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    INSTANCE_KEY
                },
                url,
                data,
            })
                .then((response: any) => resolve(response.data))
                .catch((err: any) => reject(err))
        );
    };
}