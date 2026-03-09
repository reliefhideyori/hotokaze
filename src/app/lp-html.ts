const LP_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hotokaze | LPグロース型 HP/LP制作</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&family=Noto+Sans+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --dark: #0a0c14;
      --dark2: #111827;
      --dark3: #1a2235;
      --accent: #4f9cf9;
      --accent2: #7c5cbf;
      --gold: #c8a96e;
      --text: #e8eaf0;
      --muted: #8892a4;
      --border: rgba(79,156,249,0.15);
      --wa-red: #c0392b;
      --wa-ink: #2c3e50;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      background: var(--dark);
      color: var(--text);
      font-family: 'Noto Sans JP', 'Inter', sans-serif;
      font-weight: 300;
      line-height: 1.8;
      overflow-x: hidden;
    }

    /* ── Noise texture overlay ── */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    /* ── NAV ── */
    nav {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 100;
      padding: 1.2rem 5%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(10,12,20,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }

    .logo {
      font-family: 'Inter', 'Noto Sans JP', sans-serif;
      font-size: 1.5rem;
      font-weight: 300;
      letter-spacing: 0.18em;
      background: linear-gradient(135deg, var(--accent), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo span {
      font-size: 0.6rem;
      letter-spacing: 0.25em;
      display: block;
      margin-top: -0.3rem;
      background: linear-gradient(135deg, var(--muted), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    nav ul {
      list-style: none;
      display: flex;
      gap: 2.5rem;
    }

    nav a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.82rem;
      letter-spacing: 0.1em;
      transition: color 0.3s;
    }

    nav a:hover { color: var(--accent); }

    .nav-cta {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: white !important;
      padding: 0.55rem 1.4rem;
      border-radius: 2rem;
      font-weight: 500 !important;
    }

    /* ── HAMBURGER ── */
    .nav-hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      z-index: 110;
    }

    .nav-hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-hamburger.open span:nth-child(2) { opacity: 0; }
    .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* ── HERO ── */
    #hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      padding: 8rem 5% 4rem;
      overflow: hidden;
    }

    /* Animated background grid */
    #hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(79,156,249,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(79,156,249,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
      0% { transform: translateY(0); }
      100% { transform: translateY(60px); }
    }

    /* Japanese brushstroke element - 風 */
    #hero::after {
      content: '風';
      position: absolute;
      right: 5%;
      top: 22%;
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(10rem, 20vw, 22rem);
      font-weight: 700;
      color: rgba(79,156,249,0.07);
      pointer-events: none;
      line-height: 1;
    }

    /* Japanese brushstroke element - 帆 */
    #hero .hero-kanji-sail {
      position: absolute;
      right: 20%;
      top: 48%;
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(8rem, 16vw, 18rem);
      font-weight: 700;
      color: rgba(200,169,110,0.07);
      pointer-events: none;
      line-height: 0.9;
      user-select: none;
      z-index: 0;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 820px;
    }

    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(79,156,249,0.1);
      border: 1px solid rgba(79,156,249,0.25);
      padding: 0.35rem 1rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      color: var(--accent);
      margin-bottom: 2rem;
    }

    .hero-tag::before {
      content: '';
      width: 6px; height: 6px;
      background: var(--accent);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.5); }
    }

    .hero-mission {
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(2rem, 5.5vw, 3.6rem);
      font-weight: 700;
      line-height: 1.5;
      margin-bottom: 1.8rem;
      letter-spacing: 0.04em;
    }

    .hero-mission .accent-line {
      background: linear-gradient(135deg, var(--accent), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-sub {
      color: var(--muted);
      font-size: 1.1rem;
      max-width: 580px;
      margin-bottom: 2.5rem;
      line-height: 2;
    }

    .hero-btns {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: white;
      padding: 0.9rem 2.2rem;
      border-radius: 2rem;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 4px 20px rgba(79,156,249,0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(79,156,249,0.4);
    }

    .btn-outline {
      border: 1px solid var(--border);
      color: var(--text);
      padding: 0.9rem 2.2rem;
      border-radius: 2rem;
      text-decoration: none;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      transition: border-color 0.3s, background 0.3s;
    }

    .btn-outline:hover {
      border-color: var(--accent);
      background: rgba(79,156,249,0.08);
    }

    /* Floating stats */
    .hero-stats {
      display: flex;
      gap: 1.2rem;
      margin-top: 3.5rem;
    }

    .stat-item {
      flex: 1;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.2rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.1rem;
      transition: border-color 0.3s, background 0.3s;
    }

    .stat-item:hover {
      border-color: rgba(79,156,249,0.3);
      background: rgba(79,156,249,0.04);
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .stat-icon-blue {
      background: rgba(79,156,249,0.12);
      border: 1px solid rgba(79,156,249,0.2);
    }

    .stat-icon-gold {
      background: rgba(200,169,110,0.12);
      border: 1px solid rgba(200,169,110,0.2);
    }

    .stat-body { display: flex; flex-direction: column; gap: 0.15rem; }

    .stat-num {
      font-family: 'Inter', sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1;
      background: linear-gradient(135deg, var(--accent), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text);
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    .stat-desc {
      font-size: 0.7rem;
      color: var(--muted);
      letter-spacing: 0.02em;
      margin-top: 0.1rem;
    }

    /* ── SECTION BASE ── */
    section {
      padding: 6rem 5%;
      position: relative;
    }

    .section-label {
      font-size: 0.72rem;
      letter-spacing: 0.3em;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 0.8rem;
    }

    .section-title {
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: 700;
      line-height: 1.4;
      margin-bottom: 1rem;
    }

    .section-divider {
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), var(--gold));
      margin: 1.2rem 0 2rem;
    }

    /* ── ABOUT / MISSION ── */
    #about {
      background: linear-gradient(180deg, var(--dark) 0%, var(--dark2) 100%);
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr;
      max-width: 720px;
      gap: 2rem;
    }

    .about-visual {
      position: relative;
    }

    .about-card {
      background: var(--dark3);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }

    .about-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -30%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(79,156,249,0.08), transparent);
      border-radius: 50%;
    }

    .about-card-text {
      font-size: 0.9rem;
      color: var(--muted);
      line-height: 1.9;
    }

    .about-card-text strong {
      color: var(--accent);
      font-weight: 500;
    }


    /* ── VISION CARD ── */
    .vision-card {
      background: linear-gradient(145deg, var(--dark3), rgba(26,34,53,0.8));
      border: 1px solid rgba(79,156,249,0.2);
      box-shadow: 0 0 40px rgba(79,156,249,0.06);
    }

    .vision-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.65rem;
      letter-spacing: 0.22em;
      font-weight: 700;
      color: var(--accent);
      border: 1px solid rgba(79,156,249,0.3);
      padding: 0.3rem 0.9rem;
      border-radius: 2rem;
      margin-bottom: 1.2rem;
      text-transform: uppercase;
    }

    .vision-badge::before {
      content: '';
      width: 5px; height: 5px;
      background: var(--accent);
      border-radius: 50%;
    }

    .vision-headline {
      font-family: 'Noto Serif JP', serif;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.45;
      margin-bottom: 0.9rem;
      background: linear-gradient(135deg, var(--text) 40%, var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .vision-desc {
      font-size: 0.83rem;
      color: var(--muted);
      line-height: 1.85;
      margin-bottom: 1.6rem;
    }

    .vision-roadmap {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 1.1rem 1rem;
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(79,156,249,0.1);
      border-radius: 0.9rem;
    }

    .vr-step {
      flex: 1;
      text-align: center;
    }

    .vr-icon {
      font-size: 1.25rem;
      margin-bottom: 0.35rem;
    }

    .vr-label {
      font-size: 0.68rem;
      font-weight: 500;
      color: var(--text);
      line-height: 1.4;
    }

    .vr-sub {
      font-size: 0.6rem;
      color: var(--accent);
      margin-top: 0.25rem;
      letter-spacing: 0.05em;
    }

    .vr-arrow {
      color: var(--gold);
      font-size: 0.9rem;
      flex-shrink: 0;
      opacity: 0.7;
    }

    /* mobile-only line break */
    .sp-br { display: none; }

    @media (max-width: 768px) {
      .sp-br { display: block; }
    }

    /* ── STRENGTHS ── */
    #strengths {
      background: var(--dark2);
    }

    #strengths::before {
      content: '強';
      position: absolute;
      left: 3%;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(8rem, 15vw, 18rem);
      font-weight: 700;
      color: rgba(124,92,191,0.05);
      pointer-events: none;
      line-height: 1;
    }

    .strengths-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .strength-card {
      background: var(--dark3);
      border: 1px solid var(--border);
      border-radius: 1.2rem;
      padding: 2rem;
      transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
      position: relative;
      overflow: hidden;
    }

    .strength-card:hover {
      transform: translateY(-4px);
      border-color: rgba(79,156,249,0.35);
      box-shadow: 0 12px 40px rgba(79,156,249,0.1);
    }

    .strength-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(79,156,249,0.15), rgba(124,92,191,0.15));
      border-radius: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.2rem;
      font-size: 1.3rem;
    }

    .strength-title {
      font-family: 'Noto Serif JP', serif;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.6rem;
      color: var(--text);
    }

    .strength-desc {
      font-size: 0.83rem;
      color: var(--muted);
      line-height: 1.8;
    }

    /* ── MARKET ── */
    #market {
      background: linear-gradient(180deg, var(--dark2) 0%, var(--dark) 100%);
    }

    .market-grid {
      display: grid;
      grid-template-columns: 2fr auto 3fr;
      gap: 0 2rem;
      align-items: center;
    }

    .market-vs {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      flex-shrink: 0;
      color: var(--gold);
    }

    .market-vs-arrow {
      font-size: 2.5rem;
      line-height: 1;
      color: var(--gold);
      opacity: 0.7;
    }

    .market-vs-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: var(--muted);
      text-transform: uppercase;
    }

    .market-card {
      border-radius: 1.4rem;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }

    .market-card--problem {
      background: rgba(192,57,43,0.04);
      border: 1px solid rgba(192,57,43,0.18);
    }

    .market-card--problem::before {
      content: '×';
      position: absolute;
      right: -1rem;
      bottom: -2rem;
      font-size: 12rem;
      font-weight: 900;
      color: rgba(231,76,60,0.04);
      line-height: 1;
      pointer-events: none;
    }

    .market-card--solution {
      background: linear-gradient(160deg, rgba(79,156,249,0.08) 0%, rgba(124,92,191,0.06) 100%);
      border: 1px solid rgba(79,156,249,0.25);
      box-shadow: 0 4px 40px rgba(79,156,249,0.08), 0 0 80px rgba(79,156,249,0.04);
    }

    .market-card--solution::before {
      content: '✓';
      position: absolute;
      right: -0.5rem;
      bottom: -1.5rem;
      font-size: 10rem;
      font-weight: 900;
      color: rgba(79,156,249,0.05);
      line-height: 1;
      pointer-events: none;
    }

    .market-card-head {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.8rem;
    }

    .market-badge {
      padding: 0.45rem 1.2rem;
      border-radius: 2rem;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      font-weight: 700;
    }

    .badge-problem {
      background: rgba(192,57,43,0.15);
      border: 1px solid rgba(192,57,43,0.35);
      color: #e74c3c;
    }

    .badge-solution {
      background: rgba(79,156,249,0.15);
      border: 1px solid rgba(79,156,249,0.35);
      color: var(--accent);
    }

    .market-list {
      list-style: none;
    }

    .market-list li {
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.95rem;
      display: flex;
      align-items: flex-start;
      gap: 0.9rem;
      line-height: 1.75;
    }

    .market-list--problem li {
      color: rgba(200,200,210,0.6);
    }

    .market-list--solution li {
      color: var(--text);
      font-weight: 400;
    }

    .market-icon {
      font-size: 1rem;
      flex-shrink: 0;
      margin-top: 0.25rem;
      line-height: 1.75;
    }

    .market-icon--x { color: #e74c3c; opacity: 0.7; }
    .market-icon--check { color: var(--accent); }

    /* ── SERVICES ── */
    #services {
      background: var(--dark);
    }

    #services::before {
      content: '道';
      position: absolute;
      right: 3%;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(8rem, 15vw, 18rem);
      font-weight: 700;
      color: rgba(200,169,110,0.04);
      pointer-events: none;
      line-height: 1;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .plan-card {
      background: var(--dark3);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s, border-color 0.3s;
    }

    .plan-card.featured {
      border-color: rgba(79,156,249,0.4);
      background: linear-gradient(180deg, rgba(79,156,249,0.06), var(--dark3));
      position: relative;
    }

    .plan-card.featured::before {
      content: 'STANDARD';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      padding: 0.25rem 1.2rem;
      border-radius: 0 0 0.8rem 0.8rem;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      font-weight: 700;
    }

    .plan-card:hover {
      transform: translateY(-4px);
    }

    .plan-label {
      font-size: 0.72rem;
      letter-spacing: 0.2em;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .plan-name {
      font-family: 'Noto Serif JP', serif;
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .plan-divider {
      height: 1px;
      background: var(--border);
      margin: 1rem 0;
    }

    .plan-features {
      list-style: none;
      flex: 1;
    }

    .plan-features li {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      padding: 0.5rem 0;
      font-size: 0.83rem;
      color: var(--muted);
    }

    .plan-features li::before {
      content: '→';
      color: var(--accent);
      flex-shrink: 0;
      margin-top: 0.05rem;
    }

    /* Deliverables timeline */
    .timeline {
      display: flex;
      gap: 0;
      margin-top: 3rem;
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      top: 24px;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, var(--accent), var(--gold), var(--accent2));
    }

    .timeline-item {
      flex: 1;
      text-align: center;
      position: relative;
      padding-top: 3rem;
    }

    .timeline-dot {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: 18px;
      height: 18px;
      background: var(--dark);
      border: 2px solid var(--accent);
      border-radius: 50%;
    }

    .timeline-num {
      font-family: 'Inter', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .timeline-label {
      font-size: 0.78rem;
      color: var(--muted);
      margin-top: 0.3rem;
      line-height: 1.6;
    }

    /* ── FLOW ── */
    #flow {
      background: var(--dark2);
      overflow: hidden;
      /* Remove horizontal padding so carousel uses full viewport width */
      padding-left: 0;
      padding-right: 0;
    }

    .flow-carousel {
      position: relative;
      width: 100%;
      overflow: hidden;
      padding: 2rem 0;
    }

    /*
     * Track = 2 sets × (6 items + 5 arrows) = 200vw exactly.
     * Each set fills 100vw: 6 items + 5 arrows (each 2rem) = 100vw.
     * Animation translates -100vw for seamless loop.
     * Speed 1/3 of original → 72s.
     */
    .flow-track {
      display: flex;
      gap: 0;
      width: 200vw;
      animation: flowScroll 72s linear infinite;
    }

    .flow-item {
      flex-shrink: 0;
      width: calc((100vw - 5 * 2rem) / 6);
      background: var(--dark3);
      border: 1px solid var(--border);
      border-radius: 1.2rem;
      padding: 1.4rem 1rem;
      text-align: center;
    }

    .flow-item-num {
      font-family: 'Inter', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: 0.4rem;
    }

    .flow-item-icon {
      font-size: 1.6rem;
      margin-bottom: 0.4rem;
      line-height: 1;
    }

    .flow-item-title {
      font-family: 'Noto Serif JP', serif;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 0.3rem;
    }

    .flow-item-desc {
      font-size: 0.7rem;
      color: var(--muted);
      line-height: 1.5;
    }

    .flow-arrow {
      flex-shrink: 0;
      width: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
      opacity: 0.25;
      font-size: 0.9rem;
    }

    @keyframes flowScroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-100vw); }
    }

    .flow-carousel::before,
    .flow-carousel::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 60px;
      z-index: 2;
      pointer-events: none;
    }

    .flow-carousel::before {
      left: 0;
      background: linear-gradient(90deg, var(--dark2) 0%, transparent 100%);
    }

    .flow-carousel::after {
      right: 0;
      background: linear-gradient(270deg, var(--dark2) 0%, transparent 100%);
    }

    /* ── PRICING ── */
    #pricing {
      background: var(--dark);
    }

    .lv-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .lv-card {
      background: var(--dark3);
      border: 1px solid var(--border);
      border-radius: 1.2rem;
      padding: 1.8rem;
    }

    .lv-tag {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      font-weight: 700;
      padding: 0.3rem 0.8rem;
      border-radius: 2rem;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .lv0 { background: rgba(79,156,249,0.12); color: var(--accent); }
    .lv1 { background: rgba(200,169,110,0.12); color: var(--gold); }
    .lv2 { background: rgba(124,92,191,0.12); color: #9b76e0; }

    .lv-title {
      font-family: 'Noto Serif JP', serif;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.8rem;
    }

    .lv-items {
      list-style: none;
    }

    .lv-items li {
      font-size: 0.82rem;
      color: var(--muted);
      padding: 0.35rem 0;
    }

    .lv-items li::before {
      content: '— ';
      color: var(--muted);
      opacity: 0.5;
    }

    /* ── CONTACT ── */
    #contact {
      background: linear-gradient(180deg, var(--dark) 0%, var(--dark2) 100%);
      text-align: center;
    }

    .contact-inner {
      max-width: 600px;
      margin: 0 auto;
    }

    .contact-box {
      background: var(--dark3);
      border: 1px solid var(--border);
      border-radius: 2rem;
      padding: 3.5rem;
      position: relative;
      overflow: hidden;
    }

    .contact-box::before {
      content: '';
      position: absolute;
      top: -60%;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(79,156,249,0.08), transparent);
      border-radius: 50%;
    }

    .contact-box h2 {
      font-family: 'Noto Serif JP', serif;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .contact-box p {
      font-size: 0.9rem;
      color: var(--muted);
      margin-bottom: 2rem;
      line-height: 1.9;
    }

    /* ── FOOTER ── */
    footer {
      background: var(--dark2);
      border-top: 1px solid var(--border);
      padding: 2.5rem 5%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-logo {
      font-family: 'Noto Serif JP', serif;
      font-size: 1.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .footer-copy {
      font-size: 0.75rem;
      color: var(--muted);
      letter-spacing: 0.08em;
    }

    /* ── SCROLL ANIMATIONS ── */
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }

    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {

      /* --- Nav --- */
      .nav-hamburger { display: flex; }

      nav ul {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 65px;
        left: 0;
        right: 0;
        background: rgba(10,12,20,0.97);
        backdrop-filter: blur(16px);
        padding: 1rem 2rem 1.5rem;
        gap: 0;
        border-bottom: 1px solid var(--border);
        transform: translateY(-120%);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.35s ease, opacity 0.35s ease;
        z-index: 99;
      }

      nav ul.open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
      }

      nav ul li {
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }

      nav ul li:last-child { border-bottom: none; }

      nav a {
        display: block;
        padding: 0.85rem 0;
        font-size: 0.9rem;
      }

      .nav-cta {
        display: block;
        text-align: center;
        margin-top: 0.6rem;
        padding: 0.7rem 1rem !important;
        border-radius: 2rem;
      }

      /* --- Section padding --- */
      section { padding: 4rem 5%; }

      /* --- Hero --- */
      #hero {
        padding: 7rem 5% 3.5rem;
        align-items: flex-start;
      }

      #hero::after { display: none; }
      .hero-kanji-sail { display: none; }

      .hero-mission {
        font-size: clamp(1.7rem, 7.5vw, 2.5rem);
        line-height: 1.55;
      }

      .hero-sub {
        font-size: 0.95rem;
        line-height: 1.9;
      }

      .hero-btns {
        flex-direction: column;
        gap: 0.75rem;
      }

      .hero-btns a {
        text-align: center;
      }

      .hero-stats {
        flex-direction: column;
        gap: 0.8rem;
        margin-top: 2.5rem;
      }

      .stat-item {
        flex: none;
        width: 100%;
      }

      /* --- About --- */
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      /* --- Strengths --- */
      #strengths::before { display: none; }

      .strengths-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      /* --- Market --- */
      .market-grid {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .market-card { padding: 1.8rem; }

      .market-vs {
        flex-direction: row;
        padding: 0.8rem 0;
        gap: 0.5rem;
      }

      .market-vs-arrow {
        font-size: 1.6rem;
        transform: rotate(90deg);
      }

      .market-vs-label { display: none; }

      /* --- Services --- */
      #services::before { display: none; }

      .plans-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      /* --- Timeline: vertical --- */
      .timeline {
        flex-direction: column;
        gap: 1.2rem;
      }

      .timeline::before { display: none; }

      .timeline-item {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        padding-top: 0;
        text-align: left;
        background: var(--dark3);
        border: 1px solid var(--border);
        border-radius: 1rem;
        padding: 1rem 1.5rem;
      }

      .timeline-dot { display: none; }

      .timeline-num {
        font-size: 1.6rem;
        flex-shrink: 0;
      }

      .timeline-label {
        margin-top: 0;
        line-height: 1.5;
      }

      /* --- Flow carousel --- */
      .flow-item { width: 190px; padding: 1.5rem 1.2rem; }
      .flow-carousel::before, .flow-carousel::after { width: 40px; }

      /* --- Pricing --- */
      .lv-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      /* --- Contact --- */
      .contact-box {
        padding: 2rem 1.5rem;
        border-radius: 1.5rem;
      }

      .contact-box h2 { font-size: 1.5rem; }

      /* --- Footer --- */
      footer {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .flow-item { width: 170px; padding: 1.3rem 1rem; }
      .flow-carousel::before, .flow-carousel::after { width: 24px; }

      .contact-box { padding: 1.5rem 1rem; }

      .hero-tag {
        font-size: 0.68rem;
        letter-spacing: 0.08em;
      }
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--dark); }
    ::-webkit-scrollbar-thumb { background: var(--accent2); border-radius: 2px; }
  </style>
</head>
<body>

<!-- NAV -->
<nav>
  <div class="logo">
    Hotokaze
    <span>LPGROWTH × TECHNOLOGY</span>
  </div>
  <ul id="navMenu">
    <li><a href="#about">ミッション</a></li>
    <li><a href="#strengths">強み</a></li>
    <li><a href="#market">市場課題</a></li>
    <li><a href="#pricing">プラン</a></li>
    <li><a href="/estimate" class="nav-cta">今すぐ見積もり</a></li>
  </ul>
  <button class="nav-hamburger" id="navHamburger" aria-label="メニューを開く">
    <span></span>
    <span></span>
    <span></span>
  </button>
</nav>

<!-- HERO -->
<section id="hero">
  <div class="hero-kanji-sail">帆</div>
  <div class="hero-content">
    <div class="hero-tag">AI活用 × 導線設計 × 結果コミット</div>

    <h1 class="hero-mission">
      <span class="accent-line" style="display:block;">売れるLPを、</span>
      <span style="display:block;">半分のコストで。</span>
    </h1>

    <p class="hero-sub">
      「高いお金をかけたのに、問い合わせが来ない」<br>
      LPだけでは、売れる仕組みにはなりません。<br>
      集客から問い合わせまでを丸ごと設計し、本当に売れるLPをコスパ良く。
    </p>

    <div class="hero-btns">
      <a href="/estimate" class="btn-primary">今すぐ１分で見積もり</a>
    </div>

  </div>
</section>

<!-- STRENGTHS -->
<section id="strengths">
  <div class="section-label">Our Strengths</div>
  <h2 class="section-title">事業の強み<br><span style="font-size:0.7em; color:var(--muted);">差別化ポイント</span></h2>
  <div class="section-divider"></div>

  <div class="strengths-grid fade-in">
    <div class="strength-card">
      <div class="strength-icon">🎯</div>
      <div class="strength-title">成果（CV）視点の伴走型制作</div>
      <p class="strength-desc">納品がゴールではなく、コンバージョンの最大化を目的に設計。顧客と同じゴールにフォーカスし、常に結果を求めます。</p>
    </div>

    <div class="strength-card">
      <div class="strength-icon">🔬</div>
      <div class="strength-title">ABテスト前提の運用</div>
      <p class="strength-desc">検証しやすい形で設計し、改善サイクルが回る状態を作ります。GA4・GTM・ヒートマップで数値に基づいた勝ちパターンを確立。</p>
    </div>

    <div class="strength-card">
      <div class="strength-icon">⚡</div>
      <div class="strength-title">AIで制作を加速し、戦略にコミット</div>
      <p class="strength-desc">単純な「安い」ではなく「成果を上げる体制」を作ります。浮いたリソースを戦略と検証に回し、高速で改善サイクルを実現。</p>
    </div>

    <div class="strength-card">
      <div class="strength-icon">🗺️</div>
      <div class="strength-title">導線全体を設計可能</div>
      <p class="strength-desc">LP単体だけでなく、フォームや追客などCV導線全体を最適化。一次CVから二次CVへの連携も含め、包括的に設計します。</p>
    </div>
  </div>
</section>

<!-- ABOUT / MISSION -->
<section id="about">
  <div class="section-label">Mission & Vision</div>
  <h2 class="section-title">私たちの想い・<br>事業コンセプト</h2>
  <div class="section-divider"></div>

  <div class="about-grid fade-in">
    <div>
      <p style="color:var(--muted); font-size:0.95rem; line-height:1.95; margin-bottom:1.5rem;">
        胸に秘めた「やりたいこと」に燃えている人のそばで、その熱量を共有し、可能性を最大化するために一緒に走ることが、Hotokaze の使命です。
      </p>
      <p style="color:var(--muted); font-size:0.95rem; line-height:1.95; margin-bottom:2rem;">
        顧客の情熱やアイデアを「帆」とし、私たちが提供するAIや最新技術を「風」に見立て、ビジネスの大きな変化の波にワクワクしながら共に乗っていく。
      </p>

    </div>

  </div>
</section>

<!-- MARKET -->
<section id="market">
  <div class="section-label">Market Analysis</div>
  <h2 class="section-title">市場課題と<br>解決アプローチ</h2>
  <div class="section-divider"></div>

  <div class="market-grid fade-in">
    <div class="market-card market-card--problem">
      <div class="market-card-head">
        <div class="market-badge badge-problem">従来モデル</div>
      </div>
      <ul class="market-list market-list--problem">
        <li>
          <span class="market-icon market-icon--x">✕</span>
          高い費用を払っても、完成するのは「LP1枚」など限定的
        </li>
        <li>
          <span class="market-icon market-icon--x">✕</span>
          修正にも追加費用がかかり、スピードが出ない
        </li>
        <li>
          <span class="market-icon market-icon--x">✕</span>
          ABテストや改善運用を回す余裕がなく、成果に至らない
        </li>
      </ul>
    </div>

    <div class="market-vs">
      <div class="market-vs-arrow">→</div>
      <div class="market-vs-label">vs</div>
    </div>

    <div class="market-card market-card--solution">
      <div class="market-card-head">
        <div class="market-badge badge-solution">Hotokaze のアプローチ</div>
      </div>
      <ul class="market-list market-list--solution">
        <li>
          <span class="market-icon market-icon--check">✓</span>
          AI活用でコスト・リードタイムを<strong style="color:var(--accent);">1/2以下</strong>に圧縮
        </li>
        <li>
          <span class="market-icon market-icon--check">✓</span>
          浮いたリソースを戦略と検証に回し<strong style="color:var(--accent);">高速改善</strong>を実現
        </li>
        <li>
          <span class="market-icon market-icon--check">✓</span>
          顧客と同じゴール（CV最大化）にフォーカスし<strong style="color:var(--accent);">結果を追求</strong>
        </li>
      </ul>
    </div>
  </div>

  <!-- Value Proposition - Full Width Banner -->
  <div class="fade-in" style="margin-top:4rem; margin-left:calc(-5vw); margin-right:calc(-5vw); background:linear-gradient(135deg, rgba(79,156,249,0.07) 0%, rgba(124,92,191,0.07) 50%, rgba(200,169,110,0.07) 100%); border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:4rem 5vw; text-align:center; position:relative; overflow:hidden;">
    <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(79,156,249,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,156,249,0.03) 1px, transparent 1px); background-size:40px 40px; pointer-events:none;"></div>
    <p style="font-family:'Noto Serif JP',serif; font-size:clamp(1.5rem,4vw,3rem); font-weight:700; line-height:1.5; position:relative; z-index:1;">
      「作って終わり」から<br>
      <span style="background:linear-gradient(135deg,var(--accent),var(--gold)); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">「最速で改善し、確実に成果」へ。</span>
    </p>
    <p style="font-size:clamp(0.9rem,1.5vw,1.15rem); color:var(--muted); margin-top:1.2rem; letter-spacing:0.05em; position:relative; z-index:1;">CVの定義 〜 導線設計 〜 計測<br class="sp-br">〜 ABテストを一気通貫で設計</p>
  </div>
