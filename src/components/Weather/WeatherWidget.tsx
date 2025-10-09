import { useEffect, useMemo, useState } from "react";

type WeatherResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone: string;
  timezone_abbreviation?: string;
  elevation?: number;
  current_weather?: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  daily?: {
    time: string[];
    weathercode?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};

const DEFAULT_LOCATION = { latitude: 1.3521, longitude: 103.8198 }; // Singapore

function weatherCodeToText(code: number | undefined) {
  // Simplified mapping from Open-Meteo weathercode
  const map: Record<number, { text: string; emoji: string }> = {
    0: { text: "Clear sky", emoji: "☀️" },
    1: { text: "Mainly clear", emoji: "🌤️" },
    2: { text: "Partly cloudy", emoji: "⛅" },
    3: { text: "Overcast", emoji: "☁️" },
    45: { text: "Fog", emoji: "🌫️" },
    48: { text: "Depositing rime fog", emoji: "🌫️" },
    51: { text: "Light drizzle", emoji: "🌦️" },
    53: { text: "Moderate drizzle", emoji: "🌦️" },
    55: { text: "Dense drizzle", emoji: "🌧️" },
    56: { text: "Freezing drizzle", emoji: "🌧️" },
    57: { text: "Heavy freezing drizzle", emoji: "🌧️" },
    61: { text: "Light rain", emoji: "🌧️" },
    63: { text: "Moderate rain", emoji: "🌧️" },
    65: { text: "Heavy rain", emoji: "⛈️" },
    71: { text: "Light snow", emoji: "🌨️" },
    73: { text: "Moderate snow", emoji: "🌨️" },
    75: { text: "Heavy snow", emoji: "❄️" },
    80: { text: "Rain showers", emoji: "🌦️" },
    81: { text: "Moderate showers", emoji: "🌧️" },
    82: { text: "Violent showers", emoji: "⛈️" },
    95: { text: "Thunderstorm", emoji: "⛈️" },
    96: { text: "Thunderstorm with hail", emoji: "⛈️" },
    99: { text: "Severe thunderstorm with hail", emoji: "⛈️" },
  };
  return map[code ?? 0] ?? { text: "Unknown", emoji: "🌈" };
}

export default function WeatherWidget() {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Always show forecast by default; no expanded toggle required

  // Try geolocation first, fall back to DEFAULT_LOCATION
  useEffect(() => {
    let handled = false;
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      const t = setTimeout(() => {
        if (!handled) {
          handled = true;
          setCoords(DEFAULT_LOCATION);
        }
      }, 3000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (handled) return;
          handled = true;
          clearTimeout(t);
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          if (handled) return;
          handled = true;
          clearTimeout(t);
          setCoords(DEFAULT_LOCATION);
        },
        { maximumAge: 1000 * 60 * 10, timeout: 3000 },
      );
    } else {
      setCoords(DEFAULT_LOCATION);
    }
  }, []);

  // Fetch from Open-Meteo when coords available
  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    setError(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&timezone=auto&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=5`;

    let cancelled = false;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json() as Promise<WeatherResponse>;
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
      })
      .catch((e) => {
        console.error("Weather fetch error", e);
        if (!cancelled) setError("Unable to retrieve weather");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coords]);

  const current = data?.current_weather;

  const condition = useMemo(
    () => weatherCodeToText(current?.weathercode),
    [current],
  );

  // Local time display using timezone from API when available
  const localTime = useMemo(() => {
    if (!current) return null;
    try {
      const t = new Date(current.time);
      return t.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch {
      return current.time;
    }
  }, [current]);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-2">
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-blue-200" />
          <div className="text-sm text-blue-700">Loading weather...</div>
        </div>
      ) : error || !data || !current ? (
        <div className="text-sm text-red-600">Weather unavailable</div>
      ) : (
        <>
          <div className="text-2xl">{condition.emoji}</div>
          <div>
            <div className="text-lg font-semibold text-blue-700">
              {Math.round(current.temperature)}°C
            </div>
            <div className="text-xs text-gray-500">{condition.text}</div>
            <div className="text-xs text-gray-500">{localTime}</div>
            {/* Forecast is always shown below when available */}
          </div>
          {data.daily ? (
            <div className="ml-4 flex gap-2">
              {data.daily.time.map((d, i) => {
                const code = data.daily?.weathercode?.[i];
                const max = data.daily?.temperature_2m_max?.[i];
                const min = data.daily?.temperature_2m_min?.[i];
                const cd = weatherCodeToText(code);
                return (
                  <div key={d} className="flex flex-col items-center text-xs">
                    <div className="font-semibold">
                      {new Date(d).toLocaleDateString(undefined, {
                        weekday: "short",
                      })}
                    </div>
                    <div className="text-xl">{cd.emoji}</div>
                    <div className="text-xs text-gray-600">
                      {Math.round(max ?? 0)}° / {Math.round(min ?? 0)}°
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
