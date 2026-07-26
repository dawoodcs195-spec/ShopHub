import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const VISITOR_ID_KEY = "diya_expressions_visitor_id";
const SESSION_TRACKED_KEY = "diya_expressions_session_tracked";

function getOrCreateVisitorId() {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (id) return id;

  // Prefer crypto.randomUUID if available
  id =
    (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
    `v_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  localStorage.setItem(VISITOR_ID_KEY, id);
  return id;
}

export default function useTrackVisit() {
  const location = useLocation();
  const hasSentRef = useRef(false);

  useEffect(() => {
    // Don’t track in dev
    if (import.meta.env.DEV) return;

    // Don’t count admin pages
    if (location.pathname.startsWith("/admin")) return;

    // Only once per tab session
    if (sessionStorage.getItem(SESSION_TRACKED_KEY)) return;
    if (hasSentRef.current) return;

    hasSentRef.current = true;
    sessionStorage.setItem(SESSION_TRACKED_KEY, "1");

    const visitorId = getOrCreateVisitorId();

    api.post("/analytics/visit", { visitorId }).catch(() => {
      // silent fail: analytics should never break UX
    });
  }, [location.pathname]);
}