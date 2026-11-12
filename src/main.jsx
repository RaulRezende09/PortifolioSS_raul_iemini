import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createRoot } from "react-dom/client";

/* ---------- Conteúdo (currículo + GitHub) ---------- */
const PERSON = {
  name1: "Raul Rezende",
  name2: "Iemini Aguiar",
  role: "Desenvolvedor full-stack",
  email: "raurede21@gmail.com",
  phone: "+55 35 99938-4847",
  linkedin: "https://www.linkedin.com/in/raul-iemini/",
  github: "https://github.com/RaulRezende09",
  demo: "https://ground-station-dashboard-9tc8.onrender.com",
};

const CV_URL = "/Curriculo_Raul_Rezende_Iemini_Aguiar.pdf";
const CV_NAME = "Curriculo_Raul_Rezende_Iemini_Aguiar.pdf";

const PROJECTS = [
  {
    id: "gsd", short: "Ground Station", name: "Ground Station Dashboard",
    kind: "Projeto pessoal, em evolução", flagship: true,
    summary: "Rastreador de satélites construído do zero: posição ao vivo via SGP4, ground track e footprint de visibilidade num mapa interativo.",
    readouts: [["Desvio vs. python-sgp4", "~0,7 m"], ["Atualização de TLEs", "a cada 2 h"], ["Releases no ar", "2 de 4"]],
    bullets: [
      "Propagação orbital com Orekit, biblioteca de mecânica orbital usada em contextos ESA/CNES.",
      "Backend em Java 21 e Spring Boot 4 com cache Caffeine; frontend em React, TypeScript e MapLibre.",
      "Deploy único em Docker no Render, com GitHub Actions atualizando os TLEs automaticamente.",
    ],
    stack: ["Java 21", "Spring Boot 4", "Orekit", "React", "TypeScript", "Vite", "Tailwind", "MapLibre", "Docker", "GitHub Actions"],
    links: [["Abrir demo ao vivo", "https://ground-station-dashboard-9tc8.onrender.com"], ["Ver código", "https://github.com/RaulRezende09/ground-station-dashboard"]],
    orbit: { a: 0.95, tilt: 0.36, rot: -0.26, phase: 0.6 },
  },
  {
    id: "arq", short: "Gestão Arquitetos", name: "Gestão de Projetos Arquitetônicos",
    kind: "Projeto pessoal, SaaS estilo Kanban",
    summary: "MVP completo de gestão para escritórios de arquitetura: quadro Kanban por projeto, etapas com prazos e dependências entre si.",
    readouts: [["Access token", "30 min"], ["Refresh token", "7 dias, rotativo"], ["Aviso de prazo", "3 dias antes"]],
    bullets: [
      "Quando uma etapa atrasa, o atraso é recalculado e propagado para as etapas dependentes.",
      "JWT com refresh rotativo, hash bcrypt, rate limiting e isolamento multi-tenant.",
      "API em FastAPI e Pydantic v2 com Swagger; PostgreSQL com SQLAlchemy 2 e Alembic.",
      "Docker Compose e deploy self-hosted com Caddy e HTTPS.",
    ],
    stack: ["Python", "FastAPI", "SQLAlchemy 2", "Alembic", "PostgreSQL", "JWT", "Vue 3", "Docker", "Caddy"],
    links: [["Ver código", "https://github.com/RaulRezende09/Gestao-Arquitetos"]],
    orbit: { a: 0.84, tilt: 0.42, rot: 0.3, phase: 3.4 },
  },
  {
    id: "futurevet", short: "FutureVet", name: "FutureVet", team: "Challenge FIAP 2026 com a Clyvo Vet, equipe de 5 pessoas",
    kind: "Projeto em equipe, Challenge FIAP",
    summary: "Plataforma de gestão veterinária: o tutor agenda consultas, acompanha a carteira de vacinação e recebe avisos da clínica.",
    readouts: [["Equipe", "5 pessoas"], ["Telas", "16"], ["Idiomas", "pt-BR e en"]],
    mine: [
      "Integrei à main a entrega de Banco de Dados da Sprint 4: endpoints que chamam pacotes PL/SQL no Oracle.",
    ],
    bullets: [
      "Agenda que impede conflito de horário, mesmo com dois pedidos simultâneos.",
      "Notificações por RabbitMQ, publicadas só depois do commit da transação.",
      "Assistente de IA em microsserviço Spring AI, chamado via OpenFeign e descoberto pelo Eureka.",
      "Oracle 19c com migrations Flyway, Spring Security com dois perfis e API REST para o app mobile.",
    ],
    stack: ["Java", "Spring Boot", "Thymeleaf", "Oracle 19c", "Flyway", "RabbitMQ", "Spring AI", "Eureka", "OpenFeign"],
    links: [["Abrir aplicação", "https://challenge-sprint3-java.onrender.com"], ["Ver código", "https://github.com/joaocaetano1310/Challenge_Sprint4_Java"]],
    orbit: { a: 0.72, tilt: 0.38, rot: 0.5, phase: 1.2 },
  },
  {
    id: "jornada", short: "Jornada DEV", name: "Jornada DEV",
    kind: "Programa START, TOTVS Paulista",
    summary: "Exercícios e projetos do programa de formação da TOTVS Paulista, organizados por módulo.",
    readouts: [["Módulos", "7"], ["Commits", "21"]],
    bullets: [
      "Um diretório por módulo do curso, mais uma pasta de testes.",
      "O GitHub classifica o código como xBase, a família de linguagens do ecossistema TOTVS.",
    ],
    stack: ["xBase", "Git", "GitHub"],
    links: [["Ver código", "https://github.com/RaulRezende09/jornadadev"]],
    orbit: { a: 0.53, tilt: 0.3, rot: -0.5, phase: 5.2 },
  },
  {
    id: "equ", short: "Equilibra", name: "Equilibra",
    kind: "Projeto acadêmico, FIAP",
    summary: "Aplicação desktop para gestão de tarefas e usuários, com interface gráfica em PyQt5.",
    bullets: [
      "CRUD completo de tarefas e usuários.",
      "Persistência em Oracle Database.",
      "Consumo de API externa e exportação dos dados em JSON.",
    ],
    stack: ["Python", "PyQt5", "Oracle Database", "APIs REST"],
    links: [["Ver código", "https://github.com/RaulRezende09/Equilibra-Python-Desktop"]],
    orbit: { a: 0.45, tilt: 0.4, rot: 0.12, phase: 1.9 },
  },
  {
    id: "cursotec", short: "CursoTec", name: "CursoTec, API de gestão acadêmica", team: "Checkpoint FIAP, equipe de 3 pessoas",
    kind: "Projeto em equipe, FIAP",
    summary: "API REST para gerenciar alunos, professores, cursos, turmas e aulas, feita em .NET 10 com Clean Architecture.",
    readouts: [["Commits meus", "13"], ["Versões da API", "v1 e v2"], ["Bancos", "SQLite e MongoDB"]],
    mine: [
      "Paginação no repositório genérico, com teste do cálculo de totalPages.",
      "Versionamento da listagem de cursos: v1 marcada como obsoleta e v2 paginada.",
      "Rate limit e Swagger separado por versão da API.",
      "Evidências de teste (erros 400 e 429) e revisão do README.",
    ],
    bullets: [
      "Entity Framework Core com SQLite e repositório genérico; MongoDB guarda o histórico de recomendação.",
      "Autenticação JWT com perfis, health check, logs estruturados e tratamento global de erros.",
      "Testes automatizados com xUnit e Moq.",
    ],
    stack: ["C#", ".NET 10", "EF Core", "SQLite", "MongoDB", "JWT", "Swagger", "xUnit", "Moq"],
    links: [["Ver código", "https://github.com/joaocaetano1310/CP_CursoTec"]],
    orbit: { a: 0.62, tilt: 0.34, rot: -0.12, phase: 4.3 },
  },
  {
    id: "health", short: "Health Analytics", name: "Health Analytics Database",
    kind: "Projeto acadêmico, FIAP",
    summary: "Modelo físico de banco de dados relacional para um cenário de análise de dados em saúde.",
    bullets: [
      "Modelagem relacional completa em Oracle.",
      "Consultas SQL para extrair indicadores de saúde.",
    ],
    stack: ["SQL", "Oracle", "Modelagem de dados"],
    links: [["Ver código", "https://github.com/RaulRezende09/Health-Analytics-Database"]],
    orbit: { a: 0.29, tilt: 0.36, rot: -0.35, phase: 0.2 },
  },
];
PROJECTS.forEach(p => { p.orbit.period = 95 * Math.pow(p.orbit.a, 1.5); });

const TIMELINE = [
  { when: "2 anos, concluído", title: "Técnico em Tecnologia da Informação", where: "Senac, Minas Gerais", text: "Formação presencial que deu a base em TI, de manutenção de computadores à lógica de programação." },
  { when: "Em curso", title: "Tecnólogo em Análise e Desenvolvimento de Sistemas", where: "FIAP, São Paulo", text: "Projetos acadêmicos em Java, C#/.NET, Python, Oracle, React e React Native." },
  { when: "Mar a abr de 2026", title: "Suporte ao cliente", where: "Concentrix, São Paulo", text: "Atendimento e suporte técnico ao usuário final: comunicação, resolução de problemas e relacionamento." },
  { when: "Jul de 2026", title: "Programa START, Tecnologia e Dev", where: "TOTVS Paulista, 20 h", text: "Formação em desenvolvimento no ecossistema TOTVS, registrada no repositório Jornada DEV." },
  { when: "Agora", title: "Ground Station Dashboard em produção", where: "Projeto pessoal", text: "Releases v0.1 e v0.2 no ar, com roadmap de quatro releases para o rastreador de satélites.", live: true },
  { when: "Dez de 2026", title: "Conclusão da graduação", where: "FIAP", text: "Próxima manobra: formatura em ADS e entrada num time de desenvolvimento.", next: true },
];

const SKILLS = [
  { id: "back", name: "Back-end", center: [200, 170], items: ["C#", ".NET", "Java", "Spring Boot", "Python", "FastAPI", "Arquitetura em camadas"] },
  { id: "front", name: "Front-end", center: [520, 150], items: ["HTML5", "CSS", "JavaScript", "TypeScript", "React", "Vue.js", "React Native", "Tailwind"] },
  { id: "data", name: "Dados", center: [830, 220], items: ["SQL", "PostgreSQL", "Oracle Database", "Modelagem de dados", "APIs REST", "CRUD"] },
  { id: "tools", name: "Ferramentas", center: [330, 460], items: ["Git", "GitHub", "Docker", "GitHub Actions", "Entity Framework", "SQLAlchemy", "Alembic", "JWT", "Orekit"] },
  { id: "design", name: "Design e produto", center: [730, 455], items: ["UX/UI", "Figma", "Análise de requisitos", "Usabilidade", "Design responsivo", "Documentação"] },
];

const BADGES = [
  { ring: "FIAP QUALIFIED", bottom: "SELO PRATA 2025", center: "Web 2.0", glyph: "code", tone: "#C9D1E3", title: "Qualificação Profissional em Desenvolvimento e Designer Web 2.0", meta: "FIAP Qualified, 2025, selo prata" },
  { ring: "FIAP QUALIFIED", bottom: "SELO PRATA 2025", center: "Sistemas", glyph: "grid", tone: "#C9D1E3", title: "Qualificação Profissional em Análise de Sistemas e Prototipação Web", meta: "FIAP Qualified, 2025, selo prata" },
  { ring: "EF SET ENGLISH", bottom: "SCORE 70 / 100", center: "C1", glyph: "wave", tone: "#86E1F0", title: "EF SET English Certificate", meta: "Nível C1 avançado, nota 70/100" },
  { ring: "TOTVS PAULISTA", bottom: "JUL 2026  20H", center: "START", glyph: "rocket", tone: "#FFB347", title: "Programa START: Tecnologia e Dev", meta: "TOTVS Paulista, julho de 2026, 20 horas" },
];

