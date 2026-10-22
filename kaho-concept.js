(() => {
  const screens = {
    reading: document.querySelector("#screen-reading"),
    ai: document.querySelector("#screen-ai"),
    notes: document.querySelector("#screen-notes"),
  };
  const topLinks = document.querySelectorAll(".top-link");
  const toast = document.querySelector("#toast");
  let toastTimer;
  let currentNote = "xeliport";
  let currentFilter = "all";
  let savedExplanation = false;

  const noteDetails = {
    xeliport: {
      sourceId: "selected-passage",
      title: "Layered signals, actionable metrics",
      quote: "“Pioneered a live logistics control tower prototype applying layered telemetry signals for actionable metrics.”",
      passage: "Pioneered a live logistics control tower prototype applying layered telemetry signals for actionable metrics.",
      annotation: "Keep this framed as a prototype. The strongest detail is how the design connects layered signals with actionable metrics.",
      kind: "HIGHLIGHT",
      page: "Selected projects · Page 1",
    },
    responsive: {
      sourceId: "responsive-passage",
      title: "Responsive UI details",
      quote: "“Created responsive layouts with high contrast and dynamic hover states.”",
      passage: "Created responsive layouts with high contrast and dynamic hover states.",
      annotation: "A concise summary of the interface work: responsive behavior, high-contrast layouts, and dynamic hover states.",
      kind: "NOTE",
      page: "Selected projects · Page 1",
    },
    marketing: {
      sourceId: "marketing-passage",
      title: "Campaign analytics",
      quote: "“Applied audience segmentation and SEO practices, executed targeted Mailchimp campaigns, and tracked conversion metrics.”",
      passage: "Applied audience segmentation and SEO practices, executed targeted Mailchimp campaigns, and tracked conversion metrics.",
      annotation: "Connect the campaign work to the tools used: Wix, Mailchimp, Blogger, and campaign analytics.",
      kind: "HIGHLIGHT",
      page: "Selected projects · Page 1",
    },
    whatsapp: {
      sourceId: "whatsapp-passage",
      title: "Smart Media Vault proposal",
      quote: "“proposed a Smart Media Vault to categorize and pin important files.”",
      passage: "proposed a Smart Media Vault to categorize and pin important files.",
      annotation: "This concept responds to the resume's identified friction: important documents getting buried in active chats.",
      kind: "NOTE",
      page: "Selected projects · Page 1",
    },
    explanation: {
      sourceId: "selected-passage",
      title: "Telemetry signals in one view",
      quote: "“A dashboard concept that brings logistics signals into one view, so people can use those signals to make decisions.”",
      passage: "A dashboard concept that brings logistics signals into one view, so people can use those signals to make decisions.",
      annotation: "An illustrative explanation of the Xeliport prototype; the resume does not claim measured business impact.",
      kind: "NOTE",
      page: "Selected projects · Page 1",
    },
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function goToScreen(name) {
    if (!screens[name]) return;
    Object.entries(screens).forEach(([key, screen]) => {
      screen.classList.toggle("active", key === name);
    });
    topLinks.forEach((link) => {
      const active = (name === "reading" || name === "ai")
        ? link.dataset.screenLink === "reading"
        : link.dataset.screenLink === "notes";
      link.classList.toggle("active", active);
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    if (name === "reading") {
      requestAnimationFrame(() => {
        document.getElementById(noteDetails[currentNote].sourceId)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }

  function updateSelectedSource() {
    document.querySelectorAll(".source-passage").forEach((passage) => {
      passage.classList.toggle("selected-passage", passage.id === noteDetails[currentNote].sourceId);
    });
  }

  function createNoteItem(id) {
    const note = noteDetails[id];
    const item = document.createElement("button");
    item.className = "note-list-item";
    item.dataset.note = id;
    const color = note.kind === "NOTE" ? " pale" : "";
    const excerpt = note.passage.length > 38 ? `${note.passage.slice(0, 38)}…` : note.passage;
    item.innerHTML = `<span class="note-color${color}"></span><span class="note-item-content"><strong></strong><span></span><small>Selected projects · Page 1 <i>·</i> ${note.kind === "NOTE" ? "Note" : "Highlight"}</small></span><span class="note-item-arrow">›</span>`;
    item.querySelector("strong").textContent = note.title;
    item.querySelector(".note-item-content > span").textContent = `“${excerpt}”`;
    item.addEventListener("click", () => selectNote(id));
    return item;
  }

  function updateNoteCounts() {
    const items = [...document.querySelectorAll(".note-list-item")];
    const highlights = items.filter((item) => noteDetails[item.dataset.note]?.kind === "HIGHLIGHT").length;
    const notes = items.length - highlights;
    document.querySelectorAll(".filter-button").forEach((button) => {
      const count = button.dataset.filter === "HIGHLIGHT"
        ? highlights
        : button.dataset.filter === "NOTE"
          ? notes
          : items.length;
      button.querySelector("span").textContent = String(count);
    });
    document.querySelectorAll("[data-saved-count]").forEach((count) => {
      count.textContent = String(items.length);
    });
  }

  function updateNoteVisibility() {
    const query = search.value.trim().toLocaleLowerCase();
    document.querySelectorAll(".note-list-item").forEach((item) => {
      const matchesSearch = item.textContent.toLocaleLowerCase().includes(query);
      const note = noteDetails[item.dataset.note];
      const matchesFilter = currentFilter === "all" || note.kind === currentFilter;
      item.hidden = !matchesSearch || !matchesFilter;
    });
  }

  function isPassageHighlighted(sourceId) {
    return [...document.querySelectorAll(".note-list-item")].some((item) => {
      const note = noteDetails[item.dataset.note];
      return note?.kind === "HIGHLIGHT" && note.sourceId === sourceId;
    });
  }

  function selectNote(id) {
    const note = noteDetails[id];
    if (!note) return;
    currentNote = id;
    document.querySelectorAll(".note-list-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.note === id);
    });
    document.querySelector("#detail-title").textContent = note.title;
    document.querySelector("#detail-quote").textContent = note.quote;
    document.querySelector("#annotation-body").textContent = note.annotation;
    const label = document.querySelector(".detail-label");
    label.replaceChildren(
      Object.assign(document.createElement("span"), { className: "detail-label-dot" }),
      document.createTextNode(` ${note.kind} `),
      Object.assign(document.createElement("span"), { className: "detail-divider", textContent: "·" }),
      document.createTextNode(" SELECTED PROJECTS"),
    );
    document.querySelector("#detail-reference").textContent = note.page;
    updateSelectedSource();
    const highlightButton = document.querySelector("#highlight-action");
    const hasHighlight = isPassageHighlighted(note.sourceId);
    highlightButton.classList.toggle("is-active", hasHighlight);
    highlightButton.setAttribute("aria-pressed", String(hasHighlight));
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-screen-link]");
    if (link) {
      goToScreen(link.dataset.screenLink);
    }
  });

  document.querySelector("#highlight-action").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const list = document.querySelector(".note-list");
    const sourceId = noteDetails[currentNote].sourceId;
    let existing = [...list.querySelectorAll(".note-list-item")].find((item) => {
      const note = noteDetails[item.dataset.note];
      return note?.kind === "HIGHLIGHT" && note.sourceId === sourceId;
    });
    if (existing) {
      existing.remove();
      if (currentNote === existing.dataset.note) {
        const nextNote = list.querySelector(".note-list-item:not([hidden])") || list.querySelector(".note-list-item");
        if (nextNote) {
          selectNote(nextNote.dataset.note);
        }
      }
    } else {
      const highlightId = `highlight-${sourceId}`;
      if (!noteDetails[highlightId]) {
        const sourceNote = noteDetails[currentNote];
        noteDetails[highlightId] = {
          ...sourceNote,
          title: `${sourceNote.title} · Highlight`,
          kind: "HIGHLIGHT",
          annotation: "Highlighted passage.",
        };
      }
      existing = createNoteItem(highlightId);
      list.prepend(existing);
      selectNote(highlightId);
    }
    const highlighted = isPassageHighlighted(sourceId);
    const currentPassageHighlighted = isPassageHighlighted(noteDetails[currentNote].sourceId);
    button.classList.toggle("is-active", currentPassageHighlighted);
    button.setAttribute("aria-pressed", String(currentPassageHighlighted));
    updateNoteCounts();
    updateNoteVisibility();
    showToast(highlighted ? "Passage added to highlights" : "Highlight removed");
  });

  document.querySelectorAll("[data-font]").forEach((button) => {
    button.addEventListener("click", () => {
      const copy = document.querySelector("#article-copy");
      const current = Number.parseFloat(getComputedStyle(copy).fontSize);
      const next = button.dataset.font === "increase" ? Math.min(current + 1, 18) : Math.max(current - 1, 12);
      copy.style.fontSize = `${next}px`;
    });
  });

  document.querySelector(".spacing-button").addEventListener("click", (event) => {
    const copy = document.querySelector("#article-copy");
    const spacious = copy.dataset.spacing !== "spacious";
    copy.dataset.spacing = spacious ? "spacious" : "comfortable";
    copy.style.lineHeight = spacious ? "2" : "";
    event.currentTarget.querySelector("span").textContent = spacious ? "Spacious" : "Comfortable";
  });

  document.querySelectorAll(".note-list-item").forEach((item) => {
    item.addEventListener("click", () => selectNote(item.dataset.note));
  });

  document.querySelectorAll(".toc [data-section]").forEach((item) => {
    item.addEventListener("click", () => {
      const section = document.getElementById(item.dataset.section);
      if (!section) return;
      document.querySelectorAll(".toc [data-section]").forEach((entry) => entry.classList.remove("active"));
      item.classList.add("active");
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach((filter) => filter.classList.toggle("active", filter === button));
      updateNoteVisibility();
    });
  });

  const search = document.querySelector(".notes-search input");
  search.addEventListener("input", updateNoteVisibility);

  document.querySelector(".search-trigger").addEventListener("click", () => {
    goToScreen("notes");
    search.focus();
  });

  document.querySelector("#edit-note").addEventListener("click", (event) => {
    const content = document.querySelector("#annotation-body");
    const editing = content.isContentEditable;
    content.contentEditable = String(!editing);
    content.classList.toggle("editing", !editing);
    event.currentTarget.innerHTML = editing ? "<span>✓</span> Save note" : "<span>✎</span> Edit note";
    if (!editing) {
      content.focus();
      showToast("Edit your note, then save when you're done");
    } else {
      noteDetails[currentNote].annotation = content.textContent.trim();
      showToast("Note saved");
    }
  });

  document.querySelector("#save-explanation").addEventListener("click", (event) => {
    savedExplanation = !savedExplanation;
    event.currentTarget.classList.toggle("is-saved", savedExplanation);
    event.currentTarget.innerHTML = savedExplanation ? "<span>✓</span> Saved to notes" : "<span>＋</span> Save explanation as note";
    document.querySelector("#saved-feedback").classList.toggle("show", savedExplanation);
    const list = document.querySelector(".note-list");
    const existing = list.querySelector('[data-note="explanation"]');
    if (savedExplanation && !existing) {
      list.prepend(createNoteItem("explanation"));
      updateNoteCounts();
      updateNoteVisibility();
    } else if (!savedExplanation && existing) {
      existing.remove();
      updateNoteCounts();
      updateNoteVisibility();
    }
    showToast(savedExplanation ? "Example explanation saved to your notes" : "Saved note removed");
  });

  document.querySelectorAll(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const input = document.querySelector("#question-input");
      input.value = chip.textContent;
      input.focus();
    });
  });

  document.querySelector("#question-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#question-input");
    if (!input.value.trim()) {
      input.focus();
      return;
    }
    showToast("This concept preview doesn't connect to an AI service yet.");
    input.value = "";
  });

  document.querySelector("#copy-quote").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(noteDetails[currentNote].passage);
      showToast("Passage copied");
    } catch {
      showToast("Clipboard access is unavailable in this preview.");
    }
  });

  document.querySelectorAll(".page-control button").forEach((button) => {
    button.addEventListener("click", () => showToast("Page navigation is illustrative in this concept."));
  });
})();
