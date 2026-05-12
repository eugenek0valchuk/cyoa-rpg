import { useCallback, useRef } from "react";
import type { Character, Choice, Scene } from "@/lib/types/game";

const DEFAULT_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSceneFromAPI(
	currentScene: Scene,
	choice: Choice,
	character: Character,
	signal?: AbortSignal,
): Promise<Scene> {
	let lastError: unknown;
	for (let i = 0; i <= DEFAULT_RETRIES; i++) {
		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentScene, choice, character }),
				signal,
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const data = await response.json();
			if (!data.scene) throw new Error("No scene in response");
			return data.scene as Scene;
		} catch (error) {
			lastError = error;
			if (i === DEFAULT_RETRIES || signal?.aborted) throw error;
			await delay(RETRY_DELAY_MS);
		}
	}
	throw lastError;
}

export function useSceneGenerator() {
	const abortControllerRef = useRef<AbortController | null>(null);
	const generateScene = useCallback(
		async (
			currentScene: Scene,
			choice: Choice,
			character: Character,
		): Promise<Scene> => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			const controller = new AbortController();
			abortControllerRef.current = controller;

			try {
				const scene = await fetchSceneFromAPI(
					currentScene,
					choice,
					character,
					controller.signal,
				);
				return scene;
			} finally {
				if (abortControllerRef.current === controller) {
					abortControllerRef.current = null;
				}
			}
		},
		[],
	);

	return { generateScene };
}