const COURSES = [
  { from: "FIAP Nano Courses", items: ["DevOps", "Cybersecurity", "Algoritmos: aprenda a programar", "Inteligência Artificial e Computacional", "Formação Social e Sustentabilidade"] },
  { from: "Alura", items: ["Figma AI, prototipagem e componentes de interface (4 cursos)", "PHP: conceitos, lidando com dados, loops e mais"] },
];

const LANGS = [
  { name: "Português", level: "Nativo", bars: 5 },
  { name: "Inglês", level: "Avançado, C1 (EF SET 70/100)", bars: 4 },
  { name: "Espanhol", level: "Básico", bars: 1 },
];

/* ---------- Utilidades ---------- */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
/* Animações ligadas por padrão; o visitante pode pausar pelo botão da barra (fica salvo neste navegador). */
let MOTION_OFF = (() => { try { return localStorage.getItem("motion") === "off"; } catch (e) { return false; } })();
document.documentElement.classList.toggle("motion-off", MOTION_OFF);
const prefersReduced = () => MOTION_OFF;
function setMotionOff(off) {
  MOTION_OFF = off;
  try { localStorage.setItem("motion", off ? "off" : "on"); } catch (e) {}
  document.documentElement.classList.toggle("motion-off", off);
  window.dispatchEvent(new Event("motion-change"));
}
function useMotionOff() {
  const [m, setM] = useState(MOTION_OFF);
  useEffect(() => { const h = () => setM(MOTION_OFF); window.addEventListener("motion-change", h); return () => window.removeEventListener("motion-change", h); }, []);
  return m;
}

function useUtcClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return now.toISOString().slice(11, 19);
}

