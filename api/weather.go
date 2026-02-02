package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// 1. Grab city from URL (e.g., /api/weather?city=Barishal)
	city := r.URL.Query().Get("city")
	if city == "" {
		city = "Dhaka" // Default
	}

	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	// 2. Units=metric gives us Celsius automatically
	apiURL := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric", city, apiKey)

	resp, err := http.Get(apiURL)
	if err != nil {
		http.Error(w, "Failed to reach weather service", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var data map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		http.Error(w, "Error parsing weather data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}