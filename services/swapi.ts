import axios from "axios";

export const fetchSwapiData = async (model: string) => {
    const response_swapi = await axios.get(`https://swapi.py4e.com/api/${model}/`);
    return response_swapi.data;
}