/* ---------- Céu de fundo ---------- */
function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth, h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr; c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const rnd = mulberry32(42);
      // faixa da Via Láctea
      const g = ctx.createLinearGradient(0, h, w, 0);
      g.addColorStop(0, "rgba(134,225,240,0)"); g.addColorStop(0.5, "rgba(134,225,240,0.045)"); g.addColorStop(1, "rgba(134,225,240,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const n = Math.round(w * h / 2600);
      for (let i = 0; i < n; i++) {
        const x = rnd() * w, y = rnd() * h, r = rnd() < 0.93 ? rnd() * 0.8 + 0.2 : rnd() * 0.9 + 0.9;
        ctx.fillStyle = `rgba(237,230,211,${(0.2 + rnd() * 0.6).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // densidade extra ao longo da faixa diagonal
      for (let i = 0; i < n * 0.8; i++) {
        const t = rnd(); const off = (rnd() + rnd() + rnd() - 1.5) * h * 0.18;
        const x = t * w + off * 0.6, y = h - t * h + off;
        ctx.fillStyle = `rgba(237,230,211,${(0.08 + rnd() * 0.3).toFixed(2)})`;
        ctx.fillRect(x, y, 0.8, 0.8);
      }
    }
    draw();
    let tm; const onR = () => { clearTimeout(tm); tm = setTimeout(draw, 150); };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />;
}

/* ---------- Sistema orbital (projetos) ---------- */
function OrbitSystem({ selected, onSelect }) {
  const wrapRef = useRef(null), canvasRef = useRef(null);
  const live = useRef({ selected, hovered: null });
  live.current.selected = selected;
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current, ctx = canvas.getContext("2d");
    let clock = 0, last = performance.now();
    let w = 0, h = 0, cx = 0, cy = 0, scale = 1, R = 20, raf = 0, visible = true;
    let sats = [];

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth; h = wrap.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2; cy = h / 2;
      let maxHW = 0, maxHH = 0;
      PROJECTS.forEach(({ orbit: o }) => {
        const a = o.a, b = o.a * o.tilt, c = Math.cos(o.rot), s = Math.sin(o.rot);
        maxHW = Math.max(maxHW, Math.sqrt(a * a * c * c + b * b * s * s));
        maxHH = Math.max(maxHH, Math.sqrt(a * a * s * s + b * b * c * c));
      });
      const padX = w < 520 ? 18 : 60, padY = 40;
      scale = Math.min((w / 2 - padX) / maxHW, (h / 2 - padY) / maxHH);
      R = Math.max(18, scale * 0.15);
    }

    function satPos(o, t) {
      const th = o.phase + (Math.PI * 2 * t) / o.period;
      const x = o.a * scale * Math.cos(th), y = o.a * o.tilt * scale * Math.sin(th);
      const c = Math.cos(o.rot), s = Math.sin(o.rot);
      return { th, X: cx + x * c - y * s, Y: cy + x * s + y * c, back: Math.sin(th) < 0 };
    }

    function orbitArc(o, a0, a1) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, o.a * scale, o.a * o.tilt * scale, o.rot, a0, a1);
    }

    function drawPlanet(sel, hov) {
      const glow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.9);
      glow.addColorStop(0, "rgba(134,225,240,0.16)"); glow.addColorStop(1, "rgba(134,225,240,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, R * 1.9, 0, Math.PI * 2); ctx.fill();
      const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      g.addColorStop(0, "#5B7ACB"); g.addColorStop(0.55, "#1B2E6E"); g.addColorStop(1, "#0B1638");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      ctx.strokeStyle = "rgba(237,230,211,0.09)"; ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(cx, cy + i * R * 0.38, R * Math.sqrt(1 - Math.pow(i * 0.38, 2)), R * 0.12, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, R * i * 0.3, R, 0, 0, Math.PI * 2); ctx.stroke(); }
      const sh = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      sh.addColorStop(0.35, "rgba(4,8,24,0)"); sh.addColorStop(1, "rgba(4,8,24,0.6)");
      ctx.fillStyle = sh; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();
      ctx.strokeStyle = sel === "profile" ? "rgba(255,179,71,0.9)" : hov === "profile" ? "rgba(134,225,240,0.9)" : "rgba(134,225,240,0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R + 2.5, 0, Math.PI * 2); ctx.stroke();
      if (sel === "profile") reticle(cx, cy, R + 12, "#FFB347");
    }

    const MOON_TINT = { gsd: ["#F2E3C4", "#8C7B5E"], arq: ["#DCE3F0", "#6E7A93"], jornada: ["#E8DCCB", "#857560"], equ: ["#E6D2C2", "#8A6E5C"], health: ["#D8E6DE", "#66806F"] };
    const moonR = p => Math.max(5, Math.min(10.5, scale * 0.031)) * (p.flagship ? 1.4 : 1);

    function reticle(x, y, r, col) {
      ctx.strokeStyle = col; ctx.lineWidth = 1.5;
      for (let q = 0; q < 4; q++) { ctx.beginPath(); ctx.arc(x, y, r, q * Math.PI / 2 + 0.25, q * Math.PI / 2 + Math.PI / 2 - 0.25); ctx.stroke(); }
    }

    function drawMoon(p, s, state) {
      const r = moonR(p), [lit, dark] = MOON_TINT[p.id] || ["#E6DFCF", "#7D7766"];
      ctx.globalAlpha = s.back ? 0.5 : 1;
      // luz vem do planeta: o lado voltado para o centro fica iluminado
      const ang = Math.atan2(cy - s.Y, cx - s.X);
      const lx = s.X + Math.cos(ang) * r * 0.45, ly = s.Y + Math.sin(ang) * r * 0.45;
      const g = ctx.createRadialGradient(lx, ly, r * 0.1, s.X, s.Y, r);
      g.addColorStop(0, lit); g.addColorStop(0.7, dark); g.addColorStop(1, "#2A2A3A");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.X, s.Y, r, 0, Math.PI * 2); ctx.fill();
      // crateras
      if (r > 5) {
        ctx.fillStyle = "rgba(20,20,40,0.22)";
        const seed = p.id.charCodeAt(0) + p.id.length;
        [[0.35, -0.2, 0.22], [-0.3, 0.3, 0.16], [0.05, 0.45, 0.12]].forEach(([dx, dy, rr], i) => {
          const rot = seed * 0.7 + i; const ex = dx * Math.cos(rot) - dy * Math.sin(rot), ey = dx * Math.sin(rot) + dy * Math.cos(rot);
          ctx.beginPath(); ctx.arc(s.X + ex * r, s.Y + ey * r, rr * r, 0, Math.PI * 2); ctx.fill();
        });
      }
      if (state === "hov") { ctx.strokeStyle = "#86E1F0"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(s.X, s.Y, r + 4, 0, Math.PI * 2); ctx.stroke(); }
      if (state === "sel") reticle(s.X, s.Y, r + 9, "#FFB347");
      ctx.globalAlpha = 1;
    }

    function drawSatellite(p, s, state) {
      const col = state === "sel" ? "#FFB347" : state === "hov" ? "#86E1F0" : "#EDE6D3";
      const base = s.back ? 0.45 : 1;
      for (let i = 0; i < 6; i++) {
        orbitArc(p.orbit, s.th - (i + 1) * 0.07, s.th - i * 0.07);
        ctx.strokeStyle = col; ctx.globalAlpha = base * (0.5 - i * 0.08); ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.globalAlpha = base;
      ctx.save(); ctx.translate(s.X, s.Y); ctx.rotate(p.orbit.rot);
      ctx.fillStyle = col; ctx.fillRect(-2.5, -2.5, 5, 5);
      ctx.strokeStyle = col; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-6, 0); ctx.moveTo(3, 0); ctx.lineTo(6, 0); ctx.stroke();
      ctx.fillRect(-12, -3, 6, 6); ctx.fillRect(6, -3, 6, 6);
      ctx.fillStyle = "rgba(8,18,48,0.55)"; ctx.fillRect(-9.2, -3, 0.8, 6); ctx.fillRect(8.4, -3, 0.8, 6);
      ctx.restore();
      if (state === "sel") reticle(s.X, s.Y, 18, "#FFB347");
      ctx.globalAlpha = 1;
    }

    const drawSat = (p, s, state) => p.team ? drawSatellite(p, s, state) : drawMoon(p, s, state);

    function drawLabel(p, s, state) {
      const big = state !== "idle";
      ctx.font = big ? "700 14px 'Red Hat Text', sans-serif" : "400 12px 'Red Hat Text', sans-serif";
      ctx.fillStyle = state === "sel" ? "#FFB347" : state === "hov" ? "#86E1F0" : "rgba(237,230,211,0.6)";
      ctx.globalAlpha = s.back && !big ? 0.45 : 1;
      ctx.shadowColor = "#081230"; ctx.shadowBlur = 6;
      const tw = ctx.measureText(p.short).width;
      let lx = s.X + 16, ly = s.Y - 12;
      if (lx + tw > w - 6) lx = s.X - 16 - tw;
      ctx.fillText(p.short, lx, ly);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      if (!MOTION_OFF) clock += Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = clock;
      const sel = live.current.selected, hov = live.current.hovered;
      ctx.clearRect(0, 0, w, h);
      sats = PROJECTS.map(p => ({ p, s: satPos(p.orbit, t) }));
      const stateOf = id => id === sel ? "sel" : id === hov ? "hov" : "idle";

      // metade de trás das órbitas
      PROJECTS.forEach(p => {
        orbitArc(p.orbit, Math.PI, Math.PI * 2);
        ctx.strokeStyle = p.id === sel ? "rgba(255,179,71,0.45)" : "rgba(237,230,211,0.09)"; ctx.lineWidth = 1; ctx.stroke();
      });
      sats.filter(x => x.s.back).forEach(({ p, s }) => drawSat(p, s, stateOf(p.id)));
      drawPlanet(sel, hov);
      PROJECTS.forEach(p => {
        orbitArc(p.orbit, 0, Math.PI);
        ctx.strokeStyle = p.id === sel ? "rgba(255,179,71,0.9)" : p.id === hov ? "rgba(134,225,240,0.5)" : "rgba(237,230,211,0.2)";
        ctx.lineWidth = p.id === sel ? 1.5 : 1; ctx.stroke();
      });
      sats.filter(x => !x.s.back).forEach(({ p, s }) => drawSat(p, s, stateOf(p.id)));

      // enlace de sinal da estação terrena até o satélite selecionado
      const cur = sats.find(x => x.p.id === sel);
      if (cur) {
        const dx = cur.s.X - cx, dy = cur.s.Y - cy, d = Math.hypot(dx, dy);
        const hidden = cur.s.back && d < R + 4;
        if (!hidden && d > R + 14) {
          const ux = dx / d, uy = dy / d, px = cx + ux * R, py = cy + uy * R;
          ctx.setLineDash([3, 6]); ctx.lineDashOffset = -t * 24;
          ctx.strokeStyle = "rgba(134,225,240,0.85)"; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cur.s.X - ux * 14, cur.s.Y - uy * 14); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = "#FFB347"; ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      // rótulos por cima
      sats.forEach(({ p, s }) => { if (stateOf(p.id) === "idle" && Math.hypot(s.X - cx, s.Y - cy) > R + 26) drawLabel(p, s, "idle"); });
      sats.forEach(({ p, s }) => { const st = stateOf(p.id); if (st !== "idle") drawLabel(p, s, st); });
    }

    function pick(e) {
      const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      let best = null, bd = 22;
      sats.forEach(({ p, s }) => {
        if (s.back && Math.hypot(s.X - cx, s.Y - cy) < R) return;
        const d = Math.hypot(s.X - x, s.Y - y); if (d < bd) { bd = d; best = p.id; }
      });
      if (!best && Math.hypot(x - cx, y - cy) < R + 6) return "profile";
      return best;
    }
    const onMove = e => { const id = pick(e); live.current.hovered = id; setHovered(id); canvas.style.cursor = id ? "pointer" : "default"; };
    const onLeave = () => { live.current.hovered = null; setHovered(null); };
    const onClick = e => { const id = pick(e); if (id) onSelect(id); };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    const ro = new ResizeObserver(layout); ro.observe(wrap); layout();
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }); io.observe(wrap);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerleave", onLeave); canvas.removeEventListener("click", onClick); };
  }, [onSelect]);

  const hp = hovered === "profile" ? { name: "Meu perfil completo e currículo" } : PROJECTS.find(p => p.id === hovered);
  return (
    <div ref={wrapRef} className="relative w-full h-[min(80vw,420px)] lg:h-full lg:min-h-[380px]">
      <canvas ref={canvasRef} role="img" aria-label="Sistema orbital: um planeta no centro representa a base em São Paulo; luas em órbita são projetos próprios e satélites são projetos em equipe. Use a lista abaixo para escolher um projeto pelo teclado." />
      <p className="absolute left-0 top-3 text-sm text-dim max-w-[24ch] leading-snug pointer-events-none">
        {hp ? <span className="text-signal">{hp.name}</span> : "Clique no planeta para ver meu perfil e baixar o currículo. As luas são projetos próprios; os satélites, projetos em equipe."}
      </p>
    </div>
  );
}

function useDownloads() {
  const [dl, setDl] = useState(undefined);
  useEffect(() => {
    let on = true;
    const c = window.claude;
    (c && typeof c.use === "function" ? c.use("downloads") : Promise.resolve(null))
      .then(d => { if (on) setDl(d || null); }, () => { if (on) setDl(null); });
    return () => { on = false; };
  }, []);
  return dl;
}

function ProfilePanel() {
  const dl = useDownloads();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function download() {
    setMsg(""); setBusy(true);
    try {
      const res = await fetch(CV_URL);
      if (!res.ok) throw { code: "fetch" };
      const blob = await res.blob();
      await dl.save({ filename: CV_NAME, data: blob });
      setMsg("Currículo salvo.");
    } catch (e) {
      const c = e && e.code;
      setMsg(c === "declined" ? "Download cancelado." : c === "rate_limited" ? "Já existe uma confirmação aberta. Tente de novo em instantes." : "Não foi possível baixar agora. Tente de novo.");
    } finally { setBusy(false); }
  }
  const Row = ({ label, children }) => (
    <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 py-2.5 border-t border-line">
      <h4 className="text-sm font-bold text-dim">{label}</h4>
      <div className="text-[15px] leading-relaxed text-star/95">{children}</div>
    </div>
  );
  return (
    <article key="profile" className="console fade-swap border border-sodium/50 bg-deep/80 backdrop-blur-sm rounded-xl p-6 sm:p-7" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-dim">
        <span className="inline-block w-2 h-2 rounded-full bg-sodium" aria-hidden="true"></span>
        Sinal recebido: base terrena, São Paulo
      </div>
      <h3 className="font-display font-bold text-4xl leading-none mt-3 text-star">Raul Rezende Iemini Aguiar</h3>
      <p className="mt-2 text-sm text-signal">Desenvolvedor full-stack, Análise e Desenvolvimento de Sistemas</p>
      <p className="mt-3 text-star/90 leading-relaxed max-w-[60ch]">
        No último período de ADS na FIAP, procurando uma vaga num time de desenvolvimento.
      </p>

      <dl className="mt-5 grid grid-cols-3 gap-px bg-line rounded-lg overflow-hidden border border-line">
        {[["Projetos", PROJECTS.length], ["Certificações", BADGES.length], ["Inglês", "C1"]].map(([k, v]) => (
          <div key={k} className="bg-ink px-3 py-2.5">
            <dt className="text-xs text-dim leading-tight">{k}</dt>
            <dd className="font-mono text-sodium text-[15px] mt-1">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <Row label="Formação">ADS na FIAP (dez/2026) e técnico em TI pelo Senac MG</Row>
        <Row label="Experiência">Suporte ao cliente na Concentrix, 2026</Row>
        <Row label="Tecnologias">Java, Spring Boot, C#/.NET, Python, FastAPI, React, TypeScript, SQL, Docker</Row>
        <Row label="Contato">
          <span className="block">{PERSON.email}</span>
          <span className="flex gap-4"><a className="text-signal hover:underline" href={PERSON.linkedin} target="_blank" rel="noopener">LinkedIn</a><a className="text-signal hover:underline" href={PERSON.github} target="_blank" rel="noopener">GitHub</a></span>
        </Row>
      </div>

      {dl === null && (
        <div className="mt-5">
          <a href={CV_URL} download={CV_NAME} className="px-4 py-2 rounded-md bg-sodium text-ink font-bold hover:bg-[#ffc56e] transition-colors inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m0 0l-3.2-3.2M8 10l3.2-3.2M2.5 13.5h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Baixar currículo (PDF)
          </a>
        </div>
      )}
      {dl && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button onClick={download} disabled={busy} className="px-4 py-2 rounded-md bg-sodium text-ink font-bold hover:bg-[#ffc56e] disabled:opacity-60 transition-colors inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m0 0l-3.2-3.2M8 10l3.2-3.2M2.5 13.5h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {busy ? "Preparando…" : "Baixar currículo (PDF)"}
          </button>
          {msg && <span className="text-sm text-dim" role="status">{msg}</span>}
        </div>
      )}
    </article>
  );
}

function Telemetry({ p }) {
  return (
    <article key={p.id} className="console fade-swap border border-line bg-deep/80 backdrop-blur-sm rounded-xl p-6 sm:p-7" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-dim">
        <span className="inline-block w-2 h-2 rounded-full bg-signal" aria-hidden="true"></span>
        Sinal recebido: {p.kind}
      </div>
      <h3 className="font-display font-bold text-4xl leading-none mt-3 text-star">{p.name}</h3>
      {p.team && <p className="mt-2 text-sm text-signal">{p.team}</p>}
      <p className="mt-3 text-star/90 leading-relaxed max-w-[60ch]">{p.summary}</p>
      {p.readouts && (
        <dl className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-px bg-line rounded-lg overflow-hidden border border-line">
          {p.readouts.map(([k, v]) => (
            <div key={k} className="bg-ink px-3 py-2.5">
              <dt className="text-xs text-dim leading-tight">{k}</dt>
              <dd className="font-mono text-sodium text-[15px] mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {p.mine && (
        <div className="mt-5 border-l-2 border-sodium pl-4">
          <h4 className="font-bold text-sodium text-[15px]">Minha parte</h4>
          <ul className="mt-1.5 space-y-1.5 text-[15px] leading-relaxed text-star">
            {p.mine.map(m => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}
      {p.mine && <h4 className="mt-5 font-bold text-dim text-[15px]">O projeto</h4>}
      <ul className={(p.mine ? "mt-2" : "mt-5") + " space-y-2 text-[15px] leading-relaxed"}>
        {p.bullets.map(b => (
          <li key={b} className="flex gap-3"><span className="mt-[9px] w-1.5 h-1.5 shrink-0 rotate-45 bg-sodium/80" aria-hidden="true"></span><span>{b}</span></li>
        ))}
      </ul>
      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tecnologias">
        {p.stack.map(s => <li key={s} className="text-[13px] px-2 py-0.5 rounded border border-line text-dim">{s}</li>)}
      </ul>
      {p.links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {p.links.map(([label, href], i) => (
            <a key={href} href={href} target="_blank" rel="noopener" className={i === 0 ? "px-4 py-2 rounded-md bg-sodium text-ink font-bold hover:bg-[#ffc56e] transition-colors" : "px-4 py-2 rounded-md border border-line text-star hover:border-signal hover:text-signal transition-colors"}>{label}</a>
          ))}
        </div>
      )}
    </article>
  );
}


/* ---------- Abertura: escotilha, ponte de comando e janela ---------- */
const OCT = "M400 130H1200L1270 200V530L1200 600H400L330 530V200Z";
const octAt = k => { const cx = 800, cy = 365; const pts = [[400,130],[1200,130],[1270,200],[1270,530],[1200,600],[400,600],[330,530],[330,200]]; return "M" + pts.map(([x, y]) => `${cx + (x - cx) * k} ${cy + (y - cy) * k}`).join("L") + "Z"; };
const range = (a, b, k = 22) => `clamp(0, min(calc((var(--p) - ${a}) * ${k}), calc((${b} - var(--p)) * ${k})), 1)`;

function SpaceView() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="earth" cx="0.42" cy="0.18" r="0.7">
          <stop offset="0" stopColor="#7FC4F2"/><stop offset="0.35" stopColor="#2F6FB8"/><stop offset="0.7" stopColor="#163A7A"/><stop offset="1" stopColor="#0A1A44"/>
        </radialGradient>
        <radialGradient id="moonG" cx="0.35" cy="0.35"><stop offset="0" stopColor="#F2E9D8"/><stop offset="1" stopColor="#6E6A78"/></radialGradient>
        <filter id="atm" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14"/></filter>
      </defs>
      <g className="vb" style={{ transformOrigin: "800px 365px", transform: "scale(calc(0.86 + 0.14 * var(--walk) + 0.55 * var(--zoom)))" }}>
        <circle cx="800" cy="1560" r="1080" fill="none" stroke="#86E1F0" strokeOpacity=".55" strokeWidth="26" filter="url(#atm)"/>
        <circle cx="800" cy="1560" r="1080" fill="url(#earth)"/>
        <path d="M120 560 C 420 520, 640 600, 900 540 S 1400 520, 1520 560" fill="none" stroke="#EAF6FF" strokeOpacity=".18" strokeWidth="18" strokeLinecap="round"/>
        <path d="M260 610 C 520 590, 760 640, 1100 600" fill="none" stroke="#EAF6FF" strokeOpacity=".12" strokeWidth="12" strokeLinecap="round"/>
        <circle cx="1090" cy="235" r="26" fill="url(#moonG)"/>
        <circle cx="1098" cy="228" r="5" fill="rgba(20,20,40,.25)"/>
        <g transform="translate(560 250) rotate(-18)" fill="#EDE6D3">
          <rect x="-4" y="-4" width="8" height="8"/><rect x="-22" y="-5" width="12" height="10"/><rect x="10" y="-5" width="12" height="10"/>
        </g>
      </g>
    </svg>
  );
}

const C = { cyan: "#86E1F0", sodium: "#FFB347", star: "#EDE6D3", dim: "#8FA0C4", line: "#2A4D7E", panel: "#0E2A55" };
const MONO = "JetBrains Mono, monospace", BODY = "Red Hat Text, sans-serif", DISP = "Big Shoulders Display, sans-serif";

function Seg({ x, y, n = 10, on = 10, w = 3.2, h = 4, color = C.cyan }) {
  return <g>{Array.from({ length: n }, (_, i) => <rect key={i} x={x + i * (w + 1.2)} y={y} width={w} height={h} rx=".6" fill={i < on ? color : C.line}/>)}</g>;
}

function HudFrame({ iw, ih, tag, ch, foot, footSeg = 10 }) {
  const t = [];
  for (let x = 8; x < iw - 8; x += 6) t.push(<line key={x} x1={x} x2={x} y1="18" y2={x % 30 < 6 ? 21.5 : 19.8} stroke={C.cyan} strokeOpacity=".5" strokeWidth=".6"/>);
  const br = (x, y, sx, sy) => <path d={`M${x} ${y + 7 * sy}V${y}H${x + 7 * sx}`} fill="none" stroke={C.cyan} strokeWidth="1.2" opacity=".9"/>;
  return (
    <g>
      <rect width={iw} height={ih} fill="url(#hudDots)" opacity=".55"/>
      <rect width={iw} height={ih} fill="url(#vign)"/>
      <rect x="0" y="0" width={iw} height="17" fill="#0A2348" opacity=".9"/>
      <rect x="6" y="6" width="2.2" height="6" fill={C.sodium}/>
      <text x="11.5" y="11.6" fontSize="6.2" fill={C.cyan} fontFamily={MONO} letterSpacing=".4">{tag}</text>
      <text x={iw - 34} y="11.6" fontSize="5.2" fill={C.dim} fontFamily={MONO}>{ch}</text>
      <circle className="blink" cx={iw - 8} cy="9.3" r="2.1" fill={C.sodium}/>
      <line x1="0" x2={iw} y1="17.5" y2="17.5" stroke={C.cyan} strokeOpacity=".55" strokeWidth=".7"/>
      {t}
      {br(3, 21, 1, 1)}{br(iw - 3, 21, -1, 1)}{br(3, ih - 3, 1, -1)}{br(iw - 3, ih - 3, -1, -1)}
      <line x1="8" x2={iw - 8} y1={ih - 13} y2={ih - 13} stroke={C.cyan} strokeOpacity=".3" strokeWidth=".6"/>
      <text x="9" y={ih - 5.5} fontSize="5.1" fill={C.dim} fontFamily={MONO}>{foot}</text>
      <Seg x={iw - 9 - footSeg * 4.4} y={ih - 9.6} n={footSeg} on={footSeg} w={3.2} h={3.6}/>
    </g>
  );
}

const KV = ({ x, y, k, v, vc = C.star }) => (
  <g>
    <text x={x} y={y} fontSize="4.8" fill={C.dim} fontFamily={MONO} letterSpacing=".5">{k}</text>
    <text x={x + 34} y={y} fontSize="6.8" fill={vc} fontFamily={BODY} fontWeight="500">{v}</text>
  </g>
);

function ScreenContent({ kind, iw, ih }) {
  if (kind === "orbit") {
    const cx = 166, cy = 66;
    return (
      <g>
        <HudFrame iw={iw} ih={ih} tag="TRIPULANTE" ch="CH-01" foot={"23°33'S  46°38'O"}/>
        <text x="9" y="44" fontSize="18" fill={C.star} fontFamily={DISP} fontWeight="800">Raul Rezende</text>
        <text x="9" y="61" fontSize="18" fill={C.star} fillOpacity=".62" fontFamily={DISP} fontWeight="800">Iemini Aguiar</text>
        <rect x="9" y="67" width="92" height="10" rx="2" fill={C.sodium} fillOpacity=".14" stroke={C.sodium} strokeOpacity=".6" strokeWidth=".6"/>
        <text x="13" y="74.2" fontSize="5.8" fill={C.sodium} fontFamily={MONO}>Desenvolvedor full-stack</text>
        <KV x={9} y={92} k="BASE" v="São Paulo, SP"/>
        <KV x={9} y={104} k="FORMAÇÃO" v="ADS, FIAP"/>
        <KV x={9} y={116} k="STATUS" v="Em busca de vaga" vc={C.cyan}/>
        <g>
          <circle cx={cx} cy={cy} r="29" fill="none" stroke={C.cyan} strokeOpacity=".25"/>
          {Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2, r1 = 26, r2 = i % 4 ? 28 : 31; return <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke={C.cyan} strokeOpacity={i % 4 ? .35 : .8} strokeWidth=".6"/>; })}
          <g className="spin-slow"><circle cx={cx} cy={cy} r="22" fill="none" stroke={C.sodium} strokeWidth="1.2" strokeDasharray="10 6 2 6"/></g>
          <circle cx={cx} cy={cy} r="18" fill={C.panel} stroke={C.cyan} strokeWidth=".8"/>
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="17" fill={C.star} fontFamily={DISP} fontWeight="800">RI</text>
          <text x={cx} y={cy + 42} textAnchor="middle" fontSize="5" fill={C.dim} fontFamily={MONO}>TRIPULANTE 01</text>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => <rect key={i} x={cx - 22 + i * 3.8} y={cy + 46} width={i % 3 ? 1.4 : 2.4} height="7" fill={C.cyan} opacity=".55"/>)}
        </g>
      </g>
    );
  }
  if (kind === "bars") {
    const chips = [["Java", "Spring Boot"], ["C#/.NET", "Python", "SQL"], ["FastAPI", "React", "Docker"], ["TypeScript"]];
    return (
      <g>
        <HudFrame iw={iw} ih={ih} tag="SISTEMAS DE BORDO" ch="CH-02" foot={SKILLS.reduce((n, g) => n + g.items.length, 0) + " tecnologias catalogadas"}/>
        <text x="9" y="31" fontSize="4.8" fill={C.dim} fontFamily={MONO} letterSpacing=".5">PRINCIPAIS</text>
        {chips.map((row, r) => { let x = 9; return row.map(c => { const w = c.length * 3.75 + 10; const el = (
          <g key={c}>
            <rect x={x} y={35 + r * 13} width={w} height="10" rx="2" fill={C.panel} stroke={C.cyan} strokeOpacity=".55" strokeWidth=".6"/>
            <circle cx={x + 4} cy={40 + r * 13} r="1.2" fill={C.sodium}/>
            <text x={x + 7} y={42.2 + r * 13} fontSize="6.2" fill={C.star} fontFamily={BODY} fontWeight="500">{c}</text>
          </g>); x += w + 3; return el; }); })}
        <line x1="118" x2="118" y1="26" y2={ih - 18} stroke={C.cyan} strokeOpacity=".25" strokeWidth=".6"/>
        <text x="123" y="31" fontSize="4.8" fill={C.dim} fontFamily={MONO} letterSpacing=".5">MÓDULOS</text>
        {SKILLS.map((g, i) => (
          <g key={g.id}>
            <text x="123" y={42 + i * 10.4} fontSize="5" fill={C.star} fontFamily={BODY}>{g.name.replace(" e produto", "")}</text>
            <Seg x={156} y={38.2 + i * 10.4} n={9} on={g.items.length} w={2.6} h={4.2} color={i % 2 ? C.cyan : C.sodium}/>
          </g>
        ))}
      </g>
    );
  }
  if (kind === "text") {
    return (
      <g>
        <HudFrame iw={iw} ih={ih} tag="FORMAÇÃO" ch="CH-03" foot="Inglês: EF SET 70/100"/>
        <text x="9" y="40" fontSize="15" fill={C.star} fontFamily={DISP} fontWeight="800">ADS na FIAP</text>
        <text x="9" y="50" fontSize="6" fill={C.dim} fontFamily={BODY}>Tecnólogo, conclusão em dez/2026</text>
        <line x1="13" x2="105" y1="66" y2="66" stroke={C.line} strokeWidth="2"/>
        <line x1="13" x2="80" y1="66" y2="66" stroke={C.cyan} strokeWidth="2"/>
        <circle cx="13" cy="66" r="3.2" fill={C.cyan}/>
        <circle cx="58" cy="66" r="3.2" fill={C.cyan}/>
        <circle cx="105" cy="66" r="3.6" fill={C.panel} stroke={C.sodium} strokeWidth="1.2" strokeDasharray="2 1.5"/>
        <circle className="blink" cx="80" cy="66" r="1.8" fill={C.star}/>
        {[[13, "Senac MG", "Técnico em TI"], [58, "FIAP", "ADS"], [105, "dez/2026", "Formatura"]].map(([x, a, b2]) => (
          <g key={a}>
            <text x={x} y="78" textAnchor="middle" fontSize="5.4" fill={C.star} fontFamily={BODY} fontWeight="500">{a}</text>
            <text x={x} y="85" textAnchor="middle" fontSize="4.4" fill={C.dim} fontFamily={MONO}>{b2}</text>
          </g>
        ))}
        <line x1="122" x2="122" y1="26" y2={ih - 18} stroke={C.cyan} strokeOpacity=".25" strokeWidth=".6"/>
        <text x="127" y="31" fontSize="4.8" fill={C.dim} fontFamily={MONO} letterSpacing=".5">IDIOMAS</text>
        {[["PT", 5, "Nativo"], ["EN", 4, "C1"], ["ES", 1, "Básico"]].map(([l, n, lv], i) => (
          <g key={l}>
            <text x="127" y={47 + i * 14} fontSize="7" fill={C.star} fontFamily={MONO} fontWeight="500">{l}</text>
            {[1, 2, 3, 4, 5].map(k => <rect key={k} x={140 + k * 4.3} y={47 + i * 14 - 2 - k * 1.6} width="2.8" height={2 + k * 1.6} rx=".5" fill={k <= n ? C.cyan : C.line}/>)}
            <text x="169" y={47 + i * 14} fontSize="5.2" fill={C.dim} fontFamily={BODY}>{lv}</text>
          </g>
        ))}
      </g>
    );
  }
  if (kind === "radar") {
    const cx = 162, cy = 66, R = 38;
    const own = PROJECTS.filter(x => !x.team), team = PROJECTS.filter(x => x.team);
    const blips = [...own.map((p, i) => ({ t: "m", a: 0.4 + i * 1.25, r: 0.35 + (i % 3) * 0.22 })), ...team.map((p, i) => ({ t: "s", a: 2.1 + i * 2.6, r: 0.8 - i * 0.18 }))];
    return (
      <g>
        <HudFrame iw={iw} ih={ih} tag="MISSÕES DETECTADAS" ch="CH-04" foot="Varredura completa"/>
        <text x="9" y="62" fontSize="40" fill={C.star} fontFamily={DISP} fontWeight="800">{PROJECTS.length}</text>
        <text x="33" y="45" fontSize="9" fill={C.star} fontFamily={DISP} fontWeight="700">missões</text>
        <text x="33" y="55" fontSize="5" fill={C.dim} fontFamily={MONO}>REGISTRADAS</text>
        <circle cx="13" cy="75" r="3.4" fill="#E6DFCF"/>
        <text x="21" y="77.4" fontSize="6.6" fill={C.star} fontFamily={BODY}>{own.length} luas: projetos próprios</text>
        <g transform="translate(13 89)" fill={C.cyan}><rect x="-1.6" y="-1.6" width="3.2" height="3.2"/><rect x="-6" y="-1.8" width="3.2" height="3.6"/><rect x="2.8" y="-1.8" width="3.2" height="3.6"/></g>
        <text x="21" y="91.4" fontSize="6.6" fill={C.star} fontFamily={BODY}>{team.length} satélites: em equipe</text>
        <text x="9" y="104" fontSize="5" fill={C.dim} fontFamily={MONO}>DESTINO: JANELA DE OBSERVAÇÃO</text>
        <circle cx={cx} cy={cy} r={R} fill="#071B3A" stroke={C.cyan} strokeOpacity=".6" strokeWidth=".8"/>
        {[0.33, 0.66].map(k => <circle key={k} cx={cx} cy={cy} r={R * k} fill="none" stroke={C.cyan} strokeOpacity=".3" strokeWidth=".6"/>)}
        <line x1={cx - R} x2={cx + R} y1={cy} y2={cy} stroke={C.cyan} strokeOpacity=".25" strokeWidth=".6"/>
        <line x1={cx} x2={cx} y1={cy - R} y2={cy + R} stroke={C.cyan} strokeOpacity=".25" strokeWidth=".6"/>
        {Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2; return <line key={i} x1={cx + Math.cos(a) * R} y1={cy + Math.sin(a) * R} x2={cx + Math.cos(a) * (R + (i % 3 ? 1.6 : 3.2))} y2={cy + Math.sin(a) * (R + (i % 3 ? 1.6 : 3.2))} stroke={C.cyan} strokeOpacity=".6" strokeWidth=".6"/>; })}
        <g className="spin">
          <circle cx={cx} cy={cy} r={R} fill="transparent"/>
          <path d={`M${cx} ${cy}L${cx + R} ${cy}A${R} ${R} 0 0 0 ${cx + Math.cos(-0.9) * R} ${cy + Math.sin(-0.9) * R}Z`} fill="url(#sweep)"/>
          <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke={C.cyan} strokeWidth="1"/>
        </g>
        {blips.map((bl, i) => { const x = cx + Math.cos(bl.a) * R * bl.r, y = cy + Math.sin(bl.a) * R * bl.r; return bl.t === "m"
          ? <g key={i}><circle cx={x} cy={y} r="2.6" fill="#E6DFCF"/><circle cx={x} cy={y} r="4.6" fill="none" stroke="#E6DFCF" strokeOpacity=".35" strokeWidth=".6"/></g>
          : <g key={i} transform={`translate(${x} ${y})`} fill={C.cyan}><rect x="-1.4" y="-1.4" width="2.8" height="2.8"/><rect x="-5" y="-1.5" width="2.6" height="3"/><rect x="2.4" y="-1.5" width="2.6" height="3"/></g>; })}
        <circle cx={cx} cy={cy} r="2.2" fill={C.sodium}/>
      </g>
    );
  }
  // wave: canal de comunicação
  const ox = 140, oy = 30, ow = 66, oh = 52;
  const wave = Array.from({ length: 60 }, (_, i) => `${i ? "L" : "M"}${ox + i * (ow + 40) / 59} ${oy + oh / 2 + Math.sin(i / 2.2) * oh * 0.28 * (0.6 + 0.4 * Math.sin(i / 7))}`).join("");
  const rows = [["mail", PERSON.email], ["in", "linkedin.com/in/raul-iemini"], ["code", "github.com/RaulRezende09"]];
  return (
    <g>
      <HudFrame iw={iw} ih={ih} tag="CANAL DE COMUNICAÇÃO" ch="CH-05" foot="Resposta por e-mail ou LinkedIn"/>
      <text x="9" y="41" fontSize="17" fill={C.star} fontFamily={DISP} fontWeight="800">Abrir canal</text>
      <g>
        <circle className="blink" cx="90" cy="36" r="2" fill={C.cyan}/>
        <text x="95" y="38" fontSize="5" fill={C.cyan} fontFamily={MONO}>ON-LINE</text>
      </g>
      {rows.map(([ic, v], i) => { const y = 54 + i * 15; return (
        <g key={ic}>
          <rect x="9" y={y - 7} width="11" height="11" rx="2" fill={C.panel} stroke={C.cyan} strokeOpacity=".6" strokeWidth=".6"/>
          {ic === "mail" && <g fill="none" stroke={C.cyan} strokeWidth=".8"><rect x="11.5" y={y - 4.3} width="6" height="5"/><path d={`M11.5 ${y - 4.3}l3 2.6 3-2.6`}/></g>}
          {ic === "in" && <text x="14.5" y={y + 1.6} textAnchor="middle" fontSize="6" fill={C.cyan} fontFamily={MONO} fontWeight="500">in</text>}
          {ic === "code" && <text x="14.5" y={y + 1.4} textAnchor="middle" fontSize="5" fill={C.cyan} fontFamily={MONO}>&lt;/&gt;</text>}
          <text x="25" y={y + 1.6} fontSize="6.6" fill={C.star} fontFamily={BODY} fontWeight="500">{v}</text>
        </g>); })}
      <rect x={ox} y={oy} width={ow} height={oh} rx="2" fill="#071B3A" stroke={C.cyan} strokeOpacity=".5" strokeWidth=".6"/>
      {[1, 2, 3].map(i => <line key={"h" + i} x1={ox} x2={ox + ow} y1={oy + oh * i / 4} y2={oy + oh * i / 4} stroke={C.cyan} strokeOpacity=".15" strokeWidth=".5"/>)}
      {[1, 2, 3, 4, 5].map(i => <line key={"v" + i} y1={oy} y2={oy + oh} x1={ox + ow * i / 6} x2={ox + ow * i / 6} stroke={C.cyan} strokeOpacity=".15" strokeWidth=".5"/>)}
      <clipPath id="oscClip"><rect x={ox} y={oy} width={ow} height={oh}/></clipPath>
      <g clipPath="url(#oscClip)"><path className="trace" d={wave} fill="none" stroke={C.cyan} strokeWidth="1.2"/></g>
      <text x={ox} y={oy + oh + 9} fontSize="4.8" fill={C.dim} fontFamily={MONO}>SINAL</text>
      <Seg x={ox + 20} y={oy + oh + 5.6} n={8} on={7} w={4} h={4}/>
    </g>
  );
}

function Screen({ x, y, w, h, kind, a, b }) {
  const ix = x + 8, iy = y + 8, iw = w - 16, ih = h - 16;
  const cx0 = x + w / 2, cy0 = y + h / 2;
  const target = 500 / w;
  const gStyle = {
    "--e": a == null ? 0 : `clamp(0, min(calc((var(--p) - ${a}) * 32), calc((${b} - var(--p)) * 32)), 1)`,
    transformOrigin: `${cx0}px ${cy0}px`,
    transform: `translate(calc(${800 - cx0}px * var(--e)), calc(${355 - cy0}px * var(--e))) scale(calc(1 + (min(${target.toFixed(3)}, calc(var(--vu) * 0.84 / ${w})) - 1) * var(--e)))`,
  };
  return (
    <g>
      {y + h < 704 && <rect x={cx0 - 14} y={y + h - 2} width="28" height={706 - (y + h)} fill="#2B313B"/>}
      <g className="vb" style={gStyle}>
        <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx="10" fill="none" stroke="#86E1F0" strokeWidth="2" style={{ opacity: "var(--e)" }} filter="url(#glow)"/>
        <rect x={x} y={y} width={w} height={h} rx="7" fill="#262C36" stroke="#4A5260" strokeWidth="2"/>
        <rect x={ix} y={iy} width={iw} height={ih} rx="3" fill="url(#scr)"/>
        <g style={{ opacity: "clamp(0, calc(1 - var(--e) * 1.6), 1)" }}>
          <g stroke="#86E1F0" strokeOpacity=".18">{[1, 2, 3].map(i => <line key={i} x1={ix} x2={ix + iw} y1={iy + ih * i / 4} y2={iy + ih * i / 4}/>)}</g>
          {kind === "bars" && <g fill="#86E1F0">{[0.5, 0.8, 0.35, 0.65, 0.9, 0.45, 0.7].map((v, i) => <rect key={i} x={ix + 12 + i * (iw - 24) / 7} y={iy + ih - 10 - v * (ih - 26)} width={(iw - 24) / 7 - 6} height={v * (ih - 26)} opacity={0.45 + v * 0.5}/>)}</g>}
          {kind === "wave" && <path d={Array.from({ length: 40 }, (_, i) => `${i ? "L" : "M"}${ix + 6 + i * (iw - 12) / 39} ${iy + ih / 2 + Math.sin(i / 3) * ih * 0.28}`).join("")} fill="none" stroke="#86E1F0" strokeWidth="2.5"/>}
          {kind === "orbit" && <g fill="none" stroke="#86E1F0">
            <circle cx={cx0} cy={cy0} r="13" fill="#2F6FB8" stroke="none"/>
            <ellipse cx={cx0} cy={cy0} rx={iw * 0.38} ry={ih * 0.22} transform={`rotate(-14 ${cx0} ${cy0})`} strokeWidth="1.6"/>
            <ellipse cx={cx0} cy={cy0} rx={iw * 0.26} ry={ih * 0.32} transform={`rotate(24 ${cx0} ${cy0})`} strokeWidth="1.2" strokeOpacity=".7"/>
            <circle cx={ix + iw * 0.86} cy={iy + ih * 0.42} r="4.5" fill="#FFB347" stroke="none"/>
          </g>}
          {kind === "radar" && <g fill="none" stroke="#86E1F0">
            {[0.15, 0.28, 0.4].map(r => <circle key={r} cx={cx0} cy={cy0} r={ih * r} strokeOpacity=".55"/>)}
            <line x1={cx0} y1={cy0} x2={cx0 + ih * 0.4} y2={cy0 - ih * 0.2} strokeWidth="2.4"/>
            <circle cx={cx0 - 18} cy={cy0 + 12} r="3" fill="#FFB347" stroke="none"/>
          </g>}
          {kind === "text" && <g fill="#86E1F0">{[0.9, 0.6, 0.75, 0.4, 0.85, 0.55].map((v, i) => <rect key={i} x={ix + 10} y={iy + 12 + i * (ih - 20) / 6} width={(iw - 20) * v} height="5" rx="2" opacity={i === 0 ? 1 : 0.55}/>)}</g>}
        </g>
        {/* dados revelados ao expandir */}
        <g style={{ opacity: "clamp(0, calc((var(--e) - 0.55) * 2.6), 1)" }} transform={`translate(${ix} ${iy})`}>
          <ScreenContent kind={kind} iw={iw} ih={ih}/>
        </g>
      </g>
    </g>
  );
}

function Bridge() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F3F5F8"/><stop offset="1" stopColor="#D5DAE1"/></linearGradient>
        <linearGradient id="wl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#A9B1BC"/><stop offset="1" stopColor="#D9DEE5"/></linearGradient>
        <linearGradient id="wr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#A3ABB7"/><stop offset="1" stopColor="#D2D8DF"/></linearGradient>
        <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#8C95A2"/><stop offset="1" stopColor="#BFC6CF"/></linearGradient>
        <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C2C58"/><stop offset="1" stopColor="#061632"/></linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <pattern id="hudDots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="#86E1F0" opacity=".35"/></pattern>
        <radialGradient id="vign" cx=".5" cy=".5" r=".75"><stop offset=".55" stopColor="#061632" stopOpacity="0"/><stop offset="1" stopColor="#020A1C" stopOpacity=".7"/></radialGradient>
        <radialGradient id="sweep" cx="0" cy="0" r="1"><stop offset="0" stopColor="#86E1F0" stopOpacity=".05"/><stop offset="1" stopColor="#86E1F0" stopOpacity=".45"/></radialGradient>
      </defs>
      <g className="vb" style={{ transformOrigin: "800px 365px", transform: "scale(calc(0.62 + 0.38 * var(--walk) + 2.8 * var(--zoom) * var(--zoom)))" }}>
        <path fillRule="evenodd" d={"M-1600 -1200H3200V2100H-1600Z " + OCT} fill="#CBD1D9"/>
        <polygon points="-1600,-1200 3200,-1200 1200,130 400,130" fill="url(#ceil)"/>
        <polygon points="-1600,-1200 400,130 330,200 330,530 400,600 -1600,2100" fill="url(#wl)"/>
        <polygon points="3200,-1200 1200,130 1270,200 1270,530 1200,600 3200,2100" fill="url(#wr)"/>
        <polygon points="-1600,2100 400,600 1200,600 3200,2100" fill="url(#fl)"/>
        {/* costelas da estrutura */}
        {[1.3, 1.75, 2.4].map(k => <path key={k} d={octAt(k)} fill="none" stroke="#9EA7B3" strokeWidth={3 * k}/>)}
        {[[400,130,-1600,-1200],[1200,130,3200,-1200],[330,200,-1600,-600],[1270,200,3200,-600],[330,530,-1600,1500],[1270,530,3200,1500],[400,600,-1600,2100],[1200,600,3200,2100]].map(([a,b,c,d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#AEB6C1" strokeWidth="3"/>)}
        {/* luzes do teto e das paredes */}
        <g filter="url(#glow)" stroke="#F2FDFF" strokeLinecap="round">
          <line x1="420" y1="55" x2="1180" y2="55" strokeWidth="9"/>
          <line x1="250" y1="-60" x2="1350" y2="-60" strokeWidth="12"/>
          <line x1="170" y1="170" x2="170" y2="420" strokeWidth="7" stroke="#C9F6FF"/>
          <line x1="1430" y1="170" x2="1430" y2="420" strokeWidth="7" stroke="#C9F6FF"/>
        </g>
        {/* painéis laterais */}
        <g>
          <rect x="40" y="250" width="70" height="150" rx="6" fill="#8E97A4"/>
          {[0,1,2,3,4,5].map(i => <rect key={i} x="52" y={266 + i * 21} width="46" height="8" rx="2" fill="#5E6775"/>)}
          <rect x="1490" y="250" width="70" height="150" rx="6" fill="#8E97A4"/>
          {[0,1,2].map(i => <circle key={i} cx="1525" cy={285 + i * 38} r="7" fill={["#86E1F0", "#FFB347", "#86E1F0"][i]} filter="url(#glow)"/>)}
        </g>
        {/* moldura da janela */}
        <path d={OCT} fill="none" stroke="#7F8896" strokeWidth="30" strokeLinejoin="round"/>
        <path d={OCT} fill="none" stroke="#E7EBF0" strokeWidth="10" strokeLinejoin="round"/>
        <path d={OCT} fill="none" stroke="#4E5664" strokeWidth="3"/>
        {[[400,130],[1200,130],[1270,200],[1270,530],[1200,600],[400,600],[330,530],[330,200]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#4E5664"/>)}
        <rect x="720" y="104" width="160" height="22" rx="4" fill="#4E5664"/>
        <text x="800" y="120" textAnchor="middle" fontSize="13" fill="#E7EBF0" fontFamily="JetBrains Mono, monospace">PONTE DE COMANDO</text>
        {/* console */}
        <polygon points="80,900 240,700 1360,700 1520,900" fill="#3A424F"/>
        <polygon points="240,700 1360,700 1380,726 220,726" fill="#6B7482"/>
        {[[300,760],[340,760],[380,760],[1220,760],[1260,760],[1300,760]].map(([x, y], i) => <rect key={i} x={x} y={y} width="26" height="14" rx="3" fill={["#FFB347", "#86E1F0", "#E8EBEF"][i % 3]} opacity=".85"/>)}
        {[
          { x: 210, y: 600, w: 210, h: 125, kind: "bars", a: 0.344, b: 0.428 },
          { x: 440, y: 575, w: 230, h: 145, kind: "wave", a: 0.596, b: 0.68 },
          { x: 930, y: 575, w: 230, h: 145, kind: "radar", a: 0.512, b: 0.596 },
          { x: 1180, y: 600, w: 210, h: 125, kind: "text", a: 0.428, b: 0.512 },
          { x: 690, y: 545, w: 220, h: 165, kind: "orbit", a: 0.26, b: 0.344 },
        ].map(sc => <Screen key={sc.kind} {...sc}/>)}
      </g>
    </svg>
  );
}

function Hatch() {
  const doorL = { transform: "translateX(calc(var(--door) * -250px))" };
  const doorR = { transform: "translateX(calc(var(--door) * 250px))" };
  const HOLE = "M560 860V250L610 200H990L1040 250V860Z";
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true"
      style={{ opacity: "clamp(0, calc(1 - var(--walk) * 1.25), 1)" }}>
      <defs>
        <clipPath id="hole"><path d={HOLE}/></clipPath>
        <linearGradient id="dp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ECEFF2"/><stop offset="1" stopColor="#CDD2D9"/></linearGradient>
        <linearGradient id="cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9ECF0"/><stop offset="1" stopColor="#C9CFD7"/></linearGradient>
        <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g className="vb" style={{ transformOrigin: "800px 530px", transform: "scale(calc(1 + var(--walk) * 2.6))" }}>
        <path fillRule="evenodd" d={"M-1600 -1200H3200V2100H-1600Z " + HOLE} fill="url(#cw)"/>
        <rect x="-1600" y="860" width="4800" height="1300" fill="#BCC3CC"/>
        {[-400, 200, 800, 1400, 2000].map(x => <line key={x} x1={x} y1="860" x2={x + (x - 800) * 0.6} y2="1100" stroke="#A6AEB9" strokeWidth="3"/>)}
        <line x1="-1600" y1="860" x2="3200" y2="860" stroke="#8C95A2" strokeWidth="4"/>
        {/* teto e luzes */}
        <rect x="-1600" y="-1200" width="4800" height="1250" fill="#EEF1F4"/>
        <line x1="-1600" y1="50" x2="3200" y2="50" stroke="#B9C0CA" strokeWidth="4"/>
        {[620, 740, 860, 980].map(x => <circle key={x} cx={x} cy="18" r="16" fill="#F7FAFC" stroke="#B9C0CA" strokeWidth="3"/>)}
        <rect x="610" y="90" width="380" height="26" rx="4" fill="#FBFDFF" stroke="#9AA3AF" strokeWidth="3" filter="url(#glow2)"/>
        {/* batentes */}
        <path d="M520 860V240L590 160H1010L1080 240V860H1040V250L990 200H610L560 250V860Z" fill="#8C95A1"/>
        <path d="M540 860V246L600 180H1000L1060 246V860" fill="none" stroke="#5E6775" strokeWidth="3"/>
        <rect x="430" y="300" width="70" height="420" rx="6" fill="#A7AFBA"/>
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x="444" y={320 + i * 27} width="42" height="9" rx="2" fill="#6E7785"/>)}
        <rect x="1100" y="500" width="60" height="140" rx="6" fill="#4E5664"/>
        <rect x="1110" y="512" width="40" height="56" rx="3" fill="#0C2C58"/>
        <g fill="#86E1F0">{[0, 1, 2, 3].map(i => <rect key={i} x="1116" y={520 + i * 12} width={[28, 18, 24, 12][i]} height="5" rx="2"/>)}</g>
        <circle cx="1130" cy="595" r="9" fill="#FFB347" filter="url(#glow2)" style={{ opacity: "clamp(0, calc(1 - var(--door) * 12), 1)" }}/>
        <circle cx="1130" cy="595" r="9" fill="#86E1F0" filter="url(#glow2)" style={{ opacity: "clamp(0, calc(var(--door) * 12), 1)" }}/>
        <rect x="1112" y="614" width="36" height="14" rx="3" fill="#6E7785"/>
        <rect x="690" y="126" width="220" height="26" rx="4" fill="#4E5664"/>
        <text x="800" y="144" textAnchor="middle" fontSize="13" fill="#E7EBF0" fontFamily="JetBrains Mono, monospace">MÓDULO DA TRIPULAÇÃO</text>
        {/* folhas da escotilha */}
        <g clipPath="url(#hole)">
          <g className="vb" style={doorL}>
            <rect x="560" y="200" width="240" height="660" fill="url(#dp)"/>
            <path d="M580 300L630 250H760V810H630L580 760Z" fill="#8F97A3"/>
            <path d="M592 306L636 262H748V798H636L592 754Z" fill="#7C8592"/>
            <path d="M700 500L660 530L700 560" fill="none" stroke="#F4F6F8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x="604" y={600 + i * 22} width="10" height="12" fill="#5E6775"/>)}
            <rect x="660" y="230" width="70" height="12" rx="3" fill="#5E6775"/>
            <rect x="660" y="826" width="70" height="12" rx="3" fill="#5E6775"/>
            <rect x="772" y="200" width="28" height="660" fill="#D7DCE2" stroke="#9AA3AF" strokeWidth="2"/>
            {[300, 324, 348].map(y => <path key={y} d={`M778 ${y + 10}L786 ${y}L794 ${y + 10}`} fill="none" stroke="#6E7785" strokeWidth="3"/>)}
            {[720, 744, 768].map(y => <path key={y} d={`M778 ${y}L786 ${y + 10}L794 ${y}`} fill="none" stroke="#6E7785" strokeWidth="3"/>)}
            <path d="M700 270L712 292H688Z" fill="none" stroke="#5E6775" strokeWidth="2.5"/>
          </g>
          <g className="vb" style={doorR}>
            <rect x="800" y="200" width="240" height="660" fill="url(#dp)"/>
            <path d="M1020 300L970 250H840V810H970L1020 760Z" fill="#8F97A3"/>
            <path d="M1008 306L964 262H852V798H964L1008 754Z" fill="#7C8592"/>
            <path d="M900 500L940 530L900 560" fill="none" stroke="#F4F6F8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x="986" y={600 + i * 22} width="10" height="12" fill="#5E6775"/>)}
            <rect x="870" y="230" width="70" height="12" rx="3" fill="#5E6775"/>
            <rect x="870" y="826" width="70" height="12" rx="3" fill="#5E6775"/>
            <text x="0" y="0" transform="translate(822 600) rotate(90)" fontSize="15" fill="#5E6775" fontFamily="JetBrains Mono, monospace" letterSpacing="3">AFASTE-SE</text>
            <g>{[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${880 + i * 14} 792l10 -14h6l-10 14z`} fill="#FFB347"/>)}</g>
          </g>
        </g>
      </g>
    </svg>
  );
}

