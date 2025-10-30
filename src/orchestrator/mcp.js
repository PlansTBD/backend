import { supabaseService } from "../services/supabase.js";
import dayjs from "dayjs";

/**
 * Recupera eventi da Supabase filtrati per città e periodo.
 * Supporta "oggi" o "settimana" nel query.
 */
export async function mcpOrchestrator(query, city = "New York") {
  try {
    const now = dayjs();

    // 🔹 Calcola range temporale
    let from, to;
    const q = query.toLowerCase();

    if (q.includes("oggi")) {
      from = now.startOf("day").toISOString();
      to = now.endOf("day").toISOString();
    } else if (q.includes("settimana")) {
      from = now.startOf("week").toISOString();
      to = now.endOf("week").toISOString();
    }

    // 🔹 Prendi gli eventi da Supabase
    const events = await supabaseService.getEvents(city, { from, to });
    console.log(events.length)
    return {
      query,
      city,
      count: events.length,
      items: events,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[mcpOrchestrator] error:", err);
    return {
      query,
      city,
      items: [],
      error: err.message,
    };
  }
}
