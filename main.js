
function getActorRelationships(actor) {
    return actor.getFlag("wod5e", "relationships") ?? [];
}

function save(actor, rels) {
    return actor.setFlag("wod5e", "relationships", rels);
}

Hooks.on("renderActorSheet", (app, html, data) => {

    if (!app.actor) return;
    if (app.actor.type !== "vampire") return;

    const tabButton = `<a class="item" data-tab="relationships">Relationships</a>`;

    const tabContent = `
    <div class="tab relationships" data-tab="relationships">
        <div class="wod-rel-header">
            <button class="rel-add">+ Add Relationship</button>
        </div>
        <div class="rel-list">
            ${(getActorRelationships(app.actor)).map(r => `
                <div class="rel-card" data-id="${r.id}">
                    <img src="${r.img}" />
                    <strong>${r.name}</strong>
                    <span>${r.type}</span>
                    <button class="rel-delete">X</button>
                </div>
            `).join("")}
        </div>
    </div>`;

    html.find(".sheet-tabs").append(tabButton);
    html.find(".sheet-body").append(tabContent);

    html.find(".rel-add").click(async () => {
        const rels = getActorRelationships(app.actor);
        rels.push({
            id: foundry.utils.randomID(),
            name: "New Relationship",
            type: "ally",
            img: "icons/svg/mystery-man.svg",
            relationship: 0
        });
        await save(app.actor, rels);
        app.render();
    });

    html.find(".rel-delete").click(async (ev) => {
        const id = ev.currentTarget.closest(".rel-card").dataset.id;
        let rels = getActorRelationships(app.actor);
        rels = rels.filter(r => r.id !== id);
        await save(app.actor, rels);
        app.render();
    });

});
