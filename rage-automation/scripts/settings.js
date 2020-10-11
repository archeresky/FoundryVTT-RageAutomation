Hooks.once("init", () => {
    game.settings.register("rage-automation", "rage-icon-path", {
        name: "Rage Condition Icon Path",
        hint: "Provide path for image used as rage condition token marker.",
        scope: "world",
        config: "true",
        type: String,
        default: "images/Status%20Markers/35_Rage.png"
    });
});