</section>


<!-- FLOW -->
<section id="flow">
  <div class="section-label">Meeting Flow</div>
  <h2 class="section-title">はじめての打合せ<br><span style="font-size:0.7em; color:var(--muted);">約60分 ／ オンライン対応可</span></h2>
  <div class="section-divider"></div>

  <div class="flow-carousel">
    <div class="flow-track">
      <!-- 1st set -->
      <div class="flow-item">
        <div class="flow-item-num">STEP 01</div>
        <div class="flow-item-icon">🤝</div>
        <div class="flow-item-title">ビジョン共有</div>
        <p class="flow-item-desc">やりたいことや目指す姿を共有</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 02</div>
        <div class="flow-item-icon">🔍</div>
        <div class="flow-item-title">現状ヒアリング</div>
        <p class="flow-item-desc">ターゲット・競合・強みを整理</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 03</div>
        <div class="flow-item-icon">🎯</div>
        <div class="flow-item-title">目標設定</div>
        <p class="flow-item-desc">成果の定義とゴールを決定</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 04</div>
        <div class="flow-item-icon">🗺️</div>
        <div class="flow-item-title">改善設計</div>
        <p class="flow-item-desc">離脱ポイントを特定し優先順位化</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 05</div>
        <div class="flow-item-icon">📋</div>
        <div class="flow-item-title">プラン提案</div>
        <p class="flow-item-desc">進め方・費用・スケジュールを提示</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 06</div>
        <div class="flow-item-icon">🚀</div>
        <div class="flow-item-title">スタート</div>
        <p class="flow-item-desc">契約条件を確定し制作開始</p>
      </div>
      <div class="flow-arrow" style="margin-right:1rem;">→</div>
      <!-- 2nd set (duplicate for seamless loop) -->
      <div class="flow-item">
        <div class="flow-item-num">STEP 01</div>
        <div class="flow-item-icon">🤝</div>
        <div class="flow-item-title">ビジョン共有</div>
        <p class="flow-item-desc">やりたいことや目指す姿を共有</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 02</div>
        <div class="flow-item-icon">🔍</div>
        <div class="flow-item-title">現状ヒアリング</div>
        <p class="flow-item-desc">ターゲット・競合・強みを整理</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 03</div>
        <div class="flow-item-icon">🎯</div>
        <div class="flow-item-title">目標設定</div>
        <p class="flow-item-desc">成果の定義とゴールを決定</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 04</div>
        <div class="flow-item-icon">🗺️</div>
        <div class="flow-item-title">改善設計</div>
        <p class="flow-item-desc">離脱ポイントを特定し優先順位化</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 05</div>
        <div class="flow-item-icon">📋</div>
        <div class="flow-item-title">プラン提案</div>
        <p class="flow-item-desc">進め方・費用・スケジュールを提示</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">
        <div class="flow-item-num">STEP 06</div>
        <div class="flow-item-icon">🚀</div>
        <div class="flow-item-title">スタート</div>
        <p class="flow-item-desc">契約条件を確定し制作開始</p>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section id="pricing">
  <div class="section-label">Pricing Structure</div>
  <h2 class="section-title">価格の考え方<br><span style="font-size:0.7em; color:var(--muted);">透明な開発Lv分け</span></h2>
  <div class="section-divider"></div>

  <p style="color:var(--muted); font-size:0.9rem; margin-bottom:2.5rem; max-width:600px;">
    価格は基本的に同一。変動するのは、導線設計の際に必要となる追加開発がある場合のみ。開発内容をLvで透明化し、追加条件を事前に明示します。
  </p>

  <div class="lv-grid fade-in">
    <div class="lv-card">
      <span class="lv-tag lv0">Lv 0</span>
      <div class="lv-title">追加なし（標準）</div>
      <ul class="lv-items">
        <li>通常LP制作・修正</li>
        <li>フォーム設置・最適化</li>
        <li>計測設計（GA4/GTM）</li>
        <li>CV導線設計</li>
      </ul>
    </div>

    <div class="lv-card">
      <span class="lv-tag lv1">Lv 1</span>
      <div class="lv-title">既存ツール連携</div>
      <ul class="lv-items">
        <li>既存ツールの標準API連携</li>
        <li>予約システム連携</li>
        <li>外部サービスとのデータ連携</li>
      </ul>
    </div>

    <div class="lv-card">
      <span class="lv-tag lv2">Lv 2</span>
      <div class="lv-title">カスタム実装（別途見積）</div>
      <ul class="lv-items">
        <li>体験型アプリ・複雑UI</li>
        <li>会員機能・本人確認</li>
        <li>決済システム実装</li>
        <li>複雑なフォーム分岐</li>
      </ul>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact">
  <div class="contact-inner">
    <div class="section-label" style="text-align:center;">Contact</div>
    <div class="contact-box fade-in">
      <h2>一緒に、新しい海へ</h2>
      <p>
        あなたの熱量と事業を理解した上で、<br>
        最適な3ヶ月のロードマップをご提案します。
      </p>
      <a href="/estimate" class="btn-primary" style="display:inline-block;">
        今すぐ１分で見積もり
      </a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">Hotokaze</div>
  <div class="footer-copy">© 2025 Hotokaze. All rights reserved.</div>
</footer>

<script>
  // Hamburger menu
  const hamburger = document.getElementById('navHamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Smooth nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top < 100) current = section.id;
    });

    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--accent)'
        : '';
    });
  });

  // Counter animation for stats
  document.querySelectorAll('.stat-num').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'all 0.6s ease';
  });

  setTimeout(() => {
    document.querySelectorAll('.stat-num').forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 150);
    });
  }, 800);
</script>
</body>
</html>
`;

export default LP_HTML;
