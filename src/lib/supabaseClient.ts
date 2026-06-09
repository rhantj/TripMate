/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { TravelPlan } from "../types";

// Configuration keys in localStorage
const URL_KEY = "tripmate_supabase_url";
const KEY_KEY = "tripmate_supabase_key";
const MODE_KEY = "tripmate_db_mode"; // "local" | "supabase"

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  active: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = localStorage.getItem(URL_KEY) || "";
  const anonKey = localStorage.getItem(KEY_KEY) || "";
  const active = localStorage.getItem(MODE_KEY) === "supabase" && !!url && !!anonKey;
  return { url, anonKey, active };
}

export function saveSupabaseConfig(url: string, anonKey: string, active: boolean) {
  if (url) localStorage.setItem(URL_KEY, url);
  else localStorage.removeItem(URL_KEY);

  if (anonKey) localStorage.setItem(KEY_KEY, anonKey);
  else localStorage.removeItem(KEY_KEY);

  localStorage.setItem(MODE_KEY, active ? "supabase" : "local");
}

let supabaseInstance: SupabaseClient | null = null;
let lastUrl = "";
let lastKey = "";

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  // Memoize client instance
  if (supabaseInstance && lastUrl === config.url && lastKey === config.anonKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(config.url, config.anonKey);
    lastUrl = config.url;
    lastKey = config.anonKey;
    return supabaseInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

// Map database column names (snake_case) to client properties (camelCase)
export function mapFromSupabase(row: any): TravelPlan {
  return {
    id: row.id,
    userId: row.user_id || row.userId,
    title: row.title,
    destination: row.destination,
    startDate: row.start_date || row.startDate,
    endDate: row.end_date || row.endDate,
    duration: row.duration,
    budget: row.budget,
    companion: row.companion,
    styles: Array.isArray(row.styles) ? row.styles : JSON.parse(row.styles || "[]"),
    mustVisitPlaces: row.must_visit_places || row.mustVisitPlaces || "",
    planContent: typeof row.plan_content === "string" ? JSON.parse(row.plan_content) : (row.plan_content || row.planContent || []),
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  };
}

export function mapToSupabase(plan: TravelPlan): any {
  return {
    id: plan.id,
    user_id: plan.userId,
    title: plan.title,
    destination: plan.destination,
    start_date: plan.startDate,
    end_date: plan.endDate,
    duration: plan.duration,
    budget: plan.budget,
    companion: plan.companion,
    styles: plan.styles,
    must_visit_places: plan.mustVisitPlaces,
    plan_content: plan.planContent,
    created_at: plan.createdAt,
    updated_at: plan.updatedAt,
  };
}