function Intro() {
  const ref = useRef(null);
  const reduce = useMotionOff();
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => { const W = el.clientWidth, H = window.innerHeight; const sc = Math.max(W / 1600, H / 900); el.style.setProperty("--vu", (W / sc).toFixed(1)); };
    measure();
    if (reduce) { el.style.setProperty("--p", "0.30"); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), total = el.offsetHeight - window.innerHeight;
      el.style.setProperty("--p", Math.min(1, Math.max(0, -r.top / total)).toFixed(4));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onR = () => { measure(); on(); };
    update();
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", onR);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", onR); cancelAnimationFrame(raf); };
  }, [reduce]);

  return (
    <section ref={ref} className="intro relative" style={{ height: reduce ? "100vh" : "430vh", "--p": 0, "--vu": 1600 }} aria-label="Abertura: entrada na estação">
      <div className="sticky top-0 h-screen overflow-hidden">
        <SpaceView />
        <Bridge />
        <Hatch />

        <div className="absolute left-1/2 -translate-x-1/2 bottom-[6vh] text-center pointer-events-none px-6 py-3 rounded-xl bg-[#2E3542]/90 shadow-lg" style={{ opacity: "clamp(0, calc(1 - var(--p) * 14), 1)" }}>
          <div className="font-display font-bold text-2xl sm:text-3xl text-star leading-none">Raul Iemini</div>
          <div className="mt-1 text-silver text-[15px] whitespace-nowrap">Role para abrir a escotilha</div>
          <svg className="nudge mx-auto mt-1" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M5 8l6 6 6-6" fill="none" stroke="#FFB347" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        <a href="#topo" className="absolute right-4 top-[4.5rem] text-sm px-3 py-1.5 rounded-md bg-[#2E3542]/80 text-star hover:bg-[#2E3542] transition-colors">Pular abertura</a>
      </div>
    </section>
  );
}

