/**
 * Logseq DB Move Command Plugin
 * Move blocks to other pages or journal dates via slash commands
 */

async function moveBlockToPage(blockUuid, targetPageName) {
  try {
    const block = await logseq.Editor.getBlock(blockUuid);
    if (!block) {
      logseq.UI.showMsg("Block not found", "error");
      return;
    }

    let targetPage = await logseq.Editor.getPage(targetPageName);
    if (!targetPage) {
      targetPage = await logseq.Editor.createPage(targetPageName);
    }

    if (!targetPage) {
      logseq.UI.showMsg("Failed to get or create target page", "error");
      return;
    }

    await logseq.Editor.moveBlock(blockUuid, targetPage.uuid, {
      before: false,
      children: true,
    });

    logseq.UI.showMsg(`Moved block to "${targetPageName}"`, "success");
  } catch (error) {
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

    const journalPage = await logseq.Editor.createPage(
      date.toISOString().split("T")[0],
      {},
      { journal: true }
    );

    if (!journalPage) {
      logseq.UI.showMsg("Failed to create journal page", "error");
      return;
    }

    await logseq.Editor.moveBlock(blockUuid, journalPage.uuid, {
      before: false,
      children: true,
    });

    const dateStr = date.toLocaleDateString();
    logseq.UI.showMsg(`Moved block to ${dateStr}`, "success");
  } catch (error) {
    console.error("Error moving block to journal:", error);
    logseq.UI.showMsg("Failed to move block", "error");
  }
}

async function searchPages(query) {
  try {
    const allPages = await logseq.Editor.getAllPages();
    if (!query) return allPages.slice(0, 20);

    const lowerQuery = query.toLowerCase();
    return allPages
      .filter((page) => page.name.toLowerCase().includes(lowerQuery))
      .slice(0, 20);
  } catch (error) {
    console.error("Error searching pages:", error);
    return [];
  }
}

function main() {
  console.log("Move Command plugin loaded");

  logseq.Editor.registerSlashCommand("Move To", async (e) => {
    logseq.UI.showMsg("Move To command triggered - feature coming soon", "info");
  });

  logseq.Editor.registerSlashCommand("Move To Date", async (e) => {
    logseq.UI.showMsg("Move To Date command triggered - feature coming soon", "info");
  });

  logseq.Editor.registerSlashCommand("Move to Today", async (e) => {
    const today = new Date();
    moveBlockToJournalDate(e.uuid, today).catch(console.error);
  });

  logseq.Editor.registerSlashCommand("Move to Tomorrow", async (e) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    moveBlockToJournalDate(e.uuid, tomorrow).catch(console.error);
  });
}

logseq.ready(main).catch(console.error);
