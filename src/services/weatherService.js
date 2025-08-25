import axios from "axios";

const getWeatherData = async()=>{
    const res = await axios.get("https://api.openweathermap.org/data/2.5/forecast?q=panwila&appid=9bd8978b84b4e89e3e93a8e8a88b1458&units=metric");
    return res;
}

export {getWeatherData}