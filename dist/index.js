import "@logseq/libs";
async function moveBlockToPage(blockUuid, targetPageName) {
    try {
        const block = await logseq.Editor.getBlock(blockUuid);
        if (!block) {
            logseq.UI.showMsg("Block not found", "error");
            return;
        }
        // Get or create the target page
        let targetPage = await logseq.Editor.getPage(targetPageName);
        if (!targetPage) {
            targetPage = await logseq.Editor.createPage(targetPageName);
        }
        if (!targetPage) {
            logseq.UI.showMsg("Failed to get or create target page", "error");
            return;
        }
        // Move the block to the target page
        await logseq.Editor.moveBlock(blockUuid, targetPage.uuid, {
            before: false,
            children: true,
        });
        logseq.UI.showMsg(`Moved block to "${targetPageName}"`, "success");
    }
    catch (error) {
        console.error("Error moving block:", error);
        logseq.UI.showMsg("Failed to move block", "error");
    }
}
async function moveBlockToJournalDate(blockUuid, date) {
    try {
        const block = await logseq.Editor.getBlock(blockUuid);
        if (!block) {
            logseq.UI.showMsg("Block not found", "error");
            return;
        }
        // Create journal page for the date
        const journalPage = await logseq.Editor.createPage(date.toISOString().split("T")[0], {}, { journal: true });
        if (!journalPage) {
            logseq.UI.showMsg("Failed to create journal page", "error");
            return;
        }
        // Move the block to the journal page
        await logseq.Editor.moveBlock(blockUuid, journalPage.uuid, {
            before: false,
            children: true,
        });
        const dateStr = date.toLocaleDateString();
        logseq.UI.showMsg(`Moved block to ${dateStr}`, "success");
    }
    catch (error) {
        console.error("Error moving block to journal:", error);
        logseq.UI.showMsg("Failed to move block", "error");
    }
}
async function searchPages(query) {
    try {
        const allPages = (await logseq.Editor.getAllPages());
        if (!query)
            return allPages.slice(0, 20);
        const lowerQuery = query.toLowerCase();
        return allPages
            .filter((page) => page.name.toLowerCase().includes(lowerQuery))
            .slice(0, 20);
    }
    catch (error) {
        console.error("Error searching pages:", error);
        return [];
    }
}
async function showPageSearchDialog(blockUuid) {
    const html = `
    <div style="padding: 20px; min-width: 400px;">
      <h3 style="margin-top: 0;">Move To Page</h3>
      <input
        type="text"
        id="page-search-input"
        placeholder="Search or create page..."
        style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;"
        autofocus
      />
      <div id="page-results" style="margin-top: 10px; max-height: 300px; overflow-y: auto;"></div>
      <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button id="cancel-btn" style="padding: 8px 16px; cursor: pointer;">Cancel</button>
      </div>
    </div>
  `;
    const key = logseq.UI.showUI({
        key: "move-to-page-dialog",
        template: html,
        attrs: {
            class: "move-to-dialog",
        },
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--ls-primary-background-color)",
            border: "1px solid var(--ls-border-color)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: "1000",
        },
    });
    // Wait for DOM to be ready
    setTimeout(async () => {
        const input = parent.document.getElementById("page-search-input");
        const resultsDiv = parent.document.getElementById("page-results");
        const cancelBtn = parent.document.getElementById("cancel-btn");
        if (!input || !resultsDiv || !cancelBtn)
            return;
        async function updateResults(query) {
            const pages = await searchPages(query);
            if (!resultsDiv)
                return;
            resultsDiv.innerHTML = "";
            if (query && !pages.some((p) => p.name.toLowerCase() === query.toLowerCase())) {
                const createDiv = document.createElement("div");
                createDiv.innerHTML = `
          <div style="padding: 10px; cursor: pointer; border-bottom: 1px solid var(--ls-border-color); background: var(--ls-secondary-background-color);">
            <strong>Create new page: "${query}"</strong>
          </div>
        `;
                createDiv.onclick = async () => {
                    await moveBlockToPage(blockUuid, query);
                    logseq.UI.closeUI(key);
                };
                if (resultsDiv)
                    resultsDiv.appendChild(createDiv);
            }
            pages.forEach((page) => {
                const pageDiv = document.createElement("div");
                pageDiv.innerHTML = `
          <div style="padding: 10px; cursor: pointer; border-bottom: 1px solid var(--ls-border-color);">
            ${page.name}${page["journal?"] ? " 📅" : ""}
          </div>
        `;
                pageDiv.onclick = async () => {
                    await moveBlockToPage(blockUuid, page.name);
                    logseq.UI.closeUI(key);
                };
                if (resultsDiv)
                    resultsDiv.appendChild(pageDiv);
            });
        }
        input.addEventListener("input", (e) => {
            updateResults(e.target.value);
        });
        cancelBtn.onclick = () => {
            logseq.UI.closeUI(key);
        };
        // Initial load
        await updateResults("");
        input.focus();
    }, 100);
}
async function showDatePickerDialog(blockUuid) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const html = `
    <div style="padding: 20px; min-width: 350px;">
      <h3 style="margin-top: 0;">Move To Date</h3>
      <div style="margin-bottom: 15px;">
        <input
          type="date"
          id="date-picker-input"
          style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;"
        />
      </div>
      <div style="display: flex; gap: 10px;">
        <button id="move-date-btn" style="padding: 8px 16px; cursor: pointer; flex: 1;">Move</button>
        <button id="cancel-date-btn" style="padding: 8px 16px; cursor: pointer;">Cancel</button>
      </div>
    </div>
  `;
    const key = logseq.UI.showUI({
        key: "move-to-date-dialog",
        template: html,
        attrs: {
            class: "move-to-date-dialog",
        },
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--ls-primary-background-color)",
            border: "1px solid var(--ls-border-color)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: "1000",
        },
    });
    setTimeout(() => {
        const dateInput = parent.document.getElementById("date-picker-input");
        const moveBtn = parent.document.getElementById("move-date-btn");
        const cancelBtn = parent.document.getElementById("cancel-date-btn");
        if (!dateInput || !moveBtn || !cancelBtn)
            return;
        // Set default to today
        dateInput.value = today.toISOString().split("T")[0];
        moveBtn.onclick = async () => {
            const selectedDate = new Date(dateInput.value + "T00:00:00");
            await moveBlockToJournalDate(blockUuid, selectedDate);
            logseq.UI.closeUI(key);
        };
        cancelBtn.onclick = () => {
            logseq.UI.closeUI(key);
        };
        dateInput.focus();
    }, 100);
}
function main() {
    console.log("Move Command plugin loaded");
    // Register slash command: Move To
    logseq.Editor.registerSlashCommand("Move To", async (e) => {
        const blockUuid = e.uuid;
        await showPageSearchDialog(blockUuid);
    });
    // Register slash command: Move To Date
    logseq.Editor.registerSlashCommand("Move To Date", async (e) => {
        const blockUuid = e.uuid;
        await showDatePickerDialog(blockUuid);
    });
    // Register slash command: Move to Today
    logseq.Editor.registerSlashCommand("Move to Today", async (e) => {
        const blockUuid = e.uuid;
        const today = new Date();
        await moveBlockToJournalDate(blockUuid, today);
    });
    // Register slash command: Move to Tomorrow
    logseq.Editor.registerSlashCommand("Move to Tomorrow", async (e) => {
        const blockUuid = e.uuid;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await moveBlockToJournalDate(blockUuid, tomorrow);
    });
}
logseq.ready(main).catch(console.error);
//# sourceMappingURL=index.js.map