import { activateRage, deactivateRage } from "./rage-automation.js";

Hooks.on("createChatMessage", (message, params, actorId) => {
	activateRage(message);
});

Hooks.on("updateActor", actor => {
	deactivateRage(actor);
});
