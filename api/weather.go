package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"io/ioutil"
)

// WeatherResponse defines the structure of data we want to send to the frontend
type WeatherResponse struct {
	City        string  `json:"city"`
	Temperature float64 `json:"temperature"`
	Condition   string  `json:"condition"`
	Humidity    int     `json:"humidity"`
}

// OpenWeatherMapResponse defines the structure of the incoming API data
type OpenWeatherMapResponse struct {
	Main struct {
		Temp     float64 `json:"temp"`
		Humidity int     `json:"humidity"`
	} `json:"main"`
	Weather []struct {
		Main string `json:"main"`
	} `json:"weather"`
	Name string `json:"name"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// 1. Get API Key from Environment Variable
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	if apiKey == "" {
		http.Error(w, "API Key missing", http.StatusInternalServerError)
		return
	}

	// 2. Fetch Data for Dhaka
	city := "Dhaka"
	url := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric", city, apiKey)
	
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch weather data", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// 3. Read and Parse the Response
	body, _ := ioutil.ReadAll(resp.Body)
	var weatherData OpenWeatherMapResponse
	if err := json.Unmarshal(body, &weatherData); err != nil {
		http.Error(w, "Failed to parse weather data", http.StatusInternalServerError)
		return
	}

	// 4. Extract Condition (Default to Sunny if missing)
	condition := "Clear"
	if len(weatherData.Weather) > 0 {
		condition = weatherData.Weather[0].Main
	}

	// 5. Create our Custom Response
	finalResponse := WeatherResponse{
		City:        weatherData.Name,
		Temperature: weatherData.Main.Temp,
		Condition:   condition,
		Humidity:    weatherData.Main.Humidity,
	}

	// 6. Send JSON back to Frontend
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(finalResponse)
}