/* ---------- Seções ---------- */
function MotionToggle() {
  const off = useMotionOff();
  return (
    <button onClick={() => setMotionOff(!off)} aria-pressed={off} title={off ? "Ativar animações" : "Pausar animações"}
      className="ml-auto text-[14px] px-2.5 py-1 rounded-md border border-line text-dim hover:text-star hover:border-dim transition-colors inline-flex items-center gap-1.5">
      {off
        ? <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2.5v9l7.5-4.5z" fill="currentColor"/></svg>
        : <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="2.5" width="2.8" height="9" fill="currentColor"/><rect x="8.2" y="2.5" width="2.8" height="9" fill="currentColor"/></svg>}
      <span className="hidden sm:inline">{off ? "Ativar animações" : "Pausar animações"}</span>
    </button>
  );
}

function Nav() {
  const utc = useUtcClock();
  const links = [["#orbitas", "Projetos"], ["#diario", "Trajetória"], ["#constelacoes", "Habilidades"], ["#insignias", "Certificações"], ["#contato", "Contato"]];
  return (
    <header className="sticky top-0 z-20 bg-ink/75 backdrop-blur-md border-b border-line/60">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center gap-6" aria-label="Principal">
        <a href="#topo" className="flex items-center gap-2.5 font-display font-bold text-xl tracking-wide">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="4.5" fill="#1B2E6E" stroke="#86E1F0" strokeWidth="1.2"/><ellipse cx="11" cy="11" rx="10" ry="3.6" transform="rotate(-20 11 11)" fill="none" stroke="#FFB347" strokeWidth="1.2"/></svg>
          Raul Iemini
        </a>
        <ul className="hidden md:flex items-center gap-6 text-[15px] text-dim ml-4">
          {links.map(([h, l]) => <li key={h}><a href={h} className="hover:text-star transition-colors">{l}</a></li>)}
        </ul>
        <MotionToggle />
        <button onClick={() => { window.dispatchEvent(new CustomEvent("select-orbit", { detail: "profile" })); document.getElementById("topo").scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" }); }}
          className="text-[14px] px-3 py-1 rounded-md border border-sodium/60 text-sodium hover:bg-sodium/10 transition-colors">Currículo</button>
        <div className="font-mono text-[13px] text-dim hidden sm:block" aria-label="Horário UTC"><span className="text-signal">UTC</span> {utc}</div>
      </nav>
    </header>
  );
}

function Hero() {
  const [sel, setSel] = useState("gsd");
  const onSelect = useCallback(id => setSel(id), []);
  const p = PROJECTS.find(x => x.id === sel);
  useEffect(() => {
    const h = e => setSel(e.detail);
    window.addEventListener("select-orbit", h);
    return () => window.removeEventListener("select-orbit", h);
  }, []);
  return (
    <section id="topo" className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 lg:pt-14 pb-20">
      <div className="grid lg:grid-cols-12 gap-x-10 gap-y-8">
        <div className="lg:col-span-5 boot">
          <h1 className="font-display font-extrabold leading-[0.86] text-[clamp(3.6rem,6vw,5.8rem)] text-star">
            <span className="block lg:whitespace-nowrap">{PERSON.name1}</span>
            <span className="block text-star/55">{PERSON.name2}</span>
          </h1>
          <p className="mt-6 text-xl text-star">{PERSON.role}.</p>
          <p className="mt-3 text-[17px] leading-relaxed text-dim max-w-[46ch]">
            Construo APIs em Java, C# e Python, interfaces em React e Vue, e um rastreador de satélites que calcula órbitas em tempo real, além de projetos em equipe nos Challenges da FIAP. Estou no último período de Análise e Desenvolvimento de Sistemas na FIAP.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-dim">
            <li className="flex items-center gap-2"><Pin/>São Paulo, SP</li>
            <li className="flex items-center gap-2"><Cap/>Formatura em dez/2026</li>
            <li className="flex items-center gap-2"><Wave/>Inglês C1</li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={PERSON.demo} target="_blank" rel="noopener" className="px-5 py-2.5 rounded-md bg-sodium text-ink font-bold hover:bg-[#ffc56e] transition-colors">Ver o rastreador ao vivo</a>
            <a href="#contato" className="px-5 py-2.5 rounded-md border border-line text-star hover:border-signal hover:text-signal transition-colors">Entrar em contato</a>
          </div>
        </div>

        <div id="orbitas" className="lg:col-span-7 lg:row-span-2 lg:order-none scroll-mt-20">
          <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6.5rem)] flex flex-col">
          <div className="flex-1 min-h-0 relative">
            <div className="viewport-frame h-full">
              <div className="viewport-inner h-full p-4 sm:p-5"><OrbitSystem selected={sel} onSelect={onSelect} /></div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-md bg-[#4E5664] font-mono text-[11px] text-[#E7EBF0] whitespace-nowrap" aria-hidden="true">JANELA DE OBSERVAÇÃO</div>
          </div>
          <div className="mt-4">
            <button onClick={() => setSel("profile")} aria-pressed={sel === "profile"}
              className={"text-sm px-3 py-1.5 rounded-full border transition-colors inline-flex items-center gap-2 " + (sel === "profile" ? "border-sodium text-sodium bg-sodium/10" : "border-line text-dim hover:text-star hover:border-dim")}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="#1B2E6E" stroke="currentColor" strokeWidth="1.2"/></svg>
              Planeta: perfil e currículo
            </button>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {[["solo", "Luas: projetos próprios", false], ["team", "Satélites: em equipe", true]].map(([gid, glabel, isTeam]) => (
            <div key={gid}>
            <p id={"legenda-" + gid} className="text-sm text-dim mb-2 flex items-center gap-2">
              {isTeam
                ? <svg width="18" height="8" viewBox="0 0 18 8" aria-hidden="true"><rect x="6.5" y="1.5" width="5" height="5" fill="#9AA6C7"/><rect x="0" y="1" width="5" height="6" fill="#9AA6C7"/><rect x="13" y="1" width="5" height="6" fill="#9AA6C7"/></svg>
                : <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><defs><radialGradient id="mg" cx=".35" cy=".35"><stop offset="0" stopColor="#E6DFCF"/><stop offset="1" stopColor="#5D5A66"/></radialGradient></defs><circle cx="6" cy="6" r="5.5" fill="url(#mg)"/><circle cx="7.5" cy="4.5" r="1.2" fill="rgba(20,20,40,.25)"/></svg>}
              {glabel}
            </p>
            <ul className="flex flex-wrap gap-2" aria-labelledby={"legenda-" + gid}>
              {PROJECTS.filter(x => !!x.team === isTeam).map(x => (
                <li key={x.id}>
                  <button onClick={() => setSel(x.id)} aria-pressed={x.id === sel}
                    className={"text-sm px-3 py-1.5 rounded-full border transition-colors " + (x.id === sel ? "border-sodium text-sodium bg-sodium/10" : "border-line text-dim hover:text-star hover:border-dim")}>
                    {x.short}
                  </button>
                </li>
              ))}
            </ul>
            </div>
            ))}
          </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          {sel === "profile" ? <ProfilePanel /> : <Telemetry p={p} />}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ id, title, children }) {
  return (
    <div className="lg:col-span-4">
      <div className="lg:sticky lg:top-24">
        <h2 id={id + "-t"} className="font-display font-bold text-5xl sm:text-6xl leading-none text-star">{title}</h2>
        {children && <p className="mt-4 text-dim text-[17px] leading-relaxed max-w-[40ch]">{children}</p>}
      </div>
    </div>
  );
}

function Timeline() {
  return (
    <section id="diario" aria-labelledby="diario-t" className="scroll-mt-16 border-t border-line/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-12 gap-10">
        <SectionHead id="diario" title="Diário de bordo">Da formação técnica em Minas até a última etapa da graduação em São Paulo, em ordem.</SectionHead>
        <ol className="lg:col-span-8 relative">
          <div className="absolute left-[7px] top-2 bottom-2 border-l border-dashed border-line" aria-hidden="true"></div>
          {TIMELINE.map((e, i) => (
            <li key={i} className="relative pl-10 pb-10 last:pb-0">
              <span aria-hidden="true" className={"absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 " + (e.live ? "border-signal bg-signal/30" : e.next ? "border-sodium bg-ink border-dashed" : "border-dim bg-ink")}></span>
              <div className={"font-mono text-[13px] " + (e.live ? "text-signal" : e.next ? "text-sodium" : "text-dim")}>{e.when}</div>
              <h3 className="mt-1 text-xl font-bold text-star">{e.title}</h3>
              <div className="text-dim">{e.where}</div>
              <p className="mt-2 text-star/85 leading-relaxed max-w-[62ch]">{e.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function useConstellationLayout() {
  return useMemo(() => {
    const rnd = mulberry32(7);
    return SKILLS.map(g => {
      const pts = [];
      const n = g.items.length;
      let guard = 0;
      while (pts.length < n && guard++ < 4000) {
        const ang = rnd() * Math.PI * 2, rad = 30 + rnd() * 105;
        const x = g.center[0] + Math.cos(ang) * rad * 1.25, y = g.center[1] + Math.sin(ang) * rad * 0.8;
        if (x < 40 || x > 960 || y < 40 || y > 560) continue;
        if (pts.every(p => Math.hypot(p.x - x, p.y - y) > 52)) pts.push({ x, y });
      }
      // caminho por vizinho mais próximo, partindo do ponto mais à esquerda
      const rest = pts.slice().sort((a, b) => a.x - b.x);
      const path = [rest.shift()];
      while (rest.length) {
        const last = path[path.length - 1];
        let bi = 0, bd = Infinity;
        rest.forEach((p, i) => { const d = Math.hypot(p.x - last.x, p.y - last.y); if (d < bd) { bd = d; bi = i; } });
        path.push(rest.splice(bi, 1)[0]);
      }
      return { ...g, stars: path.map((p, i) => ({ ...p, label: g.items[i] })) };
    });
  }, []);
}

function Constellations() {
  const groups = useConstellationLayout();
  const [active, setActive] = useState("back");
  const ag = groups.find(g => g.id === active);
  const bg = useMemo(() => { const r = mulberry32(99); return Array.from({ length: 140 }, () => ({ x: r() * 1000, y: r() * 600, r: r() * 1.1 + 0.3, o: 0.15 + r() * 0.4 })); }, []);
  return (
    <section id="constelacoes" aria-labelledby="constelacoes-t" className="scroll-mt-16 border-t border-line/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-12 gap-10">
        <SectionHead id="constelacoes" title="Constelações">Cada constelação reúne uma área de conhecimento. Passe o cursor sobre ela ou escolha uma área para ler as estrelas.</SectionHead>
        <div className="lg:col-span-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Áreas">
            {groups.map(g => (
              <button key={g.id} role="tab" aria-selected={g.id === active} onClick={() => setActive(g.id)}
                className={"text-sm px-3 py-1.5 rounded-full border transition-colors " + (g.id === active ? "border-sodium text-sodium bg-sodium/10" : "border-line text-dim hover:text-star hover:border-dim")}>
                {g.name} <span className="font-mono text-xs opacity-70">{g.items.length}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-line bg-ink/60 overflow-hidden">
            <svg viewBox="0 0 1000 600" className="w-full h-auto block" role="img" aria-label={"Mapa de constelações. Área ativa: " + ag.name + ": " + ag.items.join(", ")}>
              <defs>
                <radialGradient id="sg"><stop offset="0" stopColor="#FFB347" stopOpacity=".55"/><stop offset="1" stopColor="#FFB347" stopOpacity="0"/></radialGradient>
              </defs>
              {/* grade de coordenadas celestes */}
              {[100, 200, 300, 400, 500].map(y => <path key={"d" + y} d={`M0 ${y} Q500 ${y - 40} 1000 ${y}`} fill="none" stroke="#23356E" strokeWidth="1" opacity=".55"/>)}
              {[125, 250, 375, 500, 625, 750, 875].map(x => <path key={"r" + x} d={`M${x} 0 Q${x + (x - 500) * 0.08} 300 ${x} 600`} fill="none" stroke="#23356E" strokeWidth="1" opacity=".55"/>)}
              {bg.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#EDE6D3" opacity={s.o}/>)}
              {groups.map(g => {
                const on = g.id === active;
                return (
                  <g key={g.id} onMouseEnter={() => setActive(g.id)} style={{ cursor: "pointer" }} onClick={() => setActive(g.id)}>
                    <polyline points={g.stars.map(s => `${s.x},${s.y}`).join(" ")} fill="none" stroke={on ? "#FFB347" : "#EDE6D3"} strokeOpacity={on ? 0.8 : 0.18} strokeWidth={on ? 1.5 : 1} style={{ transition: "stroke-opacity .3s" }}/>
                    {g.stars.map(s => (
                      <g key={s.label}>
                        <circle cx={s.x} cy={s.y} r="22" fill="transparent"/>
                        {on && <circle cx={s.x} cy={s.y} r="16" fill="url(#sg)"/>}
                        <circle cx={s.x} cy={s.y} r={on ? 4.2 : 3} fill={on ? "#FFE2B8" : "#EDE6D3"} opacity={on ? 1 : 0.55}/>
                        {on && <text x={s.x + 11} y={s.y + 4} fontSize="15" fill="#EDE6D3" fontFamily="Red Hat Text, sans-serif" style={{ paintOrder: "stroke", stroke: "#081230", strokeWidth: 5 }}>{s.label}</text>}
                      </g>
                    ))}
                    <text x={g.stars.reduce((m, s) => m + s.x, 0) / g.stars.length} y={Math.max(30, Math.min(...g.stars.map(s => s.y)) - 22)} textAnchor="middle" fontSize={on ? 30 : 24} fill={on ? "#FFB347" : "#9AA6C7"} opacity={on ? 1 : 0.7} fontFamily="Big Shoulders Display, sans-serif" fontWeight="700">{g.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-star/90" aria-label={"Habilidades em " + ag.name}>
            {ag.items.map(s => <li key={s} className="flex items-center gap-2"><span className="text-sodium" aria-hidden="true">✦</span>{s}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Glyph({ kind, color }) {
  const s = { fill: "none", stroke: color, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "code") return <g {...s}><path d="M86 68l-12 10 12 10"/><path d="M114 68l12 10-12 10"/><path d="M104 64l-8 28"/></g>;
  if (kind === "grid") return <g {...s}><rect x="82" y="62" width="14" height="14"/><rect x="104" y="62" width="14" height="14"/><rect x="82" y="82" width="14" height="10"/><path d="M104 87h14"/></g>;
  if (kind === "wave") return <g {...s}><path d="M78 78q6-12 11 0t11 0 11 0 11 0"/><path d="M84 88q5-7 9 0t9 0 9 0"/></g>;
  return <g {...s}><path d="M100 60c8 6 11 16 9 28h-18c-2-12 1-22 9-28z"/><path d="M91 84l-6 8h7M109 84l6 8h-7"/><circle cx="100" cy="72" r="3"/></g>;
}

function Patch({ b, i }) {
  const id = "pt" + i;
  return (
    <figure className="flex flex-col items-center text-center">
      <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-44 sm:h-44" aria-hidden="true">
        <defs>
          <path id={id + "a"} d="M100,100 m-70,0 a70,70 0 1,1 140,0"/>
          <path id={id + "b"} d="M22,100 a78,78 0 0,0 156,0"/>
        </defs>
        <circle cx="100" cy="100" r="94" fill="#0D1B46" stroke={b.tone} strokeWidth="3"/>
        <circle cx="100" cy="100" r="88" fill="none" stroke={b.tone} strokeOpacity=".35" strokeWidth="1"/>
        <circle cx="100" cy="100" r="58" fill="#081230" stroke={b.tone} strokeWidth="1.5"/>
        <text fontSize="13" letterSpacing="2.5" fill={b.tone} fontFamily="Red Hat Text, sans-serif" fontWeight="700"><textPath href={"#" + id + "a"} startOffset="50%" textAnchor="middle">{b.ring}</textPath></text>
        <text fontSize="11" letterSpacing="2" fill={b.tone} fillOpacity=".8" fontFamily="Red Hat Text, sans-serif"><textPath href={"#" + id + "b"} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">{b.bottom}</textPath></text>
        <circle cx="31" cy="100" r="2.5" fill={b.tone}/><circle cx="169" cy="100" r="2.5" fill={b.tone}/>
        <Glyph kind={b.glyph} color={b.tone}/>
        <text x="100" y="124" textAnchor="middle" fontSize="28" fill="#EDE6D3" fontFamily="Big Shoulders Display, sans-serif" fontWeight="800">{b.center}</text>
      </svg>
      <figcaption className="mt-4 max-w-[26ch]">
        <div className="font-bold text-star leading-snug">{b.title}</div>
        <div className="text-sm text-dim mt-1">{b.meta}</div>
      </figcaption>
    </figure>
  );
}

function Badges() {
  return (
    <section id="insignias" aria-labelledby="insignias-t" className="scroll-mt-16 border-t border-line/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-12 gap-10">
        <SectionHead id="insignias" title="Insígnias de missão">Certificações e cursos concluídos ao longo da formação.</SectionHead>
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-12">
            {BADGES.map((b, i) => <Patch key={i} b={b} i={i} />)}
          </div>
          <div className="mt-14 grid sm:grid-cols-2 gap-8 border-t border-line pt-8">
            {COURSES.map(c => (
              <div key={c.from}>
                <h3 className="font-display font-bold text-2xl text-star">{c.from}</h3>
                <ul className="mt-3 space-y-1.5 text-star/85">
                  {c.items.map(it => <li key={it} className="flex gap-3"><span className="mt-[9px] w-1.5 h-1.5 shrink-0 rotate-45 bg-signal/70" aria-hidden="true"></span>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CopyRow({ label, value, href }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1800); }
    catch { setDone("fail"); setTimeout(() => setDone(false), 2500); }
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 border-b border-line">
      <div className="w-24 text-dim text-sm">{label}</div>
      {href ? <a href={href} target="_blank" rel="noopener" className="text-lg text-star hover:text-signal break-all">{value}</a> : <span className="text-lg text-star select-all break-all">{value}</span>}
      <button onClick={copy} className="ml-auto text-sm px-3 py-1 rounded-md border border-line text-dim hover:text-star hover:border-dim transition-colors min-w-[88px]">
        {done === true ? "Copiado" : done === "fail" ? "Selecione e copie" : "Copiar"}
      </button>
    </div>
  );
}

function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-t" className="scroll-mt-16 border-t border-line/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-12 gap-10">
        <SectionHead id="contato" title="Abrir canal">Procuro uma vaga num time de desenvolvimento para aplicar e evoluir o que construí até aqui. O jeito mais rápido de falar comigo é por e-mail ou LinkedIn.</SectionHead>
        <div className="lg:col-span-8 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            <CopyRow label="E-mail" value={PERSON.email} />
            <CopyRow label="Telefone" value={PERSON.phone} />
            <CopyRow label="LinkedIn" value="linkedin.com/in/raul-iemini" href={PERSON.linkedin} />
            <CopyRow label="GitHub" value="github.com/RaulRezende09" href={PERSON.github} />
          </div>
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-2xl text-star">Frequências</h3>
            <p className="text-sm text-dim mt-1">Idiomas, com intensidade de sinal pelo nível.</p>
            <ul className="mt-5 space-y-5">
              {LANGS.map(l => (
                <li key={l.name} className="flex items-end gap-4">
                  <div className="flex items-end gap-[3px] h-6" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map(n => <span key={n} style={{ height: 6 + n * 4 + "px" }} className={"w-[5px] rounded-sm " + (n <= l.bars ? "bg-signal" : "bg-line")}></span>)}
                  </div>
                  <div>
                    <div className="font-bold text-star leading-tight">{l.name}</div>
                    <div className="text-sm text-dim">{l.level}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <footer className="max-w-7xl mx-auto px-5 sm:px-8 py-8 border-t border-line/60 text-sm text-dim flex flex-wrap gap-4 justify-between">
        <span>Raul Rezende Iemini Aguiar, 2026</span>
        <a href="#topo" className="hover:text-star">Voltar ao topo</a>
      </footer>
    </section>
  );
}

function Pin() { return <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15z" fill="none" stroke="#86E1F0" strokeWidth="1.4"/><circle cx="8" cy="6.5" r="1.8" fill="#86E1F0"/></svg>; }
function Cap() { return <svg width="16" height="15" viewBox="0 0 18 16" aria-hidden="true"><path d="M1 6l8-4 8 4-8 4z" fill="none" stroke="#86E1F0" strokeWidth="1.4" strokeLinejoin="round"/><path d="M4.5 8v3.5c2.5 2 6.5 2 9 0V8" fill="none" stroke="#86E1F0" strokeWidth="1.4"/></svg>; }
function Wave() { return <svg width="16" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 12a8.5 8.5 0 0 1 12 0M4.5 9.2a5 5 0 0 1 7 0" fill="none" stroke="#86E1F0" strokeWidth="1.4" strokeLinecap="round"/><circle cx="8" cy="12.5" r="1.3" fill="#86E1F0"/></svg>; }

function App() {
  useEffect(() => { const l = document.getElementById("loading"); if (l) l.remove(); }, []);
  return (
    <>
      <Starfield />
      <a href="#orbitas" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-sodium text-ink px-3 py-1 rounded">Pular para os projetos</a>
      <Nav />
      <main>
        <Intro />
        <Hero />
        <Timeline />
        <Constellations />
        <Badges />
        <Contact />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
