import { geminiService } from "../services/geminiService.js";
import { foursquareService } from "../services/foursquare.js";
import { yelpService } from "../services/yelp.js";
import { eventbriteService } from "../services/eventbrite.js";
import { supabase } from "../db/supabaseClient.js";

export async function mcpOrchestrator(query) {
  const interpretation = await geminiService.interpret(query);
  const types = interpretation.types || [];
  const mood = interpretation.mood || "";

  console.log(interpretation)

  const [fsResults, yelpResults, eventResults] = await Promise.all([
    foursquareService.search(types, mood),
    yelpService.search(types, mood),
    eventbriteService.search(types, mood),
  ]);

  const { data: internalResults } = await supabase
    .from("experiences")
    .select("*")
    .ilike("type", `%${types.join(",")}%`)
    .limit(10);

  const allResults = [
    ...(internalResults ?? []).map(r => ({
      id: `db-${r.id}`,
      title: r.title,
      type: r.type,
      description: r.desc,
      location: r.location,
      lat: r.lat,
      lng: r.lng,
      image: r.image
    })),
    ...fsResults,
    ...yelpResults,
    ...eventResults,
  ];

  return allResults;
}

