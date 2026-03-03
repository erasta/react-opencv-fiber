import { createContext } from "react";
import type { OnMatCallback } from "../types";

export const MatContext = createContext<OnMatCallback | null>(null);
