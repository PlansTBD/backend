import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("❌ Variabili d'ambiente Supabase mancanti");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const supabaseService = {
  /**
   * Ritorna gli eventi filtrati per città e intervallo date
   */
  async getEvents(city, { from, to }) {
    try {
    const { data: cityData, error: cityError } = await supabase
    .from("cities")
    .select("id, name")
    .ilike("name", `%${city}%`)
    .limit(1)
    .maybeSingle();

    console.log(cityData.id)

    if (cityError) console.warn("[Supabase] cityError:", cityError.message);
    if (!cityData) {
    console.warn(`[Supabase] Nessuna città trovata per: "${city}"`);
    return [];
    }

      let query = supabase
        .from("events")
        .select("*")



      const { data, error } = await query;
      if (error) throw error;

      //console.log(data)

      return data.map(ev => ({
        id: ev.id,
        title: ev.title,
        date: ev.start_at,
        venue: ev.venue_name,
        price: ev.price_min ? `${ev.price_min} ${ev.currency || ""}` : "N/A",
        url: ev.url,
        image: ev.image_url,
        source: ev.source,
        category: ev.category,
        city
      }));
    } catch (err) {
      console.error("[supabaseService.getEvents]", err);
      return [];
    }
  }
};
