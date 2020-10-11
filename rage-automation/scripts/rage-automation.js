function isBarbarianClassItem(item, index, array) {
	return (item.type === "class" && item.name === "Barbarian");
}

function getBonusDamageFromBarbLevel(actor) {	
	const classItem = actor.data.items.filter(isBarbarianClassItem)
	if (!classItem || classItem.length === 0) { return; }
	const barbarianLevel = classItem[0].data.levels
	if(barbarianLevel > 15) {
		return 4;
	} else if(barbarianLevel > 8) {
		return 3;
	} else {
		return 2;
	}
}

export function activateRage(message) {
	const itemIdRegex = /data-item-id="(.*?)"/gm;
	const rageIcon = game.settings.get("rage-automation", "rage-icon-path");

	const messageData = message.data;
	const matchResults = itemIdRegex.exec(messageData.content)
	if(!matchResults) { return; }
	const itemId = matchResults.length > 1 ? matchResults[1] : null;
	const actorId = messageData.speaker.actor || null;
	const tokenId = messageData.speaker.token || null;
	if (!tokenId && !actorId) { return; }

	const actor = game.actors.get(actorId);
	const tokens = tokenId ? [canvas.tokens.get(tokenId)] : actor ? actor.getActiveTokens() : [];
	const barbToken = tokens.length > 0 ? tokens[0] : null;
	if (!barbToken) { return; }

	if (barbToken.data.effects.includes(rageIcon))  { return; }

	const item = barbToken.actor.getOwnedItem(itemId);
	if(item.data.name != "Rage") { return; }

	const bonusDamage = getBonusDamageFromBarbLevel(actor);
	if(!bonusDamage) { return; }

	barbToken.toggleEffect(rageIcon);
	actor.data.data.bonuses.mwak.damage += '+' + bonusDamage;
}

export function deactivateRage(actor) {
	const rageIcon = game.settings.get("rage-automation", "rage-icon-path");

	const actorData = actor.data;
	const actorId = actorData._id || null;
	const tokens = actor ? actor.getActiveTokens() : [];
	const barbToken = tokens.length > 0 ? tokens[0] : null;
	if (!barbToken) { return; }

	if (barbToken.data.effects.includes(rageIcon))  { return; }

	const bonusDamage = getBonusDamageFromBarbLevel(actor);
	actor.data.data.bonuses.mwak.damage = actor.data.data.bonuses.mwak.damage.replace("+" + bonusDamage, "")
}
