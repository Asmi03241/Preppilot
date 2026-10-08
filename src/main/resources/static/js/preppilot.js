/**
 * PrepPilot — Master Application Script
 * Dynamic AI Study Assistant with zero static/mock fallbacks
 */

document.addEventListener("DOMContentLoaded", function () {

    /* ============================================================
       DOM REFERENCES
       ============================================================ */

    const genOptions       = document.querySelectorAll(".gen-option");
    const configPanels     = document.querySelectorAll(".config-panel");
    const configTitle      = document.getElementById("configTitle");
    const generateBtn      = document.getElementById("generateBtn");
    const generateBtnText  = document.getElementById("generateBtnText");

    const fileInput        = document.getElementById("fileInput");
    const uploadZone       = document.getElementById("uploadZone");
    const fileInfoRow      = document.getElementById("fileInfoRow");
    const fileInfoName     = document.getElementById("fileInfoName");
    const fileInfoSize     = document.getElementById("fileInfoSize");
    const fileBadgeText    = document.getElementById("fileBadgeText");
    const fileBadgeIcon    = document.getElementById("fileBadgeIcon");
    const fileRemoveBtn    = document.getElementById("fileRemoveBtn");

    const emptyState       = document.getElementById("emptyState");
    const generatedOutput  = document.getElementById("generatedOutput");
    const resultTitle      = document.getElementById("resultTitle");
    const resultSubtitle   = document.getElementById("resultSubtitle");
    const resultActionBtns = document.getElementById("resultActionBtns");
    const resultsIcon      = document.getElementById("resultsIcon");

    const copyBtn          = document.getElementById("copyBtn");
    const downloadBtn      = document.getElementById("downloadBtn");
    const regenerateBtn    = document.getElementById("regenerateBtn");
    const themeToggle      = document.getElementById("themeToggle");

    const recentActivityWrap     = document.getElementById("recentActivityWrap");
    const recentActivityBtn      = document.getElementById("recentActivityBtn");
    const recentActivityDropdown = document.getElementById("recentActivityDropdown");
    const recentActivityList     = document.getElementById("recentActivityList");
    const recentCountBadge       = document.getElementById("recentCountBadge");

    /* ============================================================
       STATE DEFINITION (Starts empty - no mock or hardcoded files)
       ============================================================ */

    let currentType       = "mcq";
    let selectedFile      = null;
    let lastGeneratedData = null;
    let lastGeneratedText = "";

    const GEN_TYPES = {
        mcq: {
            title:    "Configure MCQ Generation",
            heading:  "Generated MCQs",
            subtitle: "Here are your AI-generated multiple choice questions based on your material.",
            button:   "Generate MCQs",
            configId: "mcqConfig",
            iconSvg:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`
        },
        flashcards: {
            title:    "Configure Flashcards",
            heading:  "Generated Flashcards",
            subtitle: "Here are your AI-generated flashcards for quick revision and active recall.",
            button:   "Generate Flashcards",
            configId: "flashcardsConfig",
            iconSvg:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
        },
        mindmap: {
            title:    "Configure Mind Map",
            heading:  "Generated Mind Map",
            subtitle: "A structured concept hierarchy mapped from your study material.",
            button:   "Generate Mind Map",
            configId: "mindmapConfig",
            iconSvg:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><line x1="9.5" y1="10.5" x2="5.5" y2="7.5"/><line x1="14.5" y1="10.5" x2="18.5" y2="7.5"/><line x1="9.5" y1="13.5" x2="5.5" y2="16.5"/><line x1="14.5" y1="13.5" x2="18.5" y2="16.5"/></svg>`
        },
        theory: {
            title:    "Configure Theory Questions",
            heading:  "Generated Theory Questions",
            subtitle: "Exam-oriented descriptive questions generated from your study material.",
            button:   "Generate Questions",
            configId: "theoryConfig",
            iconSvg:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
        },
        studyplan: {
            title:    "Configure Study Plan",
            heading:  "Generated Study Plan",
            subtitle: "Personalized preparation roadmap tailored to your timeline and targets.",
            button:   "Generate Study Plan",
            configId: "studyplanConfig",
            iconSvg:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
        }
    };

    /* ============================================================
       TAB SWITCHING
       ============================================================ */

    function switchGenType(type) {
        if (!GEN_TYPES[type]) return;

        genOptions.forEach(function (b) {
            if (b.dataset.type === type) {
                b.classList.add("active");
                b.setAttribute("aria-checked", "true");
            } else {
                b.classList.remove("active");
                b.setAttribute("aria-checked", "false");
            }
        });

        configPanels.forEach(function (p) {
            p.classList.remove("active");
        });

        const panel = document.getElementById(GEN_TYPES[type].configId);
        if (panel) panel.classList.add("active");

        if (configTitle) configTitle.textContent = GEN_TYPES[type].title;
        if (generateBtnText) generateBtnText.textContent = GEN_TYPES[type].button;
        currentType = type;
    }

    genOptions.forEach(function (btn) {
        btn.addEventListener("click", function () {
            switchGenType(btn.dataset.type);
        });
    });

    /* ============================================================
       FILE UPLOAD & REMOVAL
       ============================================================ */

    function formatFileSize(bytes) {
        if (!bytes || bytes === 0) return "0 B";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1048576).toFixed(1) + " MB";
    }

    function handleFileSelected(file) {
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        const validExts = ["pdf", "docx", "txt"];
        if (!validExts.includes(ext)) {
            showToast("Supported formats: PDF, DOCX, TXT");
            return;
        }

        selectedFile = file;
        if (fileInfoName) fileInfoName.textContent = file.name;
        if (fileInfoSize) fileInfoSize.textContent = formatFileSize(file.size);

        if (fileBadgeText) fileBadgeText.textContent = ext.toUpperCase();
        if (fileBadgeIcon) {
            fileBadgeIcon.className = "file-info-icon " + ext + "-badge-icon";
        }

        if (fileInfoRow) {
            fileInfoRow.style.display = "flex";
            fileInfoRow.hidden = false;
        }
        if (uploadZone) {
            uploadZone.classList.remove("highlight-pulse");
        }
    }

    function clearFile() {
        selectedFile = null;
        if (fileInput) fileInput.value = "";
        if (fileInfoRow) {
            fileInfoRow.style.display = "none";
            fileInfoRow.hidden = true;
        }
    }

    if (fileInput) {
        fileInput.addEventListener("change", function () {
            if (fileInput.files.length > 0) {
                handleFileSelected(fileInput.files[0]);
            }
        });
    }

    if (fileRemoveBtn) {
        fileRemoveBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            clearFile();
        });
    }

    if (uploadZone) {
        uploadZone.addEventListener("click", function () {
            if (fileInput) fileInput.click();
        });

        uploadZone.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (fileInput) fileInput.click();
            }
        });

        uploadZone.addEventListener("dragover", function (e) {
            e.preventDefault();
            uploadZone.classList.add("dragover");
        });

        uploadZone.addEventListener("dragleave", function (e) {
            if (!uploadZone.contains(e.relatedTarget)) {
                uploadZone.classList.remove("dragover");
            }
        });

        uploadZone.addEventListener("drop", function (e) {
            e.preventDefault();
            uploadZone.classList.remove("dragover");
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                handleFileSelected(files[0]);
            }
        });
    }

    /* ============================================================
       PAYLOAD COLLECTION & API DISPATCH
       ============================================================ */

    function collectConfigParams() {
        const params = {
            type: currentType
        };

        if (currentType === "mcq") {
            params.count        = parseInt(document.getElementById("mcqCount")?.value || "10", 10);
            params.difficulty   = document.getElementById("mcqDifficulty")?.value || "medium";
            params.questionType = document.getElementById("mcqQuestionType")?.value || "mixed";
            params.explanations = document.getElementById("mcqExplanations")?.checked !== false;
        } else if (currentType === "flashcards") {
            params.count        = parseInt(document.getElementById("fcCount")?.value || "10", 10);
            params.difficulty   = document.getElementById("fcDifficulty")?.value || "medium";
            params.cardStyle    = document.getElementById("fcStyle")?.value || "qa";
        } else if (currentType === "mindmap") {
            params.detailLevel  = document.getElementById("mmDetail")?.value || "detailed";
            params.organization = document.getElementById("mmOrg")?.value || "topic";
        } else if (currentType === "theory") {
            params.count        = parseInt(document.getElementById("thCount")?.value || "10", 10);
            params.difficulty   = document.getElementById("thDifficulty")?.value || "medium";
            params.questionType = document.getElementById("thType")?.value || "short";
        } else if (currentType === "studyplan") {
            params.examDate       = document.getElementById("spExamDate")?.value || "";
            params.dailyStudyTime = document.getElementById("spDailyTime")?.value || "2";
            params.priority       = document.getElementById("spPriority")?.value || "weak";
        }

        return params;
    }

    if (generateBtn) {
        generateBtn.addEventListener("click", function () {
            if (!selectedFile) {
                showToast("Please upload your study material first");
                if (uploadZone) {
                    uploadZone.classList.add("highlight-pulse");
                    uploadZone.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }

            const params = collectConfigParams();
            triggerBackendGeneration(selectedFile, params);
        });
    }

    function showLoadingState(typeName) {
        if (emptyState) {
            emptyState.style.display = "flex";
            emptyState.innerHTML = `
                <div class="loading-state">
                    <div class="loading-dots">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                    <p class="loading-text">Analyzing material & generating ${typeName}&hellip;</p>
                </div>
            `;
        }

        if (generatedOutput) {
            generatedOutput.classList.remove("visible");
            generatedOutput.style.display = "none";
            generatedOutput.innerHTML = "";
        }

        if (generateBtn) generateBtn.classList.add("loading");
        if (generateBtnText) generateBtnText.textContent = "Generating\u2026";
        if (resultActionBtns) resultActionBtns.style.display = "none";
    }

    function hideLoadingState() {
        if (generateBtn) generateBtn.classList.remove("loading");
        if (generateBtnText && GEN_TYPES[currentType]) {
            generateBtnText.textContent = GEN_TYPES[currentType].button;
        }
    }

    function showErrorState(message) {
        if (emptyState) {
            emptyState.style.display = "flex";
            emptyState.innerHTML = `
                <div class="empty-icon-wrap" aria-hidden="true">
                    <div class="empty-icon-bg" style="color: var(--red); background: var(--red-light);">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                </div>
                <h3 style="color: var(--red);">Generation Failed</h3>
                <p style="max-width: 440px;">${message}</p>
                <button type="button" class="choose-file-btn" onclick="document.getElementById('generateBtn').click()" style="margin-top: 10px;">
                    Try Again
                </button>
            `;
        }

        if (generatedOutput) {
            generatedOutput.classList.remove("visible");
            generatedOutput.style.display = "none";
            generatedOutput.innerHTML = "";
        }

        if (resultActionBtns) {
            resultActionBtns.style.display = "none";
        }
    }

    async function triggerBackendGeneration(file, params) {
        const meta = GEN_TYPES[currentType] || GEN_TYPES.mcq;
        showLoadingState(meta.button.replace("Generate ", "").toLowerCase());

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", params.type);
        formData.append("config", JSON.stringify(params));

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success && data.data) {
                renderBackendResult(params.type, data, params);
                fetchRecentActivities(true);
            } else {
                const errorMsg = data.message || "Failed to generate study material. Please check your Gemini API key or file format.";
                showErrorState(errorMsg);
                showToast(errorMsg);
            }
        } catch (err) {
            showErrorState("Server connection error: " + err.message);
            showToast("Server connection error");
        } finally {
            hideLoadingState();
        }
    }

    /* ============================================================
       BACKEND DATA RENDERER (Clean Template Literals)
       ============================================================ */

    function renderBackendResult(type, payload, params) {
        const meta = GEN_TYPES[type] || GEN_TYPES.mcq;
        const data = payload.data;

        if (emptyState) {
            emptyState.style.display = "none";
            emptyState.innerHTML = "";
        }

        if (resultTitle)    resultTitle.textContent    = meta.heading;
        if (resultSubtitle) resultSubtitle.textContent = meta.subtitle;
        if (resultsIcon)    resultsIcon.innerHTML      = meta.iconSvg;

        let html = "";
        let textForCopy = "";

        if (type === "mcq") {
            const count = data.totalQuestions || (data.questions ? data.questions.length : (params.count || 10));
            const diff  = params.difficulty ? cap(params.difficulty) : "Medium";
            const exp   = params.explanations !== false ? "With" : "Without";

            // Collect unique topics
            const topicsSet = new Set();
            if (data.questions) {
                data.questions.forEach(q => { if (q.topic) topicsSet.add(q.topic); });
            }
            const topicsCount = topicsSet.size || 1;

            html += `
                <div class="output-stats-bar">
                    <div class="stat-cell"><div class="stat-icon plum"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${count}</span><span class="stat-label">Questions</span></div></div>
                    <div class="stat-cell"><div class="stat-icon amber"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${diff}</span><span class="stat-label">Difficulty</span></div></div>
                    <div class="stat-cell"><div class="stat-icon teal"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 17 22 12"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${topicsCount}</span><span class="stat-label">Topics</span></div></div>
                    <div class="stat-cell"><div class="stat-icon gold"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${exp}</span><span class="stat-label">Explanations</span></div></div>
                </div>
            `;

            textForCopy += `MCQ Study Material: ${data.title || 'Generated Quiz'}\n\n`;

            if (data.questions && data.questions.length > 0) {
                data.questions.forEach((q, i) => {
                    const qDiffClass = q.difficulty ? q.difficulty.toLowerCase() : 'medium';
                    html += `
                        <div class="mcq-card">
                            <div class="mcq-header">
                                <div class="mcq-q-text">
                                    <span class="q-num-badge">${i + 1}</span>
                                    <span>${escapeHtml(q.question)}</span>
                                </div>
                                <span class="diff-badge ${qDiffClass}">${cap(q.difficulty || 'Medium')}</span>
                            </div>
                            <div class="mcq-options-grid">
                    `;

                    textForCopy += `${i + 1}. ${q.question}\n`;
                    const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

                    if (q.options) {
                        q.options.forEach((opt, oIdx) => {
                            const isCorrect = (oIdx === q.correctIndex);
                            const checkClass = isCorrect ? 'checked' : '';
                            const iconSvg = isCorrect ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ``;
                            const cleanOpt = opt.replace(/^[A-F]\.\s*/, '');
                            html += `
                                <div class="mcq-opt-item ${checkClass}">
                                    <span class="radio-circle">${iconSvg}</span>
                                    <span class="opt-text">${labels[oIdx] || '*'}. ${escapeHtml(cleanOpt)}</span>
                                </div>
                            `;
                            textForCopy += `   ${labels[oIdx] || '*'}. ${cleanOpt} ${isCorrect ? '[Correct]' : ''}\n`;
                        });
                    }
                    html += `</div>`;
                    if (q.explanation && exp === "With") {
                        html += `<div class="mcq-explanation-box"><span style="font-size: 14px;">💡</span><div><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div></div>`;
                        textForCopy += `   Explanation: ${q.explanation}\n`;
                    }
                    html += `</div>`;
                    textForCopy += `\n`;
                });
            }
        } else if (type === "flashcards") {
            const count = data.totalCards || (data.cards ? data.cards.length : (params.count || 10));
            const style = params.cardStyle === "te" ? "Term" : (params.cardStyle === "cd" ? "Concept" : "Q&A");

            html += `
                <div class="output-stats-bar">
                    <div class="stat-cell"><div class="stat-icon plum"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${count}</span><span class="stat-label">Total Cards</span></div></div>
                    <div class="stat-cell"><div class="stat-icon amber"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${style}</span><span class="stat-label">Card Style</span></div></div>
                    <div class="stat-cell"><div class="stat-icon teal"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">Active</span><span class="stat-label">Recall Mode</span></div></div>
                </div>
                <div class="flashcard-grid">
            `;

            textForCopy += `Flashcards: ${data.title || 'Generated Flashcards'}\n\n`;

            if (data.cards) {
                data.cards.forEach((c, i) => {
                    html += `
                        <div class="fc-card">
                            <div class="fc-top">
                                <span class="fc-num-badge">${i + 1}</span>
                                <span class="fc-category">${escapeHtml(c.category || 'Concept')}</span>
                            </div>
                            <div class="fc-front">${escapeHtml(c.front)}</div>
                            <div class="fc-back">${escapeHtml(c.back)}</div>
                        </div>
                    `;
                    textForCopy += `Card ${i + 1} [${c.category || 'Concept'}]\nFront: ${c.front}\nBack: ${c.back}\n\n`;
                });
            }
            html += `</div>`;

        } else if (type === "mindmap") {
            const branches = data.nodes ? data.nodes.length : 0;
            const detailLevel = params.detailLevel ? cap(params.detailLevel) : "Detailed";

            html += `
                <div class="output-stats-bar">
                    <div class="stat-cell"><div class="stat-icon plum"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><line x1="9.5" y1="10.5" x2="5.5" y2="7.5"/><line x1="14.5" y1="10.5" x2="18.5" y2="7.5"/><line x1="9.5" y1="13.5" x2="5.5" y2="16.5"/><line x1="14.5" y1="13.5" x2="18.5" y2="16.5"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${branches}</span><span class="stat-label">Core Branches</span></div></div>
                    <div class="stat-cell"><div class="stat-icon amber"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${detailLevel}</span><span class="stat-label">Depth Level</span></div></div>
                </div>
                <div class="mindmap-container">
                    <div class="mindmap-central-box">
                        <div class="mindmap-central-title">${escapeHtml(data.centralTopic || 'Core Concept')}</div>
                        <div class="mindmap-central-sub">Central Topic</div>
                    </div>
                    <div class="mindmap-branches">
            `;

            textForCopy += `Mind Map: ${data.centralTopic || 'Core Concept'}\n\n`;

            if (data.nodes) {
                data.nodes.forEach(n => {
                    const branchColor = n.color || 'var(--plum)';
                    html += `
                        <div class="mindmap-branch-card" style="border-top-color: ${branchColor}">
                            <div class="mindmap-branch-header">
                                <span class="mindmap-node-pill" style="color: ${branchColor}; background: var(--plum-light)">${escapeHtml(n.id || '')}</span>
                                <span>${escapeHtml(n.name)}</span>
                            </div>
                            <ul class="mindmap-leaf-list">
                    `;
                    textForCopy += `${n.id || '-'}. ${n.name}\n`;
                    if (n.children) {
                        n.children.forEach(c => {
                            html += `
                                <li class="mindmap-leaf-item">
                                    <div class="mindmap-leaf-bullet" style="background: ${branchColor}"></div>
                                    <span>${escapeHtml(c.name)}</span>
                                </li>
                            `;
                            textForCopy += `   - ${c.name}\n`;
                        });
                    }
                    html += `</ul></div>`;
                    textForCopy += `\n`;
                });
            }
            html += `</div></div>`;

        } else if (type === "theory") {
            const count = data.totalQuestions || (data.questions ? data.questions.length : (params.count || 5));
            let totalMarks = 0;
            if (data.questions) {
                data.questions.forEach(q => totalMarks += (q.marks || 5));
            }

            html += `
                <div class="output-stats-bar">
                    <div class="stat-cell"><div class="stat-icon plum"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${count}</span><span class="stat-label">Questions</span></div></div>
                    <div class="stat-cell"><div class="stat-icon amber"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${totalMarks}</span><span class="stat-label">Total Marks</span></div></div>
                    <div class="stat-cell"><div class="stat-icon teal"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">Detailed</span><span class="stat-label">Model Answers</span></div></div>
                </div>
            `;

            textForCopy += `Theory Questions: ${data.title || 'Descriptive Exam'}\n\n`;

            if (data.questions) {
                data.questions.forEach((q, i) => {
                    html += `
                        <div class="theory-card">
                            <div class="theory-header">
                                <div class="mcq-q-text">
                                    <span class="q-num-badge">${i + 1}</span>
                                    <span>${escapeHtml(q.question)}</span>
                                </div>
                                <span class="theory-marks-badge">${q.marks || 5} Marks</span>
                            </div>
                            <div class="theory-model-box">
                                <strong>Model Answer:</strong><br/>${escapeHtml(q.modelAnswer)}
                            </div>
                    `;
                    textForCopy += `Q${i + 1}. ${q.question} [${q.marks || 5} Marks]\nModel Answer: ${q.modelAnswer}\n`;
                    if (q.keyPoints && q.keyPoints.length > 0) {
                        html += `
                            <div class="theory-keypoints">
                                <strong>Key Points to Cover:</strong>
                                <ul>
                        `;
                        textForCopy += `Key Points:\n`;
                        q.keyPoints.forEach(kp => {
                            html += `<li>${escapeHtml(kp)}</li>`;
                            textForCopy += ` - ${kp}\n`;
                        });
                        html += `</ul></div>`;
                    }
                    html += `</div>`;
                    textForCopy += `\n`;
                });
            }

        } else if (type === "studyplan") {
            const phases = data.schedule ? data.schedule.length : 0;
            const daily = data.dailyCommitment || (params.dailyStudyTime + " hrs/day");

            html += `
                <div class="output-stats-bar">
                    <div class="stat-cell"><div class="stat-icon plum"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${phases}</span><span class="stat-label">Total Phases</span></div></div>
                    <div class="stat-cell"><div class="stat-icon amber"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">${daily}</span><span class="stat-label">Commitment</span></div></div>
                    <div class="stat-cell"><div class="stat-icon teal"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                        <div class="stat-text-wrap"><span class="stat-value">Target</span><span class="stat-label">${escapeHtml(data.targetExamDate || 'Flexible')}</span></div></div>
                </div>
            `;

            textForCopy += `Study Plan: ${data.title || 'Preparation Roadmap'}\nTarget: ${data.targetExamDate || 'Flexible'}\nCommitment: ${daily}\n\n`;

            if (data.schedule) {
                data.schedule.forEach(p => {
                    html += `
                        <div class="plan-block-card">
                            <div class="plan-header">
                                <span class="plan-period">${escapeHtml(p.period)}</span>
                                <span class="plan-duration-badge">${escapeHtml(p.duration)}</span>
                            </div>
                            <div class="plan-focus">Focus: ${escapeHtml(p.focus)}</div>
                            <ul class="plan-tasks">
                    `;
                    textForCopy += `[ ${p.period} ] - ${p.duration}\nFocus: ${p.focus}\n`;
                    if (p.tasks) {
                        p.tasks.forEach(t => {
                            html += `
                                <li class="plan-task-item">
                                    <div class="plan-check"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                                    <span>${escapeHtml(t)}</span>
                                </li>
                            `;
                            textForCopy += ` [ ] ${t}\n`;
                        });
                    }
                    html += `</ul></div>`;
                    textForCopy += `\n`;
                });
            }

            if (data.keyMilestones && data.keyMilestones.length > 0) {
                html += `
                    <div class="plan-milestones-card">
                        <div class="plan-milestones-title">Key Milestones</div>
                        <ul class="mindmap-leaf-list" style="margin-top: 6px;">
                `;
                textForCopy += `Key Milestones:\n`;
                data.keyMilestones.forEach(m => {
                    html += `
                        <li class="mindmap-leaf-item">
                            <div class="mindmap-leaf-bullet"></div>
                            <span style="font-weight: 600;">${escapeHtml(m)}</span>
                        </li>
                    `;
                    textForCopy += ` * ${m}\n`;
                });
                html += `</ul></div>`;
            }
        }

        lastGeneratedData = data;
        lastGeneratedText = textForCopy;

        if (generatedOutput) {
            generatedOutput.innerHTML = html;
            generatedOutput.classList.add("visible");
            generatedOutput.style.display = "block";
        }

        if (resultActionBtns) {
            resultActionBtns.style.display = "flex";
            resultActionBtns.style.opacity = "1";
            resultActionBtns.style.pointerEvents = "auto";
        }
    }

    function cap(s) {
        if (!s) return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function escapeHtml(str) {
        if (str == null) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* ============================================================
       ACTIONS: COPY, DOWNLOAD, REGENERATE
       ============================================================ */

    if (copyBtn) {
        copyBtn.addEventListener("click", function () {
            if (!lastGeneratedText) {
                showToast("No content to copy");
                return;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(lastGeneratedText).then(function () {
                    showToast("Copied to clipboard!");
                }).catch(function () {
                    fallbackCopy(lastGeneratedText);
                });
            } else {
                fallbackCopy(lastGeneratedText);
            }
        });
    }

    function fallbackCopy(text) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand("copy");
            showToast("Copied to clipboard!");
        } catch (e) {
            showToast("Failed to copy");
        }
        document.body.removeChild(ta);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            if (!lastGeneratedText) {
                showToast("No content to download");
                return;
            }

            const blob = new Blob([lastGeneratedText], { type: "text/plain;charset=utf-8" });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href     = url;
            a.download = `preppilot-${currentType}-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("File downloaded!");
        });
    }

    if (regenerateBtn) {
        regenerateBtn.addEventListener("click", function () {
            if (!selectedFile) {
                showToast("Please upload a file first");
                return;
            }
            const params = collectConfigParams();
            triggerBackendGeneration(selectedFile, params);
        });
    }

    /* ============================================================
       THEME TOGGLE
       ============================================================ */

    const savedTheme = localStorage.getItem("preppilot-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const current = document.documentElement.getAttribute("data-theme") || "light";
            const next = current === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("preppilot-theme", next);
        });
    }

    /* ============================================================
       UTILITY: TOAST
       ============================================================ */

    let toastEl = null;

    function showToast(msg) {
        if (!toastEl) {
            toastEl = document.createElement("div");
            toastEl.className = "toast";
            document.body.appendChild(toastEl);
        }

        toastEl.textContent = msg;
        toastEl.classList.add("show");

        setTimeout(function () {
            if (toastEl) toastEl.classList.remove("show");
        }, 2600);
    }

    /* ============================================================
       RECENT ACTIVITY & SESSION RESTORATION
       ============================================================ */

    function toggleRecentDropdown(forceState) {
        if (!recentActivityDropdown) return;
        const isCurrentlyOpen = !recentActivityDropdown.hidden;
        const nextState = forceState !== undefined ? forceState : !isCurrentlyOpen;

        if (nextState) {
            recentActivityDropdown.hidden = false;
            if (recentActivityBtn) {
                recentActivityBtn.setAttribute("aria-expanded", "true");
                recentActivityBtn.classList.add("active");
            }
            fetchRecentActivities();
        } else {
            recentActivityDropdown.hidden = true;
            if (recentActivityBtn) {
                recentActivityBtn.setAttribute("aria-expanded", "false");
                recentActivityBtn.classList.remove("active");
            }
        }
    }

    if (recentActivityBtn) {
        recentActivityBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleRecentDropdown();
        });
    }

    // Close when clicking outside dropdown
    document.addEventListener("click", function (e) {
        if (recentActivityWrap && !recentActivityWrap.contains(e.target)) {
            toggleRecentDropdown(false);
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            toggleRecentDropdown(false);
        }
    });

    function formatTimestamp(dateStr) {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "";

            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();

            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const isYesterday = date.toDateString() === yesterday.toDateString();

            const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

            if (isToday) {
                return `Today, ${timeStr}`;
            } else if (isYesterday) {
                return `Yesterday, ${timeStr}`;
            } else {
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${timeStr}`;
            }
        } catch (e) {
            return "";
        }
    }

    function formatConfigSummary(generationType, configStr) {
        let cfg = {};
        if (configStr) {
            try {
                cfg = typeof configStr === "string" ? JSON.parse(configStr) : configStr;
            } catch (e) {}
        }

        const type = (generationType || "mcq").toLowerCase();
        const typeLabel = (type === "mcq") ? "MCQs" :
                          (type === "flashcards") ? "Flashcards" :
                          (type === "mindmap") ? "Mind Map" :
                          (type === "theory") ? "Theory Questions" :
                          (type === "studyplan") ? "Study Plan" : cap(type);

        const parts = [typeLabel];

        if (type === "mcq") {
            if (cfg.difficulty) parts.push(cap(cfg.difficulty));
            if (cfg.count) parts.push(`${cfg.count} questions`);
        } else if (type === "flashcards") {
            if (cfg.difficulty) parts.push(cap(cfg.difficulty));
            if (cfg.count) parts.push(`${cfg.count} cards`);
        } else if (type === "mindmap") {
            if (cfg.detailLevel) parts.push(cap(cfg.detailLevel));
            if (cfg.organization) parts.push(cap(cfg.organization));
        } else if (type === "theory") {
            if (cfg.difficulty) parts.push(cap(cfg.difficulty));
            if (cfg.count) parts.push(`${cfg.count} questions`);
        } else if (type === "studyplan") {
            if (cfg.dailyStudyTime) parts.push(`${cfg.dailyStudyTime} hrs/day`);
            if (cfg.priority) parts.push(cap(cfg.priority));
        }

        return parts.join(" • ");
    }

    async function fetchRecentActivities(silent = false) {
        if (!recentActivityList) return;

        if (!silent) {
            recentActivityList.innerHTML = `
                <div class="recent-loading-state">
                    <div class="loading-dots" style="margin: 0 auto 6px;">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                    <p style="font-size: 11.5px; color: var(--text-secondary);">Loading history...</p>
                </div>
            `;
        }

        try {
            const response = await fetch("/api/history");
            if (!response.ok) throw new Error("Status " + response.status);
            const sessions = await response.json();

            if (recentCountBadge) {
                recentCountBadge.textContent = Array.isArray(sessions) ? sessions.length : 0;
            }

            if (!Array.isArray(sessions) || sessions.length === 0) {
                recentActivityList.innerHTML = `
                    <div class="recent-empty-state">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p>No recent activity yet.</p>
                    </div>
                `;
                return;
            }

            let html = "";
            sessions.forEach(session => {
                const type = (session.generationType || "mcq").toLowerCase();
                const summary = formatConfigSummary(type, session.configuration);
                const timeFormatted = formatTimestamp(session.createdAt);
                const title = escapeHtml(session.materialName || "Study Material");

                html += `
                    <div class="recent-item" data-session-id="${session.id}" role="button" tabindex="0">
                        <div class="recent-item-main">
                            <div class="recent-item-title">
                                <span>${title}</span>
                                <span class="recent-item-type-badge">${type.toUpperCase()}</span>
                            </div>
                            <div class="recent-item-details">${escapeHtml(summary)}</div>
                            <div class="recent-item-time">${timeFormatted}</div>
                        </div>
                        <div class="recent-item-actions">
                            <button class="recent-item-del-btn" data-delete-id="${session.id}" type="button" title="Delete this session" aria-label="Delete session">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
            });

            recentActivityList.innerHTML = html;

            // Attach item click listeners
            recentActivityList.querySelectorAll(".recent-item").forEach(item => {
                item.addEventListener("click", function (e) {
                    if (e.target.closest(".recent-item-del-btn")) return;
                    const id = this.dataset.sessionId;
                    if (id) restoreGenerationSession(id);
                });
                item.addEventListener("keydown", function (e) {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (e.target.closest(".recent-item-del-btn")) return;
                        const id = this.dataset.sessionId;
                        if (id) restoreGenerationSession(id);
                    }
                });
            });

            // Attach item delete listeners
            recentActivityList.querySelectorAll(".recent-item-del-btn").forEach(btn => {
                btn.addEventListener("click", async function (e) {
                    e.stopPropagation();
                    const id = this.dataset.deleteId;
                    if (!id) return;
                    try {
                        const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
                        if (res.ok) {
                            showToast("Session removed");
                            fetchRecentActivities();
                        }
                    } catch (err) {
                        showToast("Failed to delete session");
                    }
                });
            });

        } catch (err) {
            recentActivityList.innerHTML = `
                <div class="recent-error-state">
                    <p>Failed to load recent activity</p>
                    <button type="button" class="choose-file-btn" onclick="fetchRecentActivities()" style="padding: 4px 12px; font-size: 11px; margin-top: 4px;">Retry</button>
                </div>
            `;
        }
    }

    function restoreConfigControls(type, cfg) {
        if (!cfg) return;

        if (type === "mcq") {
            if (cfg.count != null) {
                const el = document.getElementById("mcqCount");
                if (el) el.value = String(cfg.count);
            }
            if (cfg.difficulty) {
                const el = document.getElementById("mcqDifficulty");
                if (el) el.value = cfg.difficulty.toLowerCase();
            }
            if (cfg.questionType) {
                const el = document.getElementById("mcqQuestionType");
                if (el) el.value = cfg.questionType.toLowerCase();
            }
            if (cfg.explanations !== undefined) {
                const el = document.getElementById("mcqExplanations");
                if (el) el.checked = Boolean(cfg.explanations);
            }
        } else if (type === "flashcards") {
            if (cfg.count != null) {
                const el = document.getElementById("fcCount");
                if (el) el.value = String(cfg.count);
            }
            if (cfg.difficulty) {
                const el = document.getElementById("fcDifficulty");
                if (el) el.value = cfg.difficulty.toLowerCase();
            }
            if (cfg.cardStyle) {
                const el = document.getElementById("fcStyle");
                if (el) el.value = cfg.cardStyle.toLowerCase();
            }
        } else if (type === "mindmap") {
            if (cfg.detailLevel) {
                const el = document.getElementById("mmDetail");
                if (el) el.value = cfg.detailLevel.toLowerCase();
            }
            if (cfg.organization) {
                const el = document.getElementById("mmOrg");
                if (el) el.value = cfg.organization.toLowerCase();
            }
        } else if (type === "theory") {
            if (cfg.count != null) {
                const el = document.getElementById("thCount");
                if (el) el.value = String(cfg.count);
            }
            if (cfg.difficulty) {
                const el = document.getElementById("thDifficulty");
                if (el) el.value = cfg.difficulty.toLowerCase();
            }
            if (cfg.questionType) {
                const el = document.getElementById("thType");
                if (el) el.value = cfg.questionType.toLowerCase();
            }
        } else if (type === "studyplan") {
            if (cfg.examDate) {
                const el = document.getElementById("spExamDate");
                if (el) el.value = cfg.examDate;
            }
            if (cfg.dailyStudyTime) {
                const el = document.getElementById("spDailyTime");
                if (el) el.value = String(cfg.dailyStudyTime);
            }
            if (cfg.priority) {
                const el = document.getElementById("spPriority");
                if (el) el.value = cfg.priority.toLowerCase();
            }
        }
    }

    async function restoreGenerationSession(id) {
        try {
            const response = await fetch(`/api/history/${id}`);
            if (!response.ok) {
                showToast("Failed to load previous generation");
                return;
            }
            const session = await response.json();
            if (!session || !session.generatedContent) {
                showToast("Invalid session data");
                return;
            }

            // 1. Switch to generation type tab
            const type = (session.generationType || "mcq").toLowerCase().trim();
            switchGenType(type);

            // 2. Parse configuration & restore form controls
            let cfg = {};
            if (session.configuration) {
                try {
                    cfg = typeof session.configuration === "string"
                        ? JSON.parse(session.configuration)
                        : session.configuration;
                } catch (e) {
                    console.warn("Could not parse configuration JSON", e);
                }
            }
            restoreConfigControls(type, cfg);

            // 3. Display material name & badge in fileInfoRow
            if (session.materialName) {
                if (fileInfoName) fileInfoName.textContent = session.materialName;
                if (fileInfoSize) fileInfoSize.textContent = "Saved Generation";
                const ext = (session.materialType || "DOC").toLowerCase();
                if (fileBadgeText) fileBadgeText.textContent = (session.materialType || "DOC").toUpperCase();
                if (fileBadgeIcon) {
                    fileBadgeIcon.className = "file-info-icon " + ext + "-badge-icon";
                }
                if (fileInfoRow) {
                    fileInfoRow.style.display = "flex";
                    fileInfoRow.hidden = false;
                }
            }

            // 4. Parse generated content JSON
            let parsedData = null;
            try {
                parsedData = typeof session.generatedContent === "string"
                    ? JSON.parse(session.generatedContent)
                    : session.generatedContent;
            } catch (e) {
                console.error("Failed to parse generatedContent JSON", e);
                showToast("Error reading saved content");
                return;
            }

            // 5. Restore into the EXACT same generation workspace without calling Gemini
            renderBackendResult(type, { success: true, data: parsedData }, cfg);

            // 6. Close dropdown
            toggleRecentDropdown(false);

            showToast("Restored: " + (session.materialName || "Previous Generation"));
        } catch (err) {
            console.error("Error restoring session:", err);
            showToast("Failed to restore session: " + err.message);
        }
    }

    // Load recent activity count on page load
    fetchRecentActivities(true);

});