/**
 * ============================================================================
 * CloudTrace AI — Core Application Logic
 * Pure ES6 Vanilla JavaScript (Zero External Library Dependencies)
 * Handles: Live Execution Inspector, Playback Loop, Theme Engine, CLI Modal
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. SCENARIO DATA DEFINITIONS (Realistic AI Trace Workflows)
     -------------------------------------------------------------------------- */
  const SCENARIOS = {
    debate: {
      title: "Multi-Agent LLM Debate Workflow",
      status: "200 OK",
      totalLatency: "1,420 ms",
      totalTokens: "2,840 tokens",
      nodes: [
        {
          id: "node-01",
          name: "Agent_Architect",
          type: "LLM Completion (GPT-4o)",
          icon: "fa-solid fa-brain",
          latency: "410 ms",
          tokens: "850 tokens",
          cost: "$0.0042",
          status: "success",
          input: {
            role: "system",
            prompt: "Design a distributed caching architecture for low-latency Azure Static Web Apps.",
            temperature: 0.7
          },
          output: {
            proposed_solution: "Implement Redis Enterprise Cache with Azure CDN Edge invalidation rules.",
            confidence_score: 0.94
          }
        },
        {
          id: "node-02",
          name: "Agent_Critic",
          type: "Validation & Risk Check",
          icon: "fa-solid fa-shield-halved",
          latency: "380 ms",
          tokens: "620 tokens",
          cost: "$0.0031",
          status: "success",
          input: {
            target_solution: "Redis Enterprise Cache + Azure CDN",
            constraints: ["Max monthly budget: $150", "Must handle 10,000 req/sec"]
          },
          output: {
            critique: "Redis Enterprise exceeds target budget under burst traffic.",
            recommendation: "Switch to Azure Managed Redis Basic tier with local memory LRU fallback."
          }
        },
        {
          id: "node-03",
          name: "Agent_Synthesizer",
          type: "Final Consensus Synthesis",
          icon: "fa-solid fa-wand-magic-sparkles",
          latency: "630 ms",
          tokens: "1,370 tokens",
          cost: "$0.0068",
          status: "success",
          input: {
            architect_proposal: "Redis Enterprise",
            critic_recommendation: "Azure Managed Redis Basic + LRU"
          },
          output: {
            final_spec: "Azure Managed Redis (Basic C1) + In-memory LRU cache layer. Estimated cost: $45/mo.",
            status: "APPROVED_BY_CONSENSUS"
          }
        }
      ]
    },

    scraper: {
      title: "Resilient Web Scraper Pipeline",
      status: "200 OK",
      totalLatency: "2,150 ms",
      totalTokens: "1,120 tokens",
      nodes: [
        {
          id: "node-01",
          name: "Browser_Navigator",
          type: "Headless Chromium Dispatch",
          icon: "fa-solid fa-globe",
          latency: "520 ms",
          tokens: "120 tokens",
          cost: "$0.0006",
          status: "success",
          input: {
            target_url: "https://news.ycombinator.com",
            user_agent: "CloudTrace-Bot/1.0 (Azure Edge Worker)"
          },
          output: {
            http_status: 200,
            page_title: "Hacker News",
            dom_bytes: 48200
          }
        },
        {
          id: "node-02",
          name: "DOM_Parser_LLM",
          type: "Structure Extractor",
          icon: "fa-solid fa-code",
          latency: "980 ms",
          tokens: "750 tokens",
          cost: "$0.0037",
          status: "success",
          input: {
            target_elements: [".titleline", ".subtext"],
            max_items: 5
          },
          output: {
            extracted_items_count: 5,
            sample: { title: "Show HN: CloudTrace AI", points: 142 }
          }
        },
        {
          id: "node-03",
          name: "Azure_Blob_Storage",
          type: "Persistent Storage Sink",
          icon: "fa-database fa-solid",
          latency: "650 ms",
          tokens: "250 tokens",
          cost: "$0.0012",
          status: "success",
          input: {
            container: "scraped-telemetry",
            blob_name: "hn-2026-08-18.json"
          },
          output: {
            blob_url: "https://cloudtracedata.blob.core.windows.net/scraped-telemetry/hn-2026-08-18.json",
            status: "STORED_SUCCESSFULLY"
          }
        }
      ]
    },

    refactor: {
      title: "Automated Code Refactoring Pipeline",
      status: "200 OK",
      totalLatency: "1,890 ms",
      totalTokens: "3,410 tokens",
      nodes: [
        {
          id: "node-01",
          name: "AST_Linter",
          type: "Static Code Analysis",
          icon: "fa-solid fa-bug",
          latency: "210 ms",
          tokens: "450 tokens",
          cost: "$0.0022",
          status: "success",
          input: {
            source_file: "utils/cache.js",
            ruleset: ["no-eval", "prefer-const", "async-await"]
          },
          output: {
            violations_found: 2,
            details: ["Line 14: var used instead of const", "Line 28: unhandled Promise rejection"]
          }
        },
        {
          id: "node-02",
          name: "AI_Refactor_Engine",
          type: "LLM Code Rewrite (Claude 3.5)",
          icon: "fa-solid fa-gears",
          latency: "1,140 ms",
          tokens: "2,200 tokens",
          cost: "$0.0110",
          status: "success",
          input: {
            target_fix: "Fix async rejection & modernize ES6 syntax",
            model: "claude-3-5-sonnet"
          },
          output: {
            refactored_lines: 34,
            diff_summary: "+ const cache = new Map(); - var cache = {};"
          }
        },
        {
          id: "node-03",
          name: "Unit_Test_Runner",
          type: "Jest Test Verification",
          icon: "fa-solid fa-check-double",
          latency: "540 ms",
          tokens: "760 tokens",
          cost: "$0.0038",
          status: "success",
          input: {
            test_suite: "tests/cache.test.js",
            timeout: 5000
          },
          output: {
            tests_passed: 12,
            tests_failed: 0,
            coverage: "98.4%"
          }
        }
      ]
    }
  };

  /* --------------------------------------------------------------------------
     2. APP STATE VARIABLES
     -------------------------------------------------------------------------- */
  let currentScenarioKey = 'debate';
  let activeNodeIndex = 0;
  let isPlaying = true;
  let playbackSpeed = 1; // 1x, 2x, 5x
  let playbackInterval = null;

  /* --------------------------------------------------------------------------
     3. DOM ELEMENT REFERENCES
     -------------------------------------------------------------------------- */
  const nodesChainEl = document.getElementById('nodesChain');
  const detailsPanelContentEl = document.getElementById('nodeDetailsContent');
  const nodeDetailTitleEl = document.getElementById('nodeDetailTitle');
  const nodeDetailStatusEl = document.getElementById('nodeDetailStatus');
  
  const graphMetaInfoEl = document.getElementById('graphMetaInfo');
  const totalLatencyEl = document.getElementById('totalLatency');
  const totalTokensEl = document.getElementById('totalTokens');

  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnStepPrev = document.getElementById('btnStepPrev');
  const btnStepNext = document.getElementById('btnStepNext');
  const btnReplay = document.getElementById('btnReplay');
  const timelineSlider = document.getElementById('timelineSlider');

  const themeToggleBtn = document.getElementById('themeToggle');
  const toastEl = document.getElementById('toast');

  /* --------------------------------------------------------------------------
     4. RENDER FUNCTIONS
     -------------------------------------------------------------------------- */
  function renderScenario(key) {
    currentScenarioKey = key;
    const scenario = SCENARIOS[key];
    
    // Update Meta Information
    totalLatencyEl.textContent = scenario.totalLatency;
    totalTokensEl.textContent = scenario.totalTokens;

    // Render Node Cards in Left Panel
    nodesChainEl.innerHTML = '';
    scenario.nodes.forEach((node, idx) => {
      const card = document.createElement('div');
      card.className = `node-card ${idx === activeNodeIndex ? 'active' : ''}`;
      card.dataset.index = idx;

      card.innerHTML = `
        <div class="node-left">
          <div class="node-icon"><i class="${node.icon}"></i></div>
          <div class="node-info">
            <span class="node-name">${node.name}</span>
            <span class="node-type">${node.type}</span>
          </div>
        </div>
        <div class="node-right">
          <span class="node-stat"><i class="fa-regular fa-clock me-1"></i>${node.latency}</span>
          <span class="badge badge-success"><i class="fa-solid fa-check"></i> OK</span>
        </div>
      `;

      card.addEventListener('click', () => {
        selectNode(idx);
      });

      nodesChainEl.appendChild(card);
    });

    renderNodeDetails(activeNodeIndex);
  }

  function selectNode(index) {
    activeNodeIndex = index;
    
    // Update active class on cards
    const cards = nodesChainEl.querySelectorAll('.node-card');
    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update Slider Position
    const maxIndex = SCENARIOS[currentScenarioKey].nodes.length - 1;
    const percent = Math.round((index / maxIndex) * 100);
    timelineSlider.value = percent;

    renderNodeDetails(index);
  }

  function renderNodeDetails(index) {
    const node = SCENARIOS[currentScenarioKey].nodes[index];
    if (!node) return;

    nodeDetailTitleEl.innerHTML = `<i class="${node.icon} text-accent me-2"></i> <span>${node.name}</span>`;
    nodeDetailStatusEl.textContent = `Step ${index + 1} of ${SCENARIOS[currentScenarioKey].nodes.length}`;

    // Pretty-printed syntax highlighted JSON
    const inputJson = syntaxHighlightJson(node.input);
    const outputJson = syntaxHighlightJson(node.output);

    detailsPanelContentEl.innerHTML = `
      <!-- Token & Spend Metrics Grid -->
      <div class="token-stats-grid">
        <div class="token-stat-card">
          <div class="token-stat-val text-azure">${node.latency}</div>
          <div class="token-stat-lbl">Execution Latency</div>
        </div>
        <div class="token-stat-card">
          <div class="token-stat-val text-emerald">${node.tokens}</div>
          <div class="token-stat-lbl">Token Usage</div>
        </div>
        <div class="token-stat-card">
          <div class="token-stat-val text-amber">${node.cost}</div>
          <div class="token-stat-lbl">Est. Azure Spend</div>
        </div>
      </div>

      <!-- Node Input Section -->
      <div>
        <div class="detail-section-title"><i class="fa-solid fa-arrow-right-to-bracket me-1"></i> Input Context Payload</div>
        <div class="detail-box">${inputJson}</div>
      </div>

      <!-- Node Output Section -->
      <div>
        <div class="detail-section-title"><i class="fa-solid fa-arrow-right-from-bracket me-1"></i> Output Payload & Result</div>
        <div class="detail-box">${outputJson}</div>
      </div>
    `;
  }

  /* Syntax Highlighting Helper */
  function syntaxHighlightJson(json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }

  /* --------------------------------------------------------------------------
     5. SCENARIO TAB EVENT LISTENERS
     -------------------------------------------------------------------------- */
  const scenarioTabs = document.querySelectorAll('.scenario-tab');
  scenarioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scenarioTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const scenarioKey = tab.dataset.scenario;
      activeNodeIndex = 0;
      renderScenario(scenarioKey);
      showToast(`Switched to scenario: ${tab.querySelector('span').textContent}`);
    });
  });

  /* --------------------------------------------------------------------------
     6. PLAYBACK CONTROLS
     -------------------------------------------------------------------------- */
  function startPlayback() {
    stopPlayback();
    isPlaying = true;
    btnPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i>';

    const intervalTime = 2000 / playbackSpeed;
    playbackInterval = setInterval(() => {
      const maxIndex = SCENARIOS[currentScenarioKey].nodes.length - 1;
      if (activeNodeIndex < maxIndex) {
        selectNode(activeNodeIndex + 1);
      } else {
        selectNode(0); // loop around
      }
    }, intervalTime);
  }

  function stopPlayback() {
    isPlaying = false;
    btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (playbackInterval) {
      clearInterval(playbackInterval);
      playbackInterval = null;
    }
  }

  btnPlayPause.addEventListener('click', () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });

  btnStepNext.addEventListener('click', () => {
    stopPlayback();
    const maxIndex = SCENARIOS[currentScenarioKey].nodes.length - 1;
    if (activeNodeIndex < maxIndex) {
      selectNode(activeNodeIndex + 1);
    }
  });

  btnStepPrev.addEventListener('click', () => {
    stopPlayback();
    if (activeNodeIndex > 0) {
      selectNode(activeNodeIndex - 1);
    }
  });

  btnReplay.addEventListener('click', () => {
    selectNode(0);
    startPlayback();
  });

  // Speed Selector Buttons
  const speedBtns = document.querySelectorAll('.speed-btn');
  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playbackSpeed = parseFloat(btn.dataset.speed);
      if (isPlaying) startPlayback();
    });
  });

  // Timeline Slider Scrub
  timelineSlider.addEventListener('input', (e) => {
    stopPlayback();
    const val = parseInt(e.target.value);
    const maxIndex = SCENARIOS[currentScenarioKey].nodes.length - 1;
    const targetIndex = Math.round((val / 100) * maxIndex);
    selectNode(targetIndex);
  });

  /* --------------------------------------------------------------------------
     7. THEME SWITCHER ENGINE
     -------------------------------------------------------------------------- */
  const savedTheme = localStorage.getItem('cloudtrace-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cloudtrace-theme', newTheme);
    showToast(`Theme switched to ${newTheme} mode`);
  });

  /* --------------------------------------------------------------------------
     8. CODE COPY UTILITIES
     -------------------------------------------------------------------------- */
  const copyInstallBtn = document.getElementById('copyInstallBtn');
  if (copyInstallBtn) {
    copyInstallBtn.addEventListener('click', () => {
      const text = document.getElementById('installCmd').textContent;
      navigator.clipboard.writeText(text);
      showToast("Copied command to clipboard!");
    });
  }

  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const text = document.getElementById('codeSnippet').textContent;
      navigator.clipboard.writeText(text);
      showToast("Copied SDK code snippet to clipboard!");
    });
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2500);
  }

  /* --------------------------------------------------------------------------
     9. DEVELOPER TERMINAL EASTER EGG (Ctrl + K / Konami Code)
     -------------------------------------------------------------------------- */
  const cliModal = document.getElementById('cliModal');
  const cliCloseBtn = document.getElementById('cliCloseBtn');
  const cliInput = document.getElementById('cliInput');
  const cliOutput = document.getElementById('cliOutput');
  const cliTriggerBtn = document.getElementById('cliTriggerBtn');

  function openCliModal() {
    cliModal.classList.add('open');
    cliInput.focus();
  }

  function closeCliModal() {
    cliModal.classList.remove('open');
  }

  if (cliTriggerBtn) cliTriggerBtn.addEventListener('click', openCliModal);
  if (cliCloseBtn) cliCloseBtn.addEventListener('click', closeCliModal);

  cliModal.addEventListener('click', (e) => {
    if (e.target === cliModal) closeCliModal();
  });

  // Keybindings: Ctrl + K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (cliModal.classList.contains('open')) {
        closeCliModal();
      } else {
        openCliModal();
      }
    }
  });

  // Konami Code Sequence: ↑ ↑ ↓ ↓ ← → ← → b a
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        openCliModal();
        appendCliLine("<span class='text-accent'>🎉 KONAMI CODE UNLOCKED! Welcome Master Developer!</span>");
      }
    } else {
      konamiIndex = 0;
    }
  });

  // CLI Command Processor
  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = cliInput.value.trim().toLowerCase();
      cliInput.value = '';
      if (!cmd) return;

      appendCliLine(`<span class="cli-prompt">cloudtrace-cli:~#</span> ${cmd}`);
      processCliCommand(cmd);
      cliOutput.scrollTop = cliOutput.scrollHeight;
    }
  });

  function appendCliLine(html) {
    const line = document.createElement('div');
    line.className = 'cli-line';
    line.innerHTML = html;
    cliOutput.appendChild(line);
  }

  function processCliCommand(cmd) {
    switch(cmd) {
      case 'help':
        appendCliLine("Available Commands:");
        appendCliLine("  <span class='text-accent'>status</span>  - Output system & Azure CDN health status");
        appendCliLine("  <span class='text-accent'>azure</span>   - View Azure Static Web Apps deployment config");
        appendCliLine("  <span class='text-accent'>nodes</span>   - List current scenario execution nodes");
        appendCliLine("  <span class='text-accent'>theme</span>   - Toggle dark/light theme");
        appendCliLine("  <span class='text-accent'>clear</span>   - Clear terminal window");
        appendCliLine("  <span class='text-accent'>exit</span>    - Close developer terminal");
        break;

      case 'status':
        appendCliLine("System Health: <span class='text-emerald'>100% Operational</span>");
        appendCliLine("Region: Azure Global Edge (East US)");
        appendCliLine("Latency: 12ms to nearest CDN POP");
        appendCliLine("Telemetry Buffer: 0 dropped packets");
        break;

      case 'azure':
        appendCliLine("Azure Deployment Summary:");
        appendCliLine("  Provider: Azure Static Web Apps");
        appendCliLine("  CI/CD: GitHub Actions Workflow");
        appendCliLine("  SKU: Free Tier ($9000 Student Credits)");
        appendCliLine("  Custom Header CSP: Enabled");
        break;

      case 'nodes':
        const nodes = SCENARIOS[currentScenarioKey].nodes;
        appendCliLine(`Current Scenario Nodes (${currentScenarioKey}):`);
        nodes.forEach((n, i) => {
          appendCliLine(`  [${i + 1}] ${n.name} (${n.latency}) - ${n.tokens}`);
        });
        break;

      case 'theme':
        themeToggleBtn.click();
        appendCliLine("Theme toggled successfully.");
        break;

      case 'clear':
        cliOutput.innerHTML = '';
        break;

      case 'exit':
        closeCliModal();
        break;

      default:
        appendCliLine(`<span class='text-amber'>Command not recognized: '${cmd}'. Type 'help' for commands.</span>`);
        break;
    }
  }

  /* --------------------------------------------------------------------------
     10. INITIALIZE DEFAULT SCENARIO & AUTO PLAYBACK
     -------------------------------------------------------------------------- */
  renderScenario('debate');
  startPlayback();

});
