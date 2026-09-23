"use client";

import "driver.js/dist/driver.css";
import { useOnboarding } from "./useOnboarding";

export function OnboardingTour() {
  useOnboarding();
  return null;
}
