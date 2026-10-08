<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en" data-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="PrepPilot — Turn Your Notes into Exam-Ready Preparation. Upload study material and generate MCQs, Flashcards, Mind Maps, Theory Questions, and Study Plans instantly.">
    <title>PrepPilot | Exam-Ready Preparation</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/preppilot.css">
</head>

<body>

    <!-- ===================== HEADER ===================== -->

    <header class="topbar" role="banner">
        <div class="brand">
            <div class="brand-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
            </div>
            <div class="brand-text">
                <div class="brand-name">PrepPilot</div>
                <div class="brand-subtitle">Turn Your Notes into Exam-Ready Preparation</div>
            </div>
        </div>

        <div class="header-right">
            <!-- Recent Activity Trigger & Dropdown -->
            <div class="recent-activity-wrap" id="recentActivityWrap">
                <button class="recent-activity-btn" id="recentActivityBtn" type="button" aria-expanded="false" aria-haspopup="true" title="Recent Activity">
                    <svg class="recent-activity-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Recent Activity</span>
                    <svg class="recent-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>

                <!-- Dropdown panel directly below it -->
                <div class="recent-activity-dropdown" id="recentActivityDropdown" role="menu" aria-label="Recent Activity History" hidden>
                    <div class="recent-dropdown-header">
                        <div class="recent-dropdown-title-group">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <h3>Recent Activity</h3>
                        </div>
                        <span class="recent-count-badge" id="recentCountBadge">0</span>
                    </div>

                    <div class="recent-activity-list" id="recentActivityList" role="none">
                        <!-- Populated dynamically via JS from /api/history -->
                    </div>
                </div>
            </div>

            <button class="theme-toggle" id="themeToggle" type="button" title="Toggle theme" aria-label="Toggle dark mode">
                <span class="theme-icon-sun" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                </span>
                <span class="theme-icon-moon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </span>
            </button>
            <span class="header-tagline">Study Smarter. Achieve More.</span>
        </div>
    </header>


    <!-- ===================== MAIN WORKSPACE ===================== -->

    <main class="main-workspace" role="main">

        <!-- ============= LEFT COLUMN ============= -->

        <section class="left-panel" aria-label="Study material configuration">

            <!-- STEP 1: UPLOAD CARD -->
            <div class="panel-card" id="uploadCard">
                <div class="step-header">
                    <div class="step-title-group">
                        <span class="step-badge" aria-label="Step 1">1</span>
                        <h2>Upload Your Study Material</h2>
                    </div>
                    <span class="step-support-text">Supports PDF, DOCX, TXT</span>
                </div>

                <!-- Drop zone -->
                <div class="upload-zone" id="uploadZone" role="button" tabindex="0" aria-label="Upload area. Click or drag and drop a file here.">
                    <div class="upload-zone-inner">
                        <div class="upload-icon-wrap" aria-hidden="true">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                        </div>

                        <p class="upload-primary-text">Drag &amp; drop your file here</p>
                        <p class="upload-or-text">or</p>

                        <label for="fileInput" class="choose-file-btn" role="button">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                            </svg>
                            Choose File
                        </label>

                        <input type="file" id="fileInput" accept=".pdf,.docx,.txt" hidden aria-label="Choose a file to upload">

                        <div class="upload-type-badges" aria-label="Supported file types">
                            <span class="type-badge pdf">PDF</span>
                            <span class="type-badge docx">DOCX</span>
                            <span class="type-badge txt">TXT</span>
                        </div>
                    </div>
                </div>

                <!-- File info row (hidden by default) -->
                <div class="file-info-row" id="fileInfoRow" style="display: none;">
                    <div class="file-info-icon pdf-badge-icon" id="fileBadgeIcon" aria-hidden="true">
                        <span id="fileBadgeText">PDF</span>
                    </div>
                    <div class="file-info-text">
                        <span class="file-info-name" id="fileInfoName"></span>
                        <span class="file-info-size" id="fileInfoSize"></span>
                    </div>
                    <button class="file-remove-btn" id="fileRemoveBtn" type="button" title="Remove file" aria-label="Remove selected file">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>


            <!-- STEP 2: SELECT WHAT TO GENERATE CARD -->
            <div class="panel-card" id="selectCard">
                <div class="step-header">
                    <div class="step-title-group">
                        <span class="step-badge" aria-label="Step 2">2</span>
                        <h2>Select What to Generate</h2>
                    </div>
                </div>

                <!-- 5-Item Row -->
                <div class="generation-grid" role="radiogroup" aria-label="Generation type">

                    <!-- MCQs -->
                    <button class="gen-option active" data-type="mcq" type="button" role="radio" aria-checked="true" id="genOptMcq">
                        <div class="gen-option-check" aria-hidden="true">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div class="gen-option-icon mcq-icon" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                            </svg>
                        </div>
                        <span class="gen-option-label">MCQs</span>
                        <span class="gen-option-sub">Practice and test your knowledge</span>
                    </button>

                    <!-- Flashcards -->
                    <button class="gen-option" data-type="flashcards" type="button" role="radio" aria-checked="false" id="genOptFlashcards">
                        <div class="gen-option-check" aria-hidden="true">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div class="gen-option-icon flashcard-icon" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>
                        <span class="gen-option-label">Flashcards</span>
                        <span class="gen-option-sub">Quick revision made easy</span>
                    </button>

                    <!-- Mind Maps -->
                    <button class="gen-option" data-type="mindmap" type="button" role="radio" aria-checked="false" id="genOptMindmap">
                        <div class="gen-option-check" aria-hidden="true">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div class="gen-option-icon mindmap-icon" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/>
                                <circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/>
                                <line x1="9.5" y1="10.5" x2="5.5" y2="7.5"/><line x1="14.5" y1="10.5" x2="18.5" y2="7.5"/>
                                <line x1="9.5" y1="13.5" x2="5.5" y2="16.5"/><line x1="14.5" y1="13.5" x2="18.5" y2="16.5"/>
                            </svg>
                        </div>
                        <span class="gen-option-label">Mind Maps</span>
                        <span class="gen-option-sub">Visualize key concepts</span>
                    </button>

                    <!-- Theory Questions -->
                    <button class="gen-option" data-type="theory" type="button" role="radio" aria-checked="false" id="genOptTheory">
                        <div class="gen-option-check" aria-hidden="true">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div class="gen-option-icon theory-icon" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                        </div>
                        <span class="gen-option-label">Theory Questions</span>
                        <span class="gen-option-sub">Prepare for descriptive exams</span>
                    </button>

                    <!-- Study Plan -->
                    <button class="gen-option" data-type="studyplan" type="button" role="radio" aria-checked="false" id="genOptStudyplan">
                        <div class="gen-option-check" aria-hidden="true">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div class="gen-option-icon studyplan-icon" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>
                        <span class="gen-option-label">Study Plan</span>
                        <span class="gen-option-sub">Organize your preparation</span>
                    </button>

                </div>
            </div>


            <!-- STEP 3: CONFIGURE CARD -->
            <div class="panel-card" id="configCard">
                <div class="step-header">
                    <div class="step-title-group">
                        <span class="step-badge" aria-label="Step 3">3</span>
                        <h2 id="configTitle">Configure MCQ Generation</h2>
                    </div>
                </div>

                <!-- MCQ CONFIG -->
                <div class="config-panel active" id="mcqConfig" aria-label="MCQ configuration">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="mcqCount">Number of Questions</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                <select id="mcqCount" aria-label="Number of MCQ questions">
                                    <option value="5">5</option>
                                    <option value="10" selected>10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-field">
                            <label for="mcqDifficulty">Difficulty Level</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                <select id="mcqDifficulty" aria-label="MCQ difficulty level">
                                    <option value="easy">Easy</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="mcqQuestionType">Question Type</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                <select id="mcqQuestionType" aria-label="MCQ question type">
                                    <option value="concept">Concept Based</option>
                                    <option value="application">Application Based</option>
                                    <option value="mixed" selected>Mixed (Concept + Application)</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-field">
                            <label>Include Explanations</label>
                            <div class="toggle-box">
                                <div class="toggle-box-left">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D69E4B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    <label class="toggle-switch" aria-label="Include explanations toggle">
                                        <input type="checkbox" id="mcqExplanations" checked>
                                        <span class="toggle-track">
                                            <span class="toggle-thumb"></span>
                                        </span>
                                    </label>
                                </div>
                                <span class="toggle-status-text">Yes, show explanations</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FLASHCARD CONFIG -->
                <div class="config-panel" id="flashcardsConfig" aria-label="Flashcards configuration">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="fcCount">Number of Cards</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                                <select id="fcCount" aria-label="Number of flashcards">
                                    <option value="5">5</option>
                                    <option value="10" selected>10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-field">
                            <label for="fcDifficulty">Difficulty Level</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                <select id="fcDifficulty" aria-label="Flashcard difficulty level">
                                    <option value="easy">Easy</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="fcStyle">Card Style</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                <select id="fcStyle" aria-label="Flashcard style">
                                    <option value="qa" selected>Question &amp; Answer</option>
                                    <option value="cd">Concept &amp; Definition</option>
                                    <option value="te">Term &amp; Explanation</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MIND MAP CONFIG -->
                <div class="config-panel" id="mindmapConfig" aria-label="Mind map configuration">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="mmDetail">Detail Level</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/></svg>
                                <select id="mmDetail" aria-label="Mind map detail level">
                                    <option value="basic">Basic</option>
                                    <option value="detailed" selected>Detailed</option>
                                    <option value="comprehensive">Comprehensive</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-field">
                            <label for="mmOrg">Organization Style</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>
                                <select id="mmOrg" aria-label="Mind map organization style">
                                    <option value="topic" selected>Topic Based</option>
                                    <option value="hierarchical">Hierarchical</option>
                                    <option value="concept">Concept Based</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- THEORY CONFIG -->
                <div class="config-panel" id="theoryConfig" aria-label="Theory questions configuration">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="thCount">Number of Questions</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>
                                <select id="thCount" aria-label="Number of theory questions">
                                    <option value="5">5</option>
                                    <option value="10" selected>10</option>
                                    <option value="15">15</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-field">
                            <label for="thDifficulty">Difficulty Level</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                <select id="thDifficulty" aria-label="Theory question difficulty level">
                                    <option value="easy">Easy</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="thType">Question Type</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                                <select id="thType" aria-label="Theory question type">
                                    <option value="short" selected>Short Answer</option>
                                    <option value="long">Long Answer</option>
                                    <option value="mixed">Mixed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STUDY PLAN CONFIG -->
                <div class="config-panel" id="studyplanConfig" aria-label="Study plan configuration">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="spExamDate">Exam Date</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <input type="date" id="spExamDate" aria-label="Exam date">
                            </div>
                        </div>
                        <div class="form-field">
                            <label for="spDailyTime">Daily Study Time</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <select id="spDailyTime" aria-label="Daily study time">
                                    <option value="1">1 hour</option>
                                    <option value="2" selected>2 hours</option>
                                    <option value="3">3 hours</option>
                                    <option value="4">4+ hours</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="spPriority">Priority / Focus</label>
                            <div class="select-wrap">
                                <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                <select id="spPriority" aria-label="Study plan priority">
                                    <option value="balanced">Balanced</option>
                                    <option value="weak" selected>Weak Topics First</option>
                                    <option value="high">High Weightage Topics</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- GENERATE BUTTON -->
                <button class="generate-btn" id="generateBtn" type="button" aria-label="Generate content">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                        <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"/>
                    </svg>
                    <span id="generateBtnText">Generate MCQs</span>
                </button>

                <p class="generate-note">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    Your file will be processed securely. This may take a few seconds.
                </p>

            </div>

        </section>


        <!-- ============= RIGHT COLUMN ============= -->

        <section class="right-panel" aria-label="Generated content">

            <div class="results-card panel-card">

                <!-- Results header -->
                <div class="results-header" id="resultsHeader">
                    <div class="results-header-left">
                        <div class="results-icon" aria-hidden="true" id="resultsIcon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                            </svg>
                        </div>
                        <div>
                            <h2 id="resultTitle">Generated MCQs</h2>
                            <p id="resultSubtitle">Here are your AI-generated multiple choice questions based on your material.</p>
                        </div>
                    </div>
                    <div class="result-action-btns" id="resultActionBtns" style="display: none;">
                        <button class="result-action-btn" id="downloadBtn" type="button" title="Download" aria-label="Download content">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download
                        </button>
                        <button class="result-action-btn" id="copyBtn" type="button" title="Copy all" aria-label="Copy all content">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            Copy All
                        </button>
                        <button class="result-action-btn" id="regenerateBtn" type="button" title="Regenerate" aria-label="Regenerate content">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                            Regenerate
                        </button>
                    </div>
                </div>

                <!-- EMPTY STATE (Visible by default until content is generated) -->
                <div class="empty-state" id="emptyState" role="status" aria-live="polite">
                    <div class="empty-icon-wrap" aria-hidden="true">
                        <div class="empty-icon-bg">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                        </div>
                    </div>
                    <h3>Your generated content will appear here</h3>
                    <p>Upload your study material, select a generation type, configure the options, and click Generate.</p>
                    <div class="empty-steps">
                        <div class="empty-step">
                            <span class="empty-step-num">1</span>
                            <span>Upload material</span>
                        </div>
                        <div class="empty-step-arrow" aria-hidden="true">→</div>
                        <div class="empty-step">
                            <span class="empty-step-num">2</span>
                            <span>Choose type</span>
                        </div>
                        <div class="empty-step-arrow" aria-hidden="true">→</div>
                        <div class="empty-step">
                            <span class="empty-step-num">3</span>
                            <span>Generate</span>
                        </div>
                    </div>
                </div>

                <!-- GENERATED OUTPUT (Populated dynamically by AI) -->
                <div class="generated-output" id="generatedOutput" role="region" aria-label="Generated output" aria-live="polite"></div>

            </div>

        </section>

    </main>

    <!-- Application Script -->
    <script src="${pageContext.request.contextPath}/js/preppilot.js"></script>

</body>
</html>