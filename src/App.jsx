import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   DESIGN SYSTEM — Éditorial · Chaleureux · Humain
   Inspiré des magazines africains haut de gamme
   Palette : Crème ivoire / Terre brûlée / Encre
───────────────────────────────────────────────*/
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  :root {
    --cream:    #f5f0e8;
    --cream2:   #ede6d6;
    --cream3:   #e0d5c0;
    --ink:      #1c1812;
    --ink2:     #3a3228;
    --ink3:     #6b5f52;
    --ink4:     #9c8e80;
    --terra:    #b85c38;
    --terra2:   #d4764e;
    --gold:     #c49a3c;
    --border:   #d4c9b5;
    --border2:  #c2b49e;
  }

  html, body {
    background: var(--cream);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius:99px; }
  ::selection { background: rgba(180,90,50,0.15); }
  input, textarea, button, select { font-family: inherit; }

  /* ── Animations ── */
  @keyframes slideIn {
    from { opacity:0; transform:translateX(18px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes spin { to { transform:rotate(360deg); } }

  .slide { animation: slideIn 0.38s cubic-bezier(0.16,1,0.3,1) both; }

  /* ── Inputs ── */
  .field {
    width:100%;
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    padding: 11px 14px;
    color: var(--ink);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }
  .field:focus {
    border-color: var(--terra);
    box-shadow: 0 0 0 3px rgba(184,92,56,0.1);
  }
  .field::placeholder { color: var(--ink4); font-style: italic; }
  .field:disabled { opacity:0.4; cursor:not-allowed; background: var(--cream2); }
  .field.err {
    border-color: #c0392b;
    box-shadow: 0 0 0 3px rgba(192,57,43,0.08);
  }

  /* ── Boutons ── */
  .btn-main {
    background: var(--terra);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 12px 28px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: inline-flex; align-items:center; gap:8px;
  }
  .btn-main:hover { background: var(--terra2); transform: translateY(-1px); }
  .btn-main:active { transform: translateY(0); }
  .btn-main:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

  .btn-line {
    background: transparent;
    color: var(--ink3);
    border: 1.5px solid var(--border);
    border-radius: 6px;
    padding: 11px 22px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-line:hover { border-color: var(--ink3); color: var(--ink); }

  .btn-text {
    background: none; border: none;
    color: var(--ink4); font-size: 12px;
    cursor: pointer; padding: 4px;
    transition: color 0.2s; text-decoration: underline;
    text-underline-offset: 3px;
  }
  .btn-text:hover { color: #c0392b; }

  .btn-add {
    width:100%; background: none;
    border: 1.5px dashed var(--border2);
    border-radius: 6px; padding: 12px;
    color: var(--ink4); font-size: 13px;
    cursor: pointer; transition: all 0.2s;
    letter-spacing: 0.2px;
  }
  .btn-add:hover { border-color: var(--terra); color: var(--terra); background: rgba(184,92,56,0.03); }

  /* ── Step nav ── */
  .step-item { transition: all 0.18s; cursor: pointer; }
  .step-item:hover .step-txt { color: var(--terra) !important; }

  /* ── Template cards ── */
  .tcard { transition: all 0.18s; cursor: pointer; }
  .tcard:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

  /* ── Photo zone ── */
  .photo-drop {
    width: 90px; height: 110px;
    border: 2px dashed var(--border2);
    border-radius: 8px;
    display: flex; flex-direction:column;
    align-items:center; justify-content:center;
    cursor:pointer; transition: all 0.2s;
    background: var(--cream2); flex-shrink:0;
    overflow:hidden;
  }
  .photo-drop:hover { border-color: var(--terra); background: rgba(184,92,56,0.05); }

  /* ── Séparateur décoratif ── */
  .ornament {
    display: flex; align-items:center; gap:10px;
    color: var(--ink4); font-size:11px; letter-spacing:2px;
    text-transform:uppercase; margin: 6px 0 18px;
  }
  .ornament::before, .ornament::after {
    content:''; flex:1; height:1px; background: var(--border);
  }
`;

/* ─────────────────────────────
   DONNÉES
──────────────────────────────*/
const STEPS = [
  { id:"profile",    label:"Profil",       short:"01" },
  { id:"experience", label:"Expériences",  short:"02" },
  { id:"education",  label:"Formation",    short:"03" },
  { id:"extras",     label:"Compétences",  short:"04" },
  { id:"references", label:"Références",   short:"05" },
  { id:"template",   label:"Modèle",       short:"06" },
  { id:"result",     label:"Votre CV",     short:"07" },
];

const TEMPLATES = [
  { id:"executive", name:"Executive",  tag:"Cadre dirigeant",   accent:"#c8a96e", bg:"#1a1810" },
  { id:"tech",      name:"Tech",       tag:"Développeur · IT",  accent:"#64ffda", bg:"#020c1b" },
  { id:"creative",  name:"Creative",   tag:"Design · Artiste",  accent:"#ff6b9d", bg:"#1a0a2e" },
  { id:"minimal",   name:"Minimal",    tag:"Universel",          accent:"#111",    bg:"#f8f8f6" },
  { id:"corporate", name:"Corporate",  tag:"Finance · Conseil", accent:"#4fc3f7", bg:"#071522" },
  { id:"academic",  name:"Academic",   tag:"Recherche · Éduc.", accent:"#8b5cf6", bg:"#0e0a1a" },
  { id:"medical",   name:"Medical",    tag:"Santé · Sciences",  accent:"#34d399", bg:"#061a12" },
  { id:"legal",     name:"Legal",      tag:"Droit · Notariat",  accent:"#b8860b", bg:"#1a1508" },
  { id:"marketing", name:"Marketing",  tag:"Com · Growth",      accent:"#f97316", bg:"#1a0c06" },
  { id:"startup",   name:"Startup",    tag:"Entrepreneur · PM", accent:"#818cf8", bg:"#06060f" },
];

// ── Modèles ATS : 1 colonne, texte lisible par les robots recruteurs ──
const ATS_TEMPLATES = [
  { id:"ats-clarte",      name:"Clarté",         tag:"Universel · Tous secteurs" },
  { id:"ats-dakar",       name:"Dakar",           tag:"Entreprises UEMOA · Afrique de l'Ouest" },
  { id:"ats-sahel",       name:"Sahel",           tag:"Cadres · Managers" },
  { id:"ats-diplomate",   name:"Diplomate",       tag:"Institutions · ONU · Administrations" },
  { id:"ats-ingenieur",   name:"Ingénieur",       tag:"IT · BTP · Industrie · Génie civil" },
  { id:"ats-consultant",  name:"Consultant",      tag:"Audit · Finance · Conseil" },
  { id:"ats-academique",  name:"Académique",      tag:"Recherche · Enseignement · Publications" },
  { id:"ats-humanitaire", name:"Humanitaire",     tag:"ONG · UNICEF · Oxfam · USAID · PAM" },
  { id:"ats-junior",      name:"Junior",          tag:"Jeunes diplômés · Stages · Premier emploi" },
  { id:"ats-cadre",       name:"Cadre Supérieur", tag:"DG · DRH · Directeurs · Exécutifs" },
];

const INIT = {
  photo: null,
  firstName:"", lastName:"", title:"", email:"", phone:"",
  location:"", linkedin:"", summary:"",
  experiences:[{ company:"", role:"", start:"", end:"", current:false, description:"" }],
  education:[{ school:"", degree:"", field:"", start:"", end:"" }],
  skills:"", languages:"",
  hobbies:[{ label:"" }],
  references:[{ name:"", role:"", company:"", email:"", phone:"" }],
  refsOnRequest: false,
  signatureCity:"", signatureDate:"",
  template:"executive",
};

/* ─────────────────────────────
   PRIMITIVES UI
──────────────────────────────*/
const Label = ({ t, required }) => (
  <label style={{ display:"block", fontSize:11, fontWeight:600, textTransform:"uppercase",
    letterSpacing:"1.8px", color:"var(--ink3)", marginBottom:6, fontFamily:"'DM Mono',monospace" }}>
    {t}{required && <span style={{ color:"var(--terra)", marginLeft:3 }}>*</span>}
  </label>
);

const Grid2 = ({ children }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>{children}</div>
);
const Stack = ({ children, gap=16 }) => (
  <div style={{ display:"grid", gap }}>{children}</div>
);
const Block = ({ children }) => (
  <div style={{ background:"#fff", border:"1.5px solid var(--border)", borderRadius:10,
    padding:20, marginBottom:0 }}>{children}</div>
);
const BlockHeader = ({ label, onRemove }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16,
    paddingBottom:12, borderBottom:"1px solid var(--cream3)" }}>
    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, fontWeight:500,
      color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"1.5px" }}>{label}</span>
    {onRemove && <button className="btn-text" onClick={onRemove}>Retirer</button>}
  </div>
);

/* Section titre décoratif */
const SectionTitle = ({ t }) => (
  <div style={{ marginBottom:20 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ width:3, height:22, background:"var(--terra)", borderRadius:2 }}/>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:600,
        color:"var(--ink)", letterSpacing:"-0.3px" }}>{t}</h2>
    </div>
    <div style={{ height:1, background:"var(--border)", marginTop:12 }}/>
  </div>
);

/* ─────────────────────────────
   CV RENDERERS (inchangés)
──────────────────────────────*/
const Sec = ({ t, a, children }) => (
  <div style={{ marginBottom:16 }}>
    <div style={{ fontSize:8.5, fontWeight:800, textTransform:"uppercase", letterSpacing:"3.5px",
      color:a, borderBottom:`1.5px solid ${a}35`, paddingBottom:4, marginBottom:9 }}>{t}</div>
    {children}
  </div>
);
const ExpBlk = ({ e, a }) => (
  <div style={{ marginBottom:11 }}>
    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <strong style={{ fontSize:11.5 }}>{e.role}</strong>
      <span style={{ fontSize:9.5, color:"#999" }}>{e.start}–{e.current?"Présent":e.end}</span>
    </div>
    <div style={{ fontSize:10.5, color:a, marginBottom:2 }}>{e.company}</div>
    <p style={{ fontSize:10.5, color:"#555", lineHeight:1.6, margin:0 }}>{e.description}</p>
  </div>
);
const EduBlk = ({ e }) => (
  <div style={{ marginBottom:8 }}>
    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <strong style={{ fontSize:11.5 }}>{e.degree} {e.field}</strong>
      <span style={{ fontSize:9.5, color:"#999" }}>{e.start}–{e.end}</span>
    </div>
    <div style={{ fontSize:10.5, color:"#999" }}>{e.school}</div>
  </div>
);
function CVFooter({ cv, a }) {
  const hasHobbies = cv.hobbies?.filter(h=>h.label).length > 0;
  const hasRefs    = cv.references?.filter(r=>r.name).length > 0;
  const hasSig     = cv.signatureCity || cv.signatureDate;
  return (
    <>
      {hasHobbies&&<Sec t="Centres d'intérêt" a={a}><div style={{display:"flex",flexWrap:"wrap",gap:"6px 12px"}}>{cv.hobbies.filter(h=>h.label).map((h,i)=><span key={i} style={{fontSize:10.5,color:"#555",background:`${a}12`,border:`1px solid ${a}25`,borderRadius:20,padding:"2px 10px"}}>{h.label}</span>)}</div></Sec>}
      {hasRefs&&<Sec t="Références professionnelles" a={a}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>{cv.references.filter(r=>r.name).map((r,i)=><div key={i} style={{fontSize:10.5,lineHeight:1.7}}><div style={{fontWeight:700,color:"#222"}}>{r.name}</div>{r.role&&<div style={{color:a,fontSize:10}}>{r.role}{r.company?` · ${r.company}`:""}</div>}{r.email&&<div style={{color:"#777",fontSize:9.5}}>{r.email}</div>}{r.phone&&<div style={{color:"#777",fontSize:9.5}}>{r.phone}</div>}</div>)}</div></Sec>}
      {cv.refsOnRequest&&!hasRefs&&<div style={{fontSize:10,color:"#999",fontStyle:"italic",marginTop:8}}>Références disponibles sur demande.</div>}
      {hasSig&&<div style={{marginTop:24,display:"flex",justifyContent:"flex-end"}}><div style={{textAlign:"right",fontSize:10.5,color:"#888"}}><div>{[cv.signatureCity,cv.signatureDate].filter(Boolean).join(", le ")}</div><div style={{marginTop:28,borderTop:`1px solid ${a}50`,paddingTop:4,fontSize:10,color:"#aaa",minWidth:160}}>Signature</div></div></div>}
    </>
  );
}
function CVExecutive({ cv }) {
  return <div style={{fontFamily:"'Georgia',serif",background:"#fff",color:"#111",padding:"36px 40px",minHeight:680}}><div style={{borderBottom:"2.5px solid #c8a96e",paddingBottom:16,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{fontSize:24,fontWeight:700}}>{cv.name}</div><div style={{color:"#c8a96e",fontSize:12,fontWeight:600,marginTop:3}}>{cv.title}</div><div style={{fontSize:9.5,color:"#777",lineHeight:2,marginTop:6}}>{[cv.email,cv.phone,cv.location,cv.linkedin].filter(Boolean).join("  ·  ")}</div></div>{cv.photo&&<img src={cv.photo} alt="" style={{width:72,height:86,objectFit:"cover",borderRadius:6,marginLeft:16,border:"2px solid #c8a96e30"}}/>}</div>{cv.summary&&<Sec t="Profil" a="#c8a96e"><p style={{fontSize:11,lineHeight:1.75,color:"#444",margin:0}}>{cv.summary}</p></Sec>}{cv.experiences?.length>0&&<Sec t="Expériences" a="#c8a96e">{cv.experiences.map((e,i)=><ExpBlk key={i} e={e} a="#c8a96e"/>)}</Sec>}{cv.education?.length>0&&<Sec t="Formation" a="#c8a96e">{cv.education.map((e,i)=><EduBlk key={i} e={e}/>)}</Sec>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{cv.skills&&<Sec t="Compétences" a="#c8a96e"><p style={{fontSize:10.5,color:"#555",margin:0}}>{cv.skills}</p></Sec>}{cv.languages&&<Sec t="Langues" a="#c8a96e"><p style={{fontSize:10.5,color:"#555",margin:0}}>{cv.languages}</p></Sec>}</div><CVFooter cv={cv} a="#c8a96e"/></div>;
}
function CVTech({ cv }) {
  return <div style={{fontFamily:"'Courier New',monospace",background:"#020c1b",color:"#8892b0",padding:"36px",minHeight:680}}><div style={{borderLeft:"3px solid #64ffda",paddingLeft:16,marginBottom:26,display:"flex",gap:16,alignItems:"flex-start"}}><div style={{flex:1}}><div style={{color:"#ccd6f6",fontSize:22,fontWeight:700}}>{cv.name}</div><div style={{color:"#64ffda",fontSize:11,marginTop:3}}>{cv.title}</div><div style={{fontSize:9.5,marginTop:7,color:"#4a5568"}}>{[cv.email,cv.phone,cv.location].filter(Boolean).join(" · ")}</div></div>{cv.photo&&<img src={cv.photo} alt="" style={{width:60,height:72,objectFit:"cover",borderRadius:6,border:"2px solid #64ffda30"}}/>}</div>{cv.summary&&<div style={{marginBottom:18}}><div style={{fontSize:9,color:"#64ffda",marginBottom:5}}>// about</div><p style={{fontSize:10.5,lineHeight:1.75,margin:0}}>{cv.summary}</p></div>}{cv.experiences?.length>0&&<div style={{marginBottom:18}}><div style={{fontSize:9,color:"#64ffda",marginBottom:9}}>// experience</div>{cv.experiences.map((e,i)=><div key={i} style={{marginBottom:12}}><div style={{color:"#ccd6f6",fontWeight:700,fontSize:11}}>{e.role} <span style={{color:"#64ffda"}}>@</span> {e.company} <span style={{color:"#4a5568",fontSize:9.5}}>({e.start}–{e.current?"now":e.end})</span></div><p style={{fontSize:10.5,lineHeight:1.65,margin:"3px 0 0"}}>{e.description}</p></div>)}</div>}{cv.education?.length>0&&<div style={{marginBottom:18}}><div style={{fontSize:9,color:"#64ffda",marginBottom:8}}>// education</div>{cv.education.map((e,i)=><div key={i} style={{fontSize:10.5,marginBottom:6}}><span style={{color:"#ccd6f6"}}>{e.degree} {e.field}</span> — {e.school}</div>)}</div>}{cv.skills&&<div style={{marginBottom:14}}><div style={{fontSize:9,color:"#64ffda",marginBottom:5}}>// skills</div><p style={{fontSize:10.5,margin:0}}>{cv.skills}</p></div>}<CVFooter cv={cv} a="#64ffda"/></div>;
}
function CVCreative({ cv }) {
  return <div style={{fontFamily:"'Georgia',serif",background:"#fff",minHeight:680,display:"grid",gridTemplateColumns:"180px 1fr"}}><div style={{background:"#1a0a2e",padding:"28px 16px"}}>{cv.photo?<img src={cv.photo} alt="" style={{width:80,height:96,objectFit:"cover",borderRadius:10,marginBottom:14,border:"2px solid #ff6b9d50"}}/>:<div style={{width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#ff6b9d,#c44dff)",marginBottom:14}}/>}<div style={{color:"#fff",fontSize:14,fontWeight:700}}>{cv.name}</div><div style={{color:"#ff6b9d",fontSize:9.5,fontStyle:"italic",marginTop:3}}>{cv.title}</div><div style={{marginTop:18,fontSize:9,color:"#aaa",lineHeight:2.1}}>{[cv.email,cv.phone,cv.location].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}</div>{cv.skills&&<><div style={{color:"#ff6b9d",fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:2,marginTop:20,marginBottom:8}}>Skills</div><p style={{fontSize:9,color:"#ccc",lineHeight:1.9,margin:0}}>{cv.skills}</p></>}{cv.languages&&<><div style={{color:"#ff6b9d",fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:2,marginTop:14,marginBottom:6}}>Langues</div><p style={{fontSize:9,color:"#ccc",margin:0}}>{cv.languages}</p></>}</div><div style={{padding:"28px 24px"}}>{cv.summary&&<div style={{borderLeft:"3px solid #ff6b9d",paddingLeft:12,marginBottom:16}}><p style={{fontSize:11,color:"#444",lineHeight:1.75,fontStyle:"italic",margin:0}}>{cv.summary}</p></div>}{cv.experiences?.length>0&&<Sec t="Expériences" a="#ff6b9d">{cv.experiences.map((e,i)=><ExpBlk key={i} e={e} a="#ff6b9d"/>)}</Sec>}{cv.education?.length>0&&<Sec t="Formation" a="#ff6b9d">{cv.education.map((e,i)=><EduBlk key={i} e={e}/>)}</Sec>}<CVFooter cv={cv} a="#ff6b9d"/></div></div>;
}
function CVMinimal({ cv }) {
  return <div style={{fontFamily:"'Helvetica Neue',sans-serif",background:"#fff",color:"#111",padding:"44px 40px",minHeight:680}}><div style={{marginBottom:26,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:28,fontWeight:200,letterSpacing:4,textTransform:"uppercase"}}>{cv.name}</div><div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"#aaa",marginTop:5}}>{cv.title}</div><div style={{display:"flex",gap:14,marginTop:10,fontSize:9.5,color:"#bbb"}}>{[cv.email,cv.phone,cv.location].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}</div></div>{cv.photo&&<img src={cv.photo} alt="" style={{width:64,height:78,objectFit:"cover",borderRadius:4}}/>}</div><div style={{height:1,background:"#eee",marginBottom:24}}/>{cv.summary&&<div style={{marginBottom:24}}><p style={{fontSize:11,color:"#666",lineHeight:1.85,margin:0}}>{cv.summary}</p></div>}{cv.experiences?.length>0&&<div style={{marginBottom:22}}><div style={{fontSize:8,letterSpacing:4,textTransform:"uppercase",color:"#ccc",marginBottom:12}}>Expérience</div>{cv.experiences.map((e,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:10,marginBottom:12}}><div style={{fontSize:9.5,color:"#ccc",paddingTop:2}}>{e.start}–{e.current?"now":e.end}</div><div><div style={{fontWeight:600,fontSize:11}}>{e.role}</div><div style={{fontSize:10,color:"#aaa"}}>{e.company}</div><p style={{fontSize:10,color:"#777",marginTop:3,lineHeight:1.6,marginBottom:0}}>{e.description}</p></div></div>)}</div>}{cv.education?.length>0&&<div style={{marginBottom:22}}><div style={{fontSize:8,letterSpacing:4,textTransform:"uppercase",color:"#ccc",marginBottom:10}}>Formation</div>{cv.education.map((e,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:10,marginBottom:9}}><div style={{fontSize:9.5,color:"#ccc"}}>{e.start}–{e.end}</div><div><div style={{fontWeight:600,fontSize:11}}>{e.degree} {e.field}</div><div style={{fontSize:10,color:"#aaa"}}>{e.school}</div></div></div>)}</div>}{cv.skills&&<div style={{marginBottom:14}}><div style={{fontSize:8,letterSpacing:4,textTransform:"uppercase",color:"#ccc",marginBottom:7}}>Compétences</div><p style={{fontSize:10,color:"#777",margin:0}}>{cv.skills}</p></div>}<CVFooter cv={cv} a="#111"/></div>;
}
function CVCorporate({ cv }) {
  return <div style={{fontFamily:"'Georgia',serif",background:"#fff",minHeight:680}}><div style={{background:"#0d1b2a",padding:"24px 34px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:20,fontWeight:700,letterSpacing:1.5,color:"#fff"}}>{cv.name?.toUpperCase()}</div><div style={{color:"#4fc3f7",fontSize:11,fontWeight:600,marginTop:3}}>{cv.title}</div><div style={{fontSize:9.5,color:"#90a4ae",marginTop:5}}>{[cv.email,cv.phone,cv.location].filter(Boolean).join("  ·  ")}</div></div>{cv.photo&&<img src={cv.photo} alt="" style={{width:62,height:74,objectFit:"cover",borderRadius:6,border:"2px solid #4fc3f730"}}/>}</div><div style={{padding:"24px 34px"}}>{cv.summary&&<Sec t="Synthèse" a="#4fc3f7"><p style={{fontSize:11,lineHeight:1.75,color:"#333",margin:0}}>{cv.summary}</p></Sec>}{cv.experiences?.length>0&&<Sec t="Parcours" a="#4fc3f7">{cv.experiences.map((e,i)=><ExpBlk key={i} e={e} a="#4fc3f7"/>)}</Sec>}{cv.education?.length>0&&<Sec t="Formation" a="#4fc3f7">{cv.education.map((e,i)=><EduBlk key={i} e={e}/>)}</Sec>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{cv.skills&&<Sec t="Compétences" a="#4fc3f7"><p style={{fontSize:10.5,color:"#555",margin:0}}>{cv.skills}</p></Sec>}{cv.languages&&<Sec t="Langues" a="#4fc3f7"><p style={{fontSize:10.5,color:"#555",margin:0}}>{cv.languages}</p></Sec>}</div><CVFooter cv={cv} a="#4fc3f7"/></div></div>;
}
function CVAcademic({ cv }) {
  return <div style={{fontFamily:"'Times New Roman',serif",background:"#fff",color:"#111",padding:"38px",minHeight:680}}><div style={{textAlign:"center",borderBottom:"2px solid #8b5cf6",paddingBottom:16,marginBottom:20,position:"relative"}}>{cv.photo&&<img src={cv.photo} alt="" style={{width:60,height:72,objectFit:"cover",borderRadius:4,position:"absolute",right:0,top:0}}/>}<div style={{fontSize:21,fontWeight:700}}>{cv.name}</div><div style={{color:"#8b5cf6",fontSize:11,marginTop:3}}>{cv.title}</div><div style={{fontSize:9.5,color:"#888",marginTop:6}}>{[cv.email,cv.phone,cv.location].filter(Boolean).join(" | ")}</div></div>{cv.summary&&<Sec t="Résumé" a="#8b5cf6"><p style={{fontSize:11,lineHeight:1.8,textAlign:"justify",margin:0}}>{cv.summary}</p></Sec>}{cv.experiences?.length>0&&<Sec t="Expériences" a="#8b5cf6">{cv.experiences.map((e,i)=><ExpBlk key={i} e={e} a="#8b5cf6"/>)}</Sec>}{cv.education?.length>0&&<Sec t="Formation Académique" a="#8b5cf6">{cv.education.map((e,i)=><EduBlk key={i} e={e}/>)}</Sec>}{cv.skills&&<Sec t="Compétences" a="#8b5cf6"><p style={{fontSize:10.5,margin:0}}>{cv.skills}</p></Sec>}<CVFooter cv={cv} a="#8b5cf6"/></div>;
}
function CVMedical({ cv }) {
  return <div style={{fontFamily:"'Arial',sans-serif",background:"#fff",minHeight:680}}><div style={{background:"linear-gradient(135deg,#0a2440,#0d3b6e)",padding:"24px 34px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:20,fontWeight:700,color:"#fff"}}>{cv.name}</div><div style={{color:"#34d399",fontSize:11,marginTop:3}}>{cv.title}</div><div style={{fontSize:9.5,color:"#90caf9",marginTop:5}}>{[cv.email,cv.phone,cv.location].filter(Boolean).join("  ·  ")}</div></div>{cv.photo&&<img src={cv.photo} alt="" style={{width:62,height:74,objectFit:"cover",borderRadius:6,border:"2px solid #34d39930"}}/>}</div><div style={{padding:"24px 34px"}}>{cv.summary&&<Sec t="Présentation" a="#34d399"><p style={{fontSize:11,lineHeight:1.75,color:"#333",margin:0}}>{cv.summary}</p></Sec>}{cv.experiences?.length>0&&<Sec t="Expériences" a="#34d399">{cv.experiences.map((e,i)=><ExpBlk key={i} e={e} a="#34d399"/>)}</Sec>}{cv.education?.length>0&&<Sec t="Formation" a="#34d399">{cv.education.map((e,i)=><EduBlk key={i} e={e}/>)}</Sec>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{cv.skills&&<Sec t="Compétences" a="#34d399"><p style={{fontSize:10.5,color:"#555",margin:0}}>{cv.skills}</p></Sec>}{cv.languages&&<Sec t="Langues" a="#34d399"><p style={{fontSize:10.5,color:"#555",margin:0}}>{cv.languages}</p></Sec>}</div><CVFooter cv={cv} a="#34d399"/></div></div>;
}
function CVLegal({ cv }) {
  return <div style={{fontFamily:"'Palatino Linotype',serif",background:"#fffef8",color:"#1a1208",padding:"38px",minHeight:680}}><div style={{textAlign:"center",marginBottom:24,position:"relative"}}>{cv.photo&&<img src={cv.photo} alt="" style={{width:62,height:74,objectFit:"cover",borderRadius:4,position:"absolute",right:0,top:0,border:"1px solid #b8860b30"}}/>}<div style={{fontSize:9.5,letterSpacing:7,textTransform:"uppercase",color:"#b8860b",marginBottom:7}}>Curriculum Vitæ</div><div style={{fontSize:22,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{cv.name}</div><div style={{color:"#b8860b",fontSize:11,fontStyle:"italic",marginTop:3}}>{cv.title}</div><div style={{width:44,height:1.5,background:"#b8860b",margin:"10px auto"}}/><div style={{fontSize:9.5,color:"#999"}}>{[cv.email,cv.phone,cv.location].filter(Boolean).join("  •  ")}</div></div>{cv.summary&&<Sec t="Profil" a="#b8860b"><p style={{fontSize:11,lineHeight:1.85,textAlign:"justify",margin:0}}>{cv.summary}</p></Sec>}{cv.experiences?.length>0&&<Sec t="Expériences Professionnelles" a="#b8860b">{cv.experiences.map((e,i)=><ExpBlk key={i} e={e} a="#b8860b"/>)}</Sec>}{cv.education?.length>0&&<Sec t="Formation" a="#b8860b">{cv.education.map((e,i)=><EduBlk key={i} e={e}/>)}</Sec>}{cv.skills&&<Sec t="Compétences" a="#b8860b"><p style={{fontSize:10.5,margin:0}}>{cv.skills}</p></Sec>}<CVFooter cv={cv} a="#b8860b"/></div>;
}
function CVMarketing({ cv }) {
  return <div style={{fontFamily:"'Helvetica Neue',sans-serif",background:"#fff",minHeight:680,display:"grid",gridTemplateColumns:"188px 1fr"}}><div style={{background:"#111",padding:"28px 16px"}}>{cv.photo?<img src={cv.photo} alt="" style={{width:80,height:96,objectFit:"cover",borderRadius:10,marginBottom:12,border:"2px solid #f9731640"}}/>:<div style={{width:56,height:56,borderRadius:12,background:"linear-gradient(135deg,#f97316,#ea580c)",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff"}}>{cv.name?.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>}<div style={{color:"#fff",fontSize:13,fontWeight:800}}>{cv.name}</div><div style={{color:"#f97316",fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginTop:3}}>{cv.title}</div><div style={{marginTop:16,fontSize:9,color:"#888",lineHeight:2.1}}>{[cv.email,cv.phone,cv.location].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}</div>{cv.skills&&<><div style={{color:"#f97316",fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:2,marginTop:20,marginBottom:8}}>Skills</div>{cv.skills.split(",").map((s,i)=><div key={i} style={{background:"#f9731615",border:"1px solid #f9731430",borderRadius:4,padding:"2px 7px",fontSize:9,color:"#f97316",marginBottom:5}}>{s.trim()}</div>)}</> }{cv.languages&&<><div style={{color:"#f97316",fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:2,marginTop:16,marginBottom:6}}>Langues</div><p style={{fontSize:9,color:"#aaa",margin:0}}>{cv.languages}</p></>}</div><div style={{padding:"28px 24px"}}>{cv.summary&&<div style={{background:"#fff7ed",borderLeft:"3.5px solid #f97316",padding:"10px 12px",borderRadius:"0 8px 8px 0",marginBottom:18}}><p style={{fontSize:11,color:"#555",lineHeight:1.75,margin:0}}>{cv.summary}</p></div>}{cv.experiences?.length>0&&<Sec t="Expériences" a="#f97316">{cv.experiences.map((e,i)=><ExpBlk key={i} e={e} a="#f97316"/>)}</Sec>}{cv.education?.length>0&&<Sec t="Formation" a="#f97316">{cv.education.map((e,i)=><EduBlk key={i} e={e}/>)}</Sec>}<CVFooter cv={cv} a="#f97316"/></div></div>;
}
function CVStartup({ cv }) {
  return <div style={{fontFamily:"'Helvetica Neue',sans-serif",background:"#06060f",color:"#e2e8f0",padding:"34px",minHeight:680}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}><div><div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-0.5px"}}>{cv.name}</div><div style={{color:"#818cf8",fontSize:12,fontWeight:600,marginTop:3}}>{cv.title}</div><div style={{fontSize:9.5,color:"#4a5568",marginTop:5}}>{[cv.email,cv.phone,cv.location].filter(Boolean).join(" · ")}</div></div>{cv.photo?<img src={cv.photo} alt="" style={{width:60,height:72,objectFit:"cover",borderRadius:10,border:"2px solid #818cf830"}}/>:<div style={{background:"linear-gradient(135deg,#818cf8,#6366f1)",borderRadius:10,padding:"8px 14px",textAlign:"right",fontSize:9.5,color:"#e0e0ff",lineHeight:1.9}}>{[cv.email,cv.phone].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}</div>}</div>{cv.summary&&<div style={{background:"#0f0f1f",border:"1px solid #818cf825",borderRadius:10,padding:13,marginBottom:20}}><p style={{fontSize:11,color:"#a5b4fc",lineHeight:1.75,margin:0}}>{cv.summary}</p></div>}{cv.experiences?.length>0&&<div style={{marginBottom:18}}><div style={{fontSize:8.5,fontWeight:800,color:"#818cf8",textTransform:"uppercase",letterSpacing:3,marginBottom:10}}>Expériences</div>{cv.experiences.map((e,i)=><div key={i} style={{background:"#0f0f1f",border:"1px solid #1e1e3f",borderRadius:9,padding:11,marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#fff",fontWeight:700,fontSize:11}}>{e.role}</span><span style={{color:"#818cf8",fontSize:9.5}}>{e.start}–{e.current?"now":e.end}</span></div><div style={{color:"#818cf8",fontSize:9.5,marginBottom:4}}>{e.company}</div><p style={{fontSize:10.5,color:"#94a3b8",lineHeight:1.65,margin:0}}>{e.description}</p></div>)}</div>}{cv.education?.length>0&&<div style={{marginBottom:16}}><div style={{fontSize:8.5,fontWeight:800,color:"#818cf8",textTransform:"uppercase",letterSpacing:3,marginBottom:9}}>Formation</div>{cv.education.map((e,i)=><div key={i} style={{fontSize:10.5,marginBottom:7}}><span style={{color:"#fff",fontWeight:600}}>{e.degree} {e.field}</span> · <span style={{color:"#818cf8"}}>{e.school}</span></div>)}</div>}{cv.skills&&<div style={{marginBottom:14}}><div style={{fontSize:8.5,fontWeight:800,color:"#818cf8",textTransform:"uppercase",letterSpacing:3,marginBottom:7}}>Skills</div><p style={{fontSize:10.5,color:"#94a3b8",margin:0}}>{cv.skills}</p></div>}<CVFooter cv={cv} a="#818cf8"/></div>;
}

/* ─────────────────────────────────────────────
   10 RENDERERS ATS — 1 colonne, texte brut optimisé
─────────────────────────────────────────────*/

// Primitives partagées ATS
const A = ({ label, color="#1c1812" }) => (
  <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"3px",
    color, borderBottom:`2px solid ${color}`, paddingBottom:3, marginBottom:10, marginTop:16 }}>{label}</div>
);
const AExp = ({ e, accent }) => (
  <div style={{ marginBottom:12 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
      <strong style={{ fontSize:11.5, color:"#111" }}>{e.role}</strong>
      <span style={{ fontSize:9.5, color:"#666", whiteSpace:"nowrap", marginLeft:8 }}>{e.start}{e.end||e.current ? ` – ${e.current?"Présent":e.end}` : ""}</span>
    </div>
    <div style={{ fontSize:10.5, color:accent, fontWeight:600, marginBottom:3 }}>{e.company}</div>
    <p style={{ fontSize:10.5, color:"#444", lineHeight:1.65, margin:0 }}>{e.description}</p>
  </div>
);
const AEdu = ({ e }) => (
  <div style={{ marginBottom:9 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
      <strong style={{ fontSize:11.5, color:"#111" }}>{e.degree}{e.field ? ` — ${e.field}` : ""}</strong>
      <span style={{ fontSize:9.5, color:"#666" }}>{e.start}{e.end ? ` – ${e.end}` : ""}</span>
    </div>
    <div style={{ fontSize:10.5, color:"#666" }}>{e.school}</div>
  </div>
);
const AFooter = ({ cv, accent }) => {
  const hasH = cv.hobbies?.filter(h=>h.label).length > 0;
  const hasR = cv.references?.filter(r=>r.name).length > 0;
  const hasSig = cv.signatureCity || cv.signatureDate;
  return (<>
    {hasH && <><A label="Centres d'intérêt" color={accent}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.7,margin:0}}>{cv.hobbies.filter(h=>h.label).map(h=>h.label).join("  ·  ")}</p></>}
    {hasR && <><A label="Références professionnelles" color={accent}/>{cv.references.filter(r=>r.name).map((r,i)=><div key={i} style={{marginBottom:8,fontSize:10.5}}><strong>{r.name}</strong>{r.role&&<span style={{color:accent}}> — {r.role}{r.company?`, ${r.company}`:""}</span>}{r.email&&<span style={{color:"#666"}}> · {r.email}</span>}{r.phone&&<span style={{color:"#666"}}> · {r.phone}</span>}</div>)}</>}
    {cv.refsOnRequest&&!hasR&&<p style={{fontSize:10,color:"#999",fontStyle:"italic",marginTop:8}}>Références disponibles sur demande.</p>}
    {hasSig&&<div style={{marginTop:28,display:"flex",justifyContent:"flex-end"}}><div style={{textAlign:"right",fontSize:10.5,color:"#888"}}><div>{[cv.signatureCity,cv.signatureDate].filter(Boolean).join(", le ")}</div><div style={{marginTop:24,borderTop:`1px solid ${accent}60`,paddingTop:4,minWidth:160,fontSize:10,color:"#aaa"}}>Signature</div></div></div>}
  </>);
};

// Wrapper commun ATS
const ATSWrap = ({ cv, accent="#1c1812", bg="#fff", children }) => (
  <div style={{ fontFamily:"'Arial',sans-serif", background:bg, color:"#1c1812", padding:"32px 38px", minHeight:680, maxWidth:"100%" }}>
    {children}
    {cv.experiences?.length>0&&<><A label="Expériences professionnelles" color={accent}/>{cv.experiences.map((e,i)=><AExp key={i} e={e} accent={accent}/>)}</>}
    {cv.education?.length>0&&<><A label="Formation" color={accent}/>{cv.education.map((e,i)=><AEdu key={i} e={e}/>)}</>}
    {cv.skills&&<><A label="Compétences" color={accent}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.7,margin:0}}>{cv.skills}</p></>}
    {cv.languages&&<><A label="Langues" color={accent}/><p style={{fontSize:10.5,color:"#444",margin:0}}>{cv.languages}</p></>}
    <AFooter cv={cv} accent={accent}/>
  </div>
);

// 1. Clarté — universel, sobre, noir sur blanc
function ATSClarte({ cv }) {
  return (
    <ATSWrap cv={cv} accent="#1c1812">
      <div style={{ borderBottom:"2px solid #1c1812", paddingBottom:14, marginBottom:4 }}>
        <div style={{ fontSize:22, fontWeight:700, color:"#1c1812", letterSpacing:"-0.3px" }}>{cv.name}</div>
        <div style={{ fontSize:12, color:"#444", marginTop:3 }}>{cv.title}</div>
        <div style={{ fontSize:10, color:"#666", marginTop:6, lineHeight:1.8 }}>
          {[cv.email,cv.phone,cv.location,cv.linkedin].filter(Boolean).join("   |   ")}
        </div>
      </div>
      {cv.summary&&<><A label="Profil professionnel" color="#1c1812"/><p style={{fontSize:10.5,color:"#444",lineHeight:1.75,margin:0}}>{cv.summary}</p></>}
    </ATSWrap>
  );
}

// 2. Dakar — identité UEMOA, accent bordeaux chaleureux
function ATSDakar({ cv }) {
  const ACC = "#7b2d2d";
  return (
    <ATSWrap cv={cv} accent={ACC}>
      <div style={{ borderLeft:`4px solid ${ACC}`, paddingLeft:16, marginBottom:4 }}>
        {cv.photo&&<img src={cv.photo} alt="" style={{width:62,height:75,objectFit:"cover",float:"right",borderRadius:4,border:`2px solid ${ACC}30`}}/>}
        <div style={{ fontSize:21, fontWeight:700, color:"#1c1812" }}>{cv.name}</div>
        <div style={{ fontSize:11.5, color:ACC, fontWeight:600, marginTop:2 }}>{cv.title}</div>
        <div style={{ fontSize:10, color:"#666", marginTop:6, lineHeight:1.9 }}>
          {[cv.email,cv.phone,cv.location].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}
        </div>
        <div style={{clear:"both"}}/>
      </div>
      {cv.summary&&<><A label="Présentation" color={ACC}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.75,margin:0}}>{cv.summary}</p></>}
    </ATSWrap>
  );
}

// 3. Sahel — ligne fine dorée, élégance sobre
function ATSSahel({ cv }) {
  const ACC = "#8b6914";
  return (
    <ATSWrap cv={cv} accent={ACC}>
      <div style={{ textAlign:"center", paddingBottom:14, marginBottom:4, borderBottom:`1px solid ${ACC}` }}>
        {cv.photo&&<img src={cv.photo} alt="" style={{width:62,height:75,objectFit:"cover",borderRadius:"50%",border:`2px solid ${ACC}`,marginBottom:8,display:"block",margin:"0 auto 8px"}}/>}
        <div style={{ fontSize:22, fontWeight:700, letterSpacing:"1px", color:"#1c1812", textTransform:"uppercase" }}>{cv.name}</div>
        <div style={{ fontSize:11, color:ACC, marginTop:4, fontStyle:"italic" }}>{cv.title}</div>
        <div style={{ fontSize:10, color:"#777", marginTop:6 }}>
          {[cv.email,cv.phone,cv.location].filter(Boolean).join("   ·   ")}
        </div>
      </div>
      {cv.summary&&<><A label="Profil" color={ACC}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.75,margin:0,textAlign:"justify"}}>{cv.summary}</p></>}
    </ATSWrap>
  );
}

// 4. Diplomate — Times New Roman, institutionnel strict
function ATSDiplomate({ cv }) {
  return (
    <div style={{ fontFamily:"'Times New Roman',serif", background:"#fff", color:"#111", padding:"32px 38px", minHeight:680 }}>
      <div style={{ textAlign:"center", borderBottom:"1px solid #111", paddingBottom:12, marginBottom:4 }}>
        <div style={{ fontSize:20, fontWeight:700, textTransform:"uppercase", letterSpacing:"2px" }}>{cv.name}</div>
        <div style={{ fontSize:11, color:"#555", marginTop:3, fontStyle:"italic" }}>{cv.title}</div>
        <div style={{ fontSize:10, color:"#666", marginTop:6 }}>{[cv.email,cv.phone,cv.location].filter(Boolean).join("   |   ")}</div>
      </div>
      {cv.summary&&<><A label="Résumé" color="#111"/><p style={{fontSize:10.5,lineHeight:1.85,textAlign:"justify",margin:0}}>{cv.summary}</p></>}
      {cv.experiences?.length>0&&<><A label="Expériences professionnelles" color="#111"/>{cv.experiences.map((e,i)=><AExp key={i} e={e} accent="#111"/>)}</>}
      {cv.education?.length>0&&<><A label="Formation" color="#111"/>{cv.education.map((e,i)=><AEdu key={i} e={e}/>)}</>}
      {cv.skills&&<><A label="Compétences" color="#111"/><p style={{fontSize:10.5,margin:0}}>{cv.skills}</p></>}
      {cv.languages&&<><A label="Langues" color="#111"/><p style={{fontSize:10.5,margin:0}}>{cv.languages}</p></>}
      <AFooter cv={cv} accent="#111"/>
    </div>
  );
}

// 5. Ingénieur — accent technique bleu nuit, structure dense
function ATSIngenieur({ cv }) {
  const ACC = "#1a3a5c";
  return (
    <ATSWrap cv={cv} accent={ACC}>
      <div style={{ background:ACC, color:"#fff", padding:"16px 20px", margin:"-32px -38px 4px", borderBottom:`3px solid #c49a3c` }}>
        <div style={{ fontSize:20, fontWeight:700 }}>{cv.name}</div>
        <div style={{ fontSize:11, color:"#a8c4e0", marginTop:2 }}>{cv.title}</div>
        <div style={{ fontSize:10, color:"#7ca8cc", marginTop:6 }}>{[cv.email,cv.phone,cv.location].filter(Boolean).join("   |   ")}</div>
      </div>
      <div style={{ marginTop:20 }}>
        {cv.summary&&<><A label="Profil technique" color={ACC}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.75,margin:0}}>{cv.summary}</p></>}
      </div>
    </ATSWrap>
  );
}

// 6. Consultant — résultats chiffrés mis en avant, vert finance
function ATSConsultant({ cv }) {
  const ACC = "#1a4d3a";
  return (
    <ATSWrap cv={cv} accent={ACC}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", borderBottom:`2px solid ${ACC}`, paddingBottom:14, marginBottom:4 }}>
        <div>
          <div style={{ fontSize:21, fontWeight:700, color:"#111" }}>{cv.name}</div>
          <div style={{ fontSize:11.5, color:ACC, fontWeight:600, marginTop:2 }}>{cv.title}</div>
        </div>
        <div style={{ textAlign:"right", fontSize:10, color:"#666", lineHeight:2 }}>
          {[cv.email,cv.phone,cv.location].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}
        </div>
      </div>
      {cv.summary&&<><A label="Synthèse executive" color={ACC}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.75,margin:0}}>{cv.summary}</p></>}
    </ATSWrap>
  );
}

// 7. Académique — sections Publications / Recherches
function ATSAcademique({ cv }) {
  const ACC = "#3b2f6b";
  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#fff", color:"#111", padding:"32px 38px", minHeight:680 }}>
      <div style={{ textAlign:"center", borderBottom:`1.5px solid ${ACC}`, paddingBottom:14, marginBottom:4 }}>
        {cv.photo&&<img src={cv.photo} alt="" style={{width:56,height:68,objectFit:"cover",borderRadius:4,float:"right"}}/>}
        <div style={{ fontSize:20, fontWeight:700 }}>{cv.name}</div>
        <div style={{ fontSize:11, color:ACC, fontStyle:"italic", marginTop:3 }}>{cv.title}</div>
        <div style={{ fontSize:10, color:"#666", marginTop:5 }}>{[cv.email,cv.phone,cv.location].filter(Boolean).join("   |   ")}</div>
        <div style={{clear:"both"}}/>
      </div>
      {cv.summary&&<><A label="Résumé académique" color={ACC}/><p style={{fontSize:10.5,lineHeight:1.85,textAlign:"justify",margin:0}}>{cv.summary}</p></>}
      {cv.experiences?.length>0&&<><A label="Expériences d'enseignement & recherche" color={ACC}/>{cv.experiences.map((e,i)=><AExp key={i} e={e} accent={ACC}/>)}</>}
      {cv.education?.length>0&&<><A label="Formation académique" color={ACC}/>{cv.education.map((e,i)=><AEdu key={i} e={e}/>)}</>}
      {cv.skills&&<><A label="Domaines de recherche & compétences" color={ACC}/><p style={{fontSize:10.5,margin:0}}>{cv.skills}</p></>}
      {cv.languages&&<><A label="Langues" color={ACC}/><p style={{fontSize:10.5,margin:0}}>{cv.languages}</p></>}
      <AFooter cv={cv} accent={ACC}/>
    </div>
  );
}

// 8. Humanitaire — missions terrain, langues nationales valorisées
function ATSHumanitaire({ cv }) {
  const ACC = "#c25e00";
  return (
    <ATSWrap cv={cv} accent={ACC}>
      <div style={{ borderBottom:`2px solid ${ACC}`, paddingBottom:14, marginBottom:4 }}>
        {cv.photo&&<img src={cv.photo} alt="" style={{width:60,height:72,objectFit:"cover",float:"right",borderRadius:4}}/>}
        <div style={{ fontSize:20, fontWeight:700 }}>{cv.name}</div>
        <div style={{ fontSize:11.5, color:ACC, fontWeight:600, marginTop:2 }}>{cv.title}</div>
        <div style={{ fontSize:10, color:"#666", marginTop:6, lineHeight:1.9 }}>
          {[cv.email,cv.phone,cv.location].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}
        </div>
        <div style={{clear:"both"}}/>
      </div>
      {cv.summary&&<><A label="Profil & engagements terrain" color={ACC}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.75,margin:0}}>{cv.summary}</p></>}
    </ATSWrap>
  );
}

// 9. Junior — formation en premier, stages valorisés
function ATSJunior({ cv }) {
  const ACC = "#0e5a8a";
  return (
    <div style={{ fontFamily:"'Arial',sans-serif", background:"#fff", color:"#1c1812", padding:"32px 38px", minHeight:680 }}>
      <div style={{ borderBottom:`3px solid ${ACC}`, paddingBottom:12, marginBottom:4 }}>
        <div style={{ fontSize:20, fontWeight:700 }}>{cv.name}</div>
        <div style={{ fontSize:11.5, color:ACC, marginTop:2 }}>{cv.title}</div>
        <div style={{ fontSize:10, color:"#666", marginTop:5 }}>{[cv.email,cv.phone,cv.location].filter(Boolean).join("   |   ")}</div>
      </div>
      {cv.summary&&<><A label="Objectif professionnel" color={ACC}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.75,margin:0}}>{cv.summary}</p></>}
      {cv.education?.length>0&&<><A label="Formation" color={ACC}/>{cv.education.map((e,i)=><AEdu key={i} e={e}/>)}</>}
      {cv.experiences?.length>0&&<><A label="Expériences & stages" color={ACC}/>{cv.experiences.map((e,i)=><AExp key={i} e={e} accent={ACC}/>)}</>}
      {cv.skills&&<><A label="Compétences" color={ACC}/><p style={{fontSize:10.5,color:"#444",lineHeight:1.7,margin:0}}>{cv.skills}</p></>}
      {cv.languages&&<><A label="Langues" color={ACC}/><p style={{fontSize:10.5,color:"#444",margin:0}}>{cv.languages}</p></>}
      <AFooter cv={cv} accent={ACC}/>
    </div>
  );
}

// 10. Cadre Supérieur — synthétique, percutant, réalisations clés
function ATSCadre({ cv }) {
  const ACC = "#111";
  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#fff", color:"#111", padding:"32px 38px", minHeight:680 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", borderBottom:"2.5px solid #111", paddingBottom:14, marginBottom:4 }}>
        <div>
          <div style={{ fontSize:23, fontWeight:700, letterSpacing:"-0.5px" }}>{cv.name}</div>
          <div style={{ fontSize:12, color:"#444", fontStyle:"italic", marginTop:3 }}>{cv.title}</div>
        </div>
        {cv.photo&&<img src={cv.photo} alt="" style={{width:60,height:72,objectFit:"cover",borderRadius:3,border:"1px solid #ddd"}}/>}
      </div>
      <div style={{ display:"flex", gap:20, fontSize:10, color:"#666", marginBottom:4, marginTop:10 }}>
        {[cv.email,cv.phone,cv.location].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}
      </div>
      {cv.summary&&<><A label="Profil exécutif" color={ACC}/><p style={{fontSize:10.5,lineHeight:1.8,margin:0,fontStyle:"italic",color:"#333"}}>{cv.summary}</p></>}
      {cv.experiences?.length>0&&<><A label="Parcours professionnel" color={ACC}/>{cv.experiences.map((e,i)=><AExp key={i} e={e} accent={ACC}/>)}</>}
      {cv.education?.length>0&&<><A label="Formation" color={ACC}/>{cv.education.map((e,i)=><AEdu key={i} e={e}/>)}</>}
      {cv.skills&&<><A label="Compétences clés" color={ACC}/><p style={{fontSize:10.5,margin:0}}>{cv.skills}</p></>}
      {cv.languages&&<><A label="Langues" color={ACC}/><p style={{fontSize:10.5,margin:0}}>{cv.languages}</p></>}
      <AFooter cv={cv} accent={ACC}/>
    </div>
  );
}

const RENDERERS = { executive:CVExecutive,tech:CVTech,creative:CVCreative,minimal:CVMinimal,corporate:CVCorporate,academic:CVAcademic,medical:CVMedical,legal:CVLegal,marketing:CVMarketing,startup:CVStartup };

const ATS_RENDERERS = {
  "ats-clarte":      ATSClarte,
  "ats-dakar":       ATSDakar,
  "ats-sahel":       ATSSahel,
  "ats-diplomate":   ATSDiplomate,
  "ats-ingenieur":   ATSIngenieur,
  "ats-consultant":  ATSConsultant,
  "ats-academique":  ATSAcademique,
  "ats-humanitaire": ATSHumanitaire,
  "ats-junior":      ATSJunior,
  "ats-cadre":       ATSCadre,
};

/* ─────────────────────────────
   ÉTAPES DU FORMULAIRE
──────────────────────────────*/
function StepProfile({ form, setForm, showErrors }) {
  const f = k => e => setForm({ ...form, [k]: e.target.value });
  const photoRef = useRef();
  const err = (v) => showErrors && !v.trim();

  const handlePhoto = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm({ ...form, photo: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <Stack>
      <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
        <div>
          <Label t="Photo"/>
          <div className="photo-drop" onClick={() => photoRef.current.click()}>
            {form.photo
              ? <img src={form.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              : <div style={{ textAlign:"center", padding:8 }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>📷</div>
                  <div style={{ fontSize:10, color:"var(--ink4)", lineHeight:1.4 }}>Ajouter<br/>une photo</div>
                </div>
            }
          </div>
          <input ref={photoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto}/>
          {form.photo && <button className="btn-text" style={{ width:"100%", marginTop:5, textAlign:"center" }} onClick={()=>setForm({...form,photo:null})}>Retirer</button>}
        </div>
        <div style={{ flex:1, display:"grid", gap:14 }}>
          <Grid2>
            <div><Label t="Prénom" required/><input className={`field${err(form.firstName)?" err":""}`} placeholder="Lawali" value={form.firstName} onChange={f("firstName")}/></div>
            <div><Label t="Nom" required/><input className={`field${err(form.lastName)?" err":""}`} placeholder="TOE" value={form.lastName} onChange={f("lastName")}/></div>
          </Grid2>
          <div><Label t="Titre professionnel" required/><input className={`field${err(form.title)?" err":""}`} placeholder="Comptable Senior / Chargé de projet" value={form.title} onChange={f("title")}/></div>
        </div>
      </div>

      <Grid2>
        <div><Label t="Email" required/><input className={`field${err(form.email)?" err":""}`} placeholder="lawali.toe@gmail.com" value={form.email} onChange={f("email")}/></div>
        <div><Label t="Téléphone" required/><input className={`field${err(form.phone)?" err":""}`} placeholder="+226 70 00 00 00" value={form.phone} onChange={f("phone")}/></div>
      </Grid2>
      <Grid2>
        <div><Label t="Localisation"/><input className="field" placeholder="Ouagadougou, Burkina Faso" value={form.location} onChange={f("location")}/></div>
        <div><Label t="LinkedIn"/><input className="field" placeholder="linkedin.com/in/lawali-toe" value={form.linkedin} onChange={f("linkedin")}/></div>
      </Grid2>
      <div>
        <Label t="Résumé professionnel"/>
        <textarea className="field" rows={3} style={{ resize:"vertical", lineHeight:1.7 }}
          placeholder="Ex : Comptable avec 5 ans d'expérience dans le secteur bancaire au Burkina Faso..."
          value={form.summary} onChange={f("summary")}/>
      </div>
    </Stack>
  );
}

function StepExp({ form, setForm, showErrors }) {
  const upd = (i,k,v) => { const a=[...form.experiences]; a[i]={...a[i],[k]:v}; setForm({...form,experiences:a}); };
  const add = () => setForm({...form, experiences:[...form.experiences,{company:"",role:"",start:"",end:"",current:false,description:""}]});
  const rm  = i => setForm({...form, experiences:form.experiences.filter((_,j)=>j!==i)});
  const err = (v) => showErrors && !v.trim();
  return (
    <Stack>
      {form.experiences.map((e,i) => (
        <Block key={i}>
          <BlockHeader label={`Expérience ${i+1}`} onRemove={form.experiences.length>1 ? ()=>rm(i) : null}/>
          <Stack gap={14}>
            <Grid2>
              <div><Label t="Entreprise" required/><input className={`field${err(e.company)?" err":""}`} placeholder="SONABHY / Banque Atlantique / ONG..." value={e.company} onChange={x=>upd(i,"company",x.target.value)}/></div>
              <div><Label t="Poste" required/><input className={`field${err(e.role)?" err":""}`} placeholder="Responsable Comptable" value={e.role} onChange={x=>upd(i,"role",x.target.value)}/></div>
            </Grid2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:12, alignItems:"end" }}>
              <div><Label t="Début" required/><input className={`field${err(e.start)?" err":""}`} placeholder="Jan 2020" value={e.start} onChange={x=>upd(i,"start",x.target.value)}/></div>
              <div><Label t="Fin"/><input className="field" placeholder="Déc 2023" value={e.end} onChange={x=>upd(i,"end",x.target.value)} disabled={e.current}/></div>
              <label style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"var(--ink3)", cursor:"pointer", paddingBottom:13, whiteSpace:"nowrap" }}>
                <input type="checkbox" checked={e.current} onChange={x=>upd(i,"current",x.target.checked)} style={{ accentColor:"var(--terra)", width:15, height:15 }}/>En poste
              </label>
            </div>
            <div>
              <Label t="Missions & réalisations" required/>
              <textarea className={`field${err(e.description)?" err":""}`} rows={3} style={{ resize:"vertical", lineHeight:1.7 }}
                placeholder="Gestion de la comptabilité générale, suivi budgétaire, production des bilans..."
                value={e.description} onChange={x=>upd(i,"description",x.target.value)}/>
            </div>
          </Stack>
        </Block>
      ))}
      <button className="btn-add" onClick={add}>+ Ajouter une expérience</button>
    </Stack>
  );
}

function StepEdu({ form, setForm, showErrors }) {
  const upd = (i,k,v) => { const a=[...form.education]; a[i]={...a[i],[k]:v}; setForm({...form,education:a}); };
  const add = () => setForm({...form, education:[...form.education,{school:"",degree:"",field:"",start:"",end:""}]});
  const rm  = i => setForm({...form, education:form.education.filter((_,j)=>j!==i)});
  const err = (v) => showErrors && !v.trim();
  return (
    <Stack>
      {form.education.map((e,i) => (
        <Block key={i}>
          <BlockHeader label={`Formation ${i+1}`} onRemove={form.education.length>1 ? ()=>rm(i) : null}/>
          <Stack gap={14}>
            <div><Label t="Établissement" required/><input className={`field${err(e.school)?" err":""}`} placeholder="Université Ouaga II / ISCG / 2iE..." value={e.school} onChange={x=>upd(i,"school",x.target.value)}/></div>
            <Grid2>
              <div><Label t="Diplôme" required/><input className={`field${err(e.degree)?" err":""}`} placeholder="Licence, Master, BTS..." value={e.degree} onChange={x=>upd(i,"degree",x.target.value)}/></div>
              <div><Label t="Domaine" required/><input className={`field${err(e.field)?" err":""}`} placeholder="Gestion / Informatique / Droit" value={e.field} onChange={x=>upd(i,"field",x.target.value)}/></div>
            </Grid2>
            <Grid2>
              <div><Label t="Début"/><input className="field" placeholder="2018" value={e.start} onChange={x=>upd(i,"start",x.target.value)}/></div>
              <div><Label t="Fin"/><input className="field" placeholder="2020" value={e.end} onChange={x=>upd(i,"end",x.target.value)}/></div>
            </Grid2>
          </Stack>
        </Block>
      ))}
      <button className="btn-add" onClick={add}>+ Ajouter une formation</button>
    </Stack>
  );
}

function StepExtras({ form, setForm }) {
  const f = k => e => setForm({ ...form, [k]: e.target.value });
  const updH = (i,v) => { const a=[...form.hobbies]; a[i]={label:v}; setForm({...form,hobbies:a}); };
  const addH = () => setForm({...form, hobbies:[...form.hobbies,{label:""}]});
  const rmH  = i => setForm({...form, hobbies:form.hobbies.filter((_,j)=>j!==i)});
  return (
    <Stack>
      <Block>
        <BlockHeader label="Compétences & Langues"/>
        <Stack gap={14}>
          <div>
            <Label t="Compétences techniques"/>
            <textarea className="field" rows={3} style={{ resize:"vertical", lineHeight:1.7 }}
              placeholder="Sage Comptabilité, Excel, OHADA, Gestion de projet, Pack Office..."
              value={form.skills} onChange={f("skills")}/>
          </div>
          <div><Label t="Langues"/><input className="field" placeholder="Français (courant), Mooré (natif), Dioula (intermédiaire)" value={form.languages} onChange={f("languages")}/></div>
        </Stack>
      </Block>

      <Block>
        <BlockHeader label="Centres d'intérêt"/>
        <Stack gap={8}>
          {form.hobbies.map((h,i) => (
            <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
              <input className="field" style={{ flex:1 }}
                placeholder="Ex : Football, Lecture, Bénévolat, Musique traditionnelle..."
                value={h.label} onChange={e=>updH(i,e.target.value)}/>
              {form.hobbies.length>1 && <button className="btn-text" onClick={()=>rmH(i)}>Retirer</button>}
            </div>
          ))}
          <button className="btn-add" onClick={addH}>+ Ajouter un centre d'intérêt</button>
        </Stack>
      </Block>

      <Block>
        <BlockHeader label="Date & Signature"/>
        <Grid2>
          <div><Label t="Ville"/><input className="field" placeholder="Ouagadougou" value={form.signatureCity} onChange={f("signatureCity")}/></div>
          <div><Label t="Date"/><input className="field" placeholder="06 mars 2026" value={form.signatureDate} onChange={f("signatureDate")}/></div>
        </Grid2>
        <p style={{ fontSize:12, color:"var(--ink4)", marginTop:10, lineHeight:1.6 }}>
          Apparaîtra en bas du CV avec un espace pour signer à la main.
        </p>
      </Block>
    </Stack>
  );
}

function StepReferences({ form, setForm }) {
  const upd = (i,k,v) => { const a=[...form.references]; a[i]={...a[i],[k]:v}; setForm({...form,references:a}); };
  const add = () => setForm({...form, references:[...form.references,{name:"",role:"",company:"",email:"",phone:""}]});
  const rm  = i => setForm({...form, references:form.references.filter((_,j)=>j!==i)});
  return (
    <Stack>
      <div style={{ background:"rgba(184,92,56,0.06)", border:"1.5px solid rgba(184,92,56,0.2)",
        borderRadius:8, padding:"12px 16px", fontSize:13, color:"var(--terra)", lineHeight:1.7 }}>
        Ajoutez les personnes pouvant témoigner de votre travail. Elles apparaîtront en bas de votre CV.
      </div>
      {form.references.map((r,i) => (
        <Block key={i}>
          <BlockHeader label={`Référence ${i+1}`} onRemove={form.references.length>1 ? ()=>rm(i) : null}/>
          <Stack gap={14}>
            <div><Label t="Nom complet"/><input className="field" placeholder="Amadou OUEDRAOGO" value={r.name} onChange={x=>upd(i,"name",x.target.value)}/></div>
            <Grid2>
              <div><Label t="Poste"/><input className="field" placeholder="Directeur Financier" value={r.role} onChange={x=>upd(i,"role",x.target.value)}/></div>
              <div><Label t="Entreprise"/><input className="field" placeholder="BSIC Burkina" value={r.company} onChange={x=>upd(i,"company",x.target.value)}/></div>
            </Grid2>
            <Grid2>
              <div><Label t="Email"/><input className="field" placeholder="a.ouedraogo@bsic.bf" value={r.email} onChange={x=>upd(i,"email",x.target.value)}/></div>
              <div><Label t="Téléphone"/><input className="field" placeholder="+226 25 00 00 00" value={r.phone} onChange={x=>upd(i,"phone",x.target.value)}/></div>
            </Grid2>
          </Stack>
        </Block>
      ))}
      <button className="btn-add" onClick={add}>+ Ajouter une référence</button>
      <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer",
        padding:"14px 16px", border:"1.5px solid var(--border)", borderRadius:8, background:"#fff" }}>
        <input type="checkbox" checked={form.refsOnRequest||false}
          onChange={e=>setForm({...form,refsOnRequest:e.target.checked})}
          style={{ accentColor:"var(--terra)", width:16, height:16, marginTop:2, flexShrink:0 }}/>
        <div>
          <div style={{ fontSize:13, color:"var(--ink)", fontWeight:600 }}>Références disponibles sur demande</div>
          <div style={{ fontSize:12, color:"var(--ink4)", marginTop:2, lineHeight:1.5 }}>Ajoute une mention discrète sans afficher les coordonnées</div>
        </div>
      </label>
    </Stack>
  );
}

function StepTemplate({ form, setForm }) {
  const isATS = form.template?.startsWith("ats-");
  const [tab, setTab] = useState(isATS ? "ats" : "design");

  const TabBtn = ({ id, label, sub }) => (
    <button onClick={() => setTab(id)}
      style={{ flex:1, padding:"12px 16px", border:"none", cursor:"pointer",
        background: tab===id ? "#fff" : "transparent",
        borderBottom: tab===id ? "2px solid var(--terra)" : "2px solid transparent",
        textAlign:"left", transition:"all 0.18s" }}>
      <div style={{ fontSize:13, fontWeight:600, color: tab===id ? "var(--terra)" : "var(--ink3)" }}>{label}</div>
      <div style={{ fontSize:10.5, color:"var(--ink4)", marginTop:2 }}>{sub}</div>
    </button>
  );

  const DesignCard = ({ t }) => {
    const active = form.template === t.id;
    return (
      <button className="tcard" onClick={() => setForm({...form, template:t.id})}
        style={{ background: active ? "rgba(184,92,56,0.06)" : "#fff",
          border:`1.5px solid ${active ? "var(--terra)" : "var(--border)"}`,
          borderRadius:8, padding:"12px 14px", cursor:"pointer",
          textAlign:"left", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:26, height:34, borderRadius:4, background:t.bg,
            border:`1.5px solid ${t.accent}60`, flexShrink:0, padding:"5px 4px" }}>
            <div style={{ width:"70%", height:1.5, background:t.accent, marginBottom:3 }}/>
            <div style={{ width:"100%", height:1, background:t.accent+"60", marginBottom:2 }}/>
            <div style={{ width:"80%", height:1, background:t.accent+"30" }}/>
          </div>
          <div>
            <div style={{ fontSize:12.5, fontWeight:600, color: active ? "var(--terra)" : "var(--ink)" }}>{t.name}</div>
            <div style={{ fontSize:10.5, color:"var(--ink4)", marginTop:1 }}>{t.tag}</div>
          </div>
        </div>
        {active && <div style={{ position:"absolute", top:10, right:10, width:18, height:18,
          borderRadius:"50%", background:"var(--terra)", display:"flex",
          alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900, color:"#fff" }}>✓</div>}
      </button>
    );
  };

  const ATSCard = ({ t }) => {
    const active = form.template === t.id;
    return (
      <button className="tcard" onClick={() => setForm({...form, template:t.id})}
        style={{ background: active ? "rgba(184,92,56,0.06)" : "#fff",
          border:`1.5px solid ${active ? "var(--terra)" : "var(--border)"}`,
          borderRadius:8, padding:"12px 14px", cursor:"pointer",
          textAlign:"left", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Miniature ATS : blanc pur, 1 colonne */}
          <div style={{ width:26, height:34, borderRadius:4, background:"#fff",
            border:"1.5px solid #ccc", flexShrink:0, padding:"5px 4px" }}>
            <div style={{ width:"60%", height:2, background:"#333", marginBottom:3 }}/>
            <div style={{ width:"100%", height:1, background:"#bbb", marginBottom:2 }}/>
            <div style={{ width:"90%", height:1, background:"#bbb", marginBottom:2 }}/>
            <div style={{ width:"80%", height:1, background:"#ddd" }}/>
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ fontSize:12.5, fontWeight:600, color: active ? "var(--terra)" : "var(--ink)" }}>{t.name}</div>
              <span style={{ fontSize:9, fontWeight:700, background:"#e8f4e8", color:"#2a7a2a",
                padding:"1px 6px", borderRadius:3, letterSpacing:"0.5px" }}>ATS</span>
            </div>
            <div style={{ fontSize:10.5, color:"var(--ink4)", marginTop:1 }}>{t.tag}</div>
          </div>
        </div>
        {active && <div style={{ position:"absolute", top:10, right:10, width:18, height:18,
          borderRadius:"50%", background:"var(--terra)", display:"flex",
          alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900, color:"#fff" }}>✓</div>}
      </button>
    );
  };

  return (
    <div>
      {/* Onglets */}
      <div style={{ display:"flex", background:"var(--cream2)", borderRadius:"8px 8px 0 0",
        border:"1.5px solid var(--border)", borderBottom:"none", marginBottom:0 }}>
        <TabBtn id="design" label="✦ Modèles Design" sub="Visuellement distinctifs"/>
        <TabBtn id="ats"    label="✓ Modèles ATS"    sub="Optimisés recruteurs"/>
      </div>

      <div style={{ border:"1.5px solid var(--border)", borderTop:"none",
        borderRadius:"0 0 8px 8px", background:"#fff", padding:16 }}>

        {tab === "design" && (
          <>
            <p style={{ fontSize:12, color:"var(--ink4)", marginBottom:14, lineHeight:1.6 }}>
              Modèles visuellement riches — idéaux pour les candidatures directes ou les secteurs créatifs.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {TEMPLATES.map(t => <DesignCard key={t.id} t={t}/>)}
            </div>
          </>
        )}

        {tab === "ats" && (
          <>
            <div style={{ background:"#f0f7f0", border:"1px solid #c3e0c3", borderRadius:6,
              padding:"10px 14px", marginBottom:14, fontSize:12, color:"#2a6a2a", lineHeight:1.6 }}>
              <strong>✓ Modèles ATS</strong> — Une colonne, texte lisible par les logiciels de recrutement.
              Recommandés pour postuler à des grandes entreprises, ONG internationales et administrations.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {ATS_TEMPLATES.map(t => <ATSCard key={t.id} t={t}/>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── chargeur scripts ───*/
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function StepResult({ form }) {
  const cvRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [exportErr, setExportErr] = useState(null);
  const isATS = form.template?.startsWith("ats-");
  const Renderer = isATS
    ? (ATS_RENDERERS[form.template] || ATSClarte)
    : (RENDERERS[form.template] || CVExecutive);

  const cv = {
    photo: form.photo,
    name: `${form.firstName} ${form.lastName}`.trim(),
    title: form.title, email: form.email, phone: form.phone,
    location: form.location, linkedin: form.linkedin, summary: form.summary,
    experiences: form.experiences, education: form.education,
    skills: form.skills, languages: form.languages,
    hobbies: form.hobbies,
    references: form.refsOnRequest ? [] : form.references,
    refsOnRequest: form.refsOnRequest,
    signatureCity: form.signatureCity, signatureDate: form.signatureDate,
  };

  const downloadPDF = async () => {
    const el = cvRef.current;
    if (!el) return;
    setExporting(true); setExportErr(null);
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      const canvas = await window.html2canvas(el, { scale:2, useCORS:true, allowTaint:true, backgroundColor:null, logging:false });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = pageW / canvas.width;
      const renderedH = canvas.height * ratio;
      const imgData = canvas.toDataURL("image/jpeg", 0.97);
      if (renderedH <= pageH) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, renderedH);
      } else {
        let yOffset = 0;
        while (yOffset < renderedH) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, -yOffset, pageW, renderedH);
          yOffset += pageH;
        }
      }
      pdf.save(`${cv.name||"CV"}.pdf`.replace(/\s+/g,"_"));
    } catch(err) {
      setExportErr("Export échoué — essayez le bouton Imprimer.");
    } finally { setExporting(false); }
  };

  const printFallback = () => {
    const el = cvRef.current;
    if (!el) return;
    const w = window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${cv.name||"CV"}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}@media print{@page{margin:6mm;size:A4}}</style></head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    setTimeout(()=>{ w.focus(); w.print(); },500);
  };

  return (
    <div className="slide">
      {/* Toolbar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        marginBottom:18, padding:"14px 18px", background:"#fff",
        borderRadius:8, border:"1.5px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#27ae60" }}/>
          <span style={{ fontSize:13, fontWeight:600, color:"var(--ink)" }}>CV généré</span>
          <span style={{ fontSize:11, color:"var(--ink4)", marginLeft:4 }}>
            — {isATS ? "Modèle ATS" : "Modèle Design"} · {(isATS ? ATS_TEMPLATES : TEMPLATES).find(t=>t.id===form.template)?.name}
          </span>
          {isATS && <span style={{ fontSize:9.5, fontWeight:700, background:"#e8f4e8",
            color:"#2a7a2a", padding:"2px 7px", borderRadius:3 }}>✓ ATS</span>}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-line" onClick={printFallback} style={{ padding:"9px 14px", fontSize:12 }}>🖨 Imprimer</button>
          <button className="btn-main" onClick={downloadPDF} disabled={exporting}
            style={{ padding:"9px 20px", fontSize:12 }}>
            {exporting
              ? <><span style={{ width:12,height:12,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite" }}/> Export…</>
              : "⬇ Télécharger PDF"}
          </button>
        </div>
      </div>
      {exportErr && (
        <div style={{ background:"#fdf0ee", border:"1.5px solid #e74c3c40", borderRadius:8,
          padding:"10px 16px", color:"#c0392b", fontSize:12.5, marginBottom:14 }}>{exportErr}</div>
      )}
      <div style={{ borderRadius:10, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.12), 0 0 0 1.5px var(--border)" }}>
        <div ref={cvRef}><Renderer cv={cv}/></div>
      </div>
      <p style={{ color:"var(--ink4)", fontSize:11.5, textAlign:"center", marginTop:12 }}>
        Le PDF se télécharge directement dans vos fichiers
      </p>
    </div>
  );
}

/* ─────────────────────────────
   SIDEBAR
──────────────────────────────*/
function Sidebar({ step, setStep }) {
  return (
    <div style={{ width:210, flexShrink:0, background:"var(--cream2)",
      borderRight:"1.5px solid var(--border)", display:"flex", flexDirection:"column",
      height:"100vh", position:"sticky", top:0 }}>

      {/* Logo */}
      <div style={{ padding:"22px 24px 20px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="26" height="33" rx="4" fill="rgba(0,0,0,0.07)"/>
            <rect x="3" y="2" width="26" height="33" rx="4" fill="#fff" stroke="#d4c9b5" strokeWidth="1.2"/>
            <path d="M22 2 L29 9 L22 9 Z" fill="#e8dfc8"/>
            <rect x="8" y="14" width="10" height="2.5" rx="1.2" fill="#b85c38"/>
            <rect x="8" y="20" width="16" height="1.5" rx="0.7" fill="#d4c9b5"/>
            <rect x="8" y="23.5" width="13" height="1.5" rx="0.7" fill="#d4c9b5"/>
            <rect x="8" y="27" width="15" height="1.5" rx="0.7" fill="#e0d5c0"/>
            <circle cx="28" cy="33" r="6" fill="#2a7a2a"/>
            <path d="M25 33 L27.2 35.2 L31 31" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700,
              color:"var(--ink)", letterSpacing:"-0.5px", fontStyle:"italic", lineHeight:1 }}>
              CVtools
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, color:"var(--ink4)",
              letterSpacing:"2px", textTransform:"uppercase", marginTop:4 }}>
              Générateur de CV
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding:"18px 16px", flex:1, overflowY:"auto" }}>
        {STEPS.map((s, i) => {
          const done   = i < step;
          const active = i === step;
          const locked = i > step;
          return (
            <button key={s.id} className="step-item"
              onClick={() => !locked && setStep(i)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12,
                padding:"10px 12px", borderRadius:6, border:"none",
                cursor: locked ? "default" : "pointer", marginBottom:2,
                background: active ? "#fff" : "transparent",
                boxShadow: active ? "0 1px 6px rgba(0,0,0,0.07)" : "none" }}>
              {/* Indicateur numéro */}
              <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontFamily:"'DM Mono',monospace", fontWeight:500,
                background: active ? "var(--terra)" : done ? "var(--cream3)" : "transparent",
                border: `1.5px solid ${active ? "var(--terra)" : done ? "var(--border2)" : "var(--border)"}`,
                color: active ? "#fff" : done ? "var(--ink3)" : "var(--ink4)" }}>
                {done ? "✓" : s.short}
              </div>
              <span className="step-txt" style={{ fontSize:12.5, fontWeight: active ? 600 : 400,
                color: active ? "var(--ink)" : done ? "var(--ink3)" : "var(--ink4)",
                transition:"color 0.18s" }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Signature Lawalitoe */}
      <div style={{ padding:"14px 24px", borderTop:"1px solid var(--border)",
        display:"flex", alignItems:"center", gap:10 }}>
        <svg width="22" height="24" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="26" height="33" rx="4" fill="rgba(0,0,0,0.05)"/>
          <rect x="3" y="2" width="26" height="33" rx="4" fill="#fff" stroke="#d4c9b5" strokeWidth="1.5"/>
          <path d="M22 2 L29 9 L22 9 Z" fill="#e8dfc8"/>
          <rect x="8" y="14" width="10" height="2.5" rx="1.2" fill="#b85c38"/>
          <rect x="8" y="20" width="16" height="1.5" rx="0.7" fill="#d4c9b5"/>
          <rect x="8" y="23.5" width="13" height="1.5" rx="0.7" fill="#d4c9b5"/>
          <circle cx="28" cy="33" r="6" fill="#2a7a2a"/>
          <path d="M25 33 L27.2 35.2 L31 31" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:12, fontStyle:"italic",
            color:"var(--ink3)", lineHeight:1 }}>lawalitoe</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"var(--ink4)",
            letterSpacing:"1.5px", textTransform:"uppercase", marginTop:3 }}>Made with care</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   APP PRINCIPALE
──────────────────────────────*/
export default function App() {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(INIT);
  const [animKey, setAnimKey] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  const isLast  = step === STEPS.length - 1;
  const isFirst = step === 0;
  const progress = Math.round((step / (STEPS.length - 1)) * 100);

  const validate = () => {
    const id = STEPS[step].id;
    if (id === "profile")
      return form.firstName.trim() && form.lastName.trim() && form.title.trim() && form.email.trim() && form.phone.trim();
    if (id === "experience")
      return form.experiences.every(e => e.company.trim() && e.role.trim() && e.start.trim() && e.description.trim());
    if (id === "education")
      return form.education.every(e => e.school.trim() && e.degree.trim() && e.field.trim());
    return true;
  };

  const ERRORS = {
    profile:    "Veuillez remplir les champs obligatoires : Prénom, Nom, Titre, Email et Téléphone.",
    experience: "Chaque expérience doit avoir : Entreprise, Poste, Début et Description.",
    education:  "Chaque formation doit avoir : Établissement, Diplôme et Domaine.",
  };

  const goNext = () => {
    if (!validate()) { setShowErrors(true); return; }
    setShowErrors(false);
    setStep(s => s + 1);
    setAnimKey(k => k + 1);
  };
  const goPrev = () => {
    setShowErrors(false);
    setStep(s => s - 1);
    setAnimKey(k => k + 1);
  };

  const CONTENT = {
    profile:    <StepProfile    form={form} setForm={setForm} showErrors={showErrors}/>,
    experience: <StepExp        form={form} setForm={setForm} showErrors={showErrors}/>,
    education:  <StepEdu        form={form} setForm={setForm} showErrors={showErrors}/>,
    extras:     <StepExtras     form={form} setForm={setForm}/>,
    references: <StepReferences form={form} setForm={setForm}/>,
    template:   <StepTemplate   form={form} setForm={setForm}/>,
    result:     <StepResult     form={form}/>,
  };

  const cur = STEPS[step];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display:"flex", minHeight:"100vh", background:"var(--cream)" }}>

        <Sidebar step={step} setStep={setStep}/>

        {/* Zone principale */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>

          {/* En-tête de page */}
          <div style={{ padding:"32px 44px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div>
              {/* Numéro d'étape */}
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--ink4)",
                letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>
                Étape {step+1} sur {STEPS.length}
              </div>
              {/* Titre de l'étape */}
              <h1 key={step} style={{ fontFamily:"'Playfair Display',serif", fontSize:28,
                fontWeight:600, color:"var(--ink)", lineHeight:1.1, letterSpacing:"-0.5px",
                animation:"slideIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
                {cur.label}
              </h1>
            </div>

            {/* Barre de progression */}
            <div style={{ textAlign:"right", paddingBottom:6 }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11,
                color:"var(--ink3)", marginBottom:6 }}>{progress}%</div>
              <div style={{ width:120, height:3, background:"var(--cream3)", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`,
                  background:"var(--terra)", borderRadius:99,
                  transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)" }}/>
              </div>
            </div>
          </div>

          {/* Ligne décorative sous le titre */}
          <div style={{ margin:"18px 44px 0", height:"1px", background:"var(--border)" }}/>

          {/* Contenu scrollable */}
          <div style={{ flex:1, padding:"28px 44px 20px", overflowY:"auto" }}>
            <div key={animKey} className="slide" style={{ maxWidth:680 }}>
              {CONTENT[cur.id]}
            </div>
          </div>

          {/* Barre de navigation */}
          {!isLast && (
            <div style={{ borderTop:"1.5px solid var(--border)", background:"var(--cream2)" }}>

              {/* Bandeau erreur */}
              {showErrors && ERRORS[cur.id] && (
                <div style={{ padding:"10px 44px", background:"#fdf0ee",
                  borderBottom:"1px solid rgba(192,57,43,0.15)",
                  display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:14 }}>⚠️</span>
                  <span style={{ fontSize:12.5, color:"#c0392b" }}>{ERRORS[cur.id]}</span>
                </div>
              )}

              <div style={{ padding:"16px 44px", display:"flex",
                justifyContent:"space-between", alignItems:"center" }}>
                {!isFirst
                  ? <button className="btn-line" onClick={goPrev}>← Retour</button>
                  : <div/>}

                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  {/* Dots de progression */}
                  <div style={{ display:"flex", gap:5 }}>
                    {STEPS.map((_,i) => (
                      <div key={i} style={{ height:5, borderRadius:99, transition:"all 0.3s",
                        width: i===step ? 20 : 5,
                        background: i<step ? "var(--terra2)" : i===step ? "var(--terra)" : "var(--border2)" }}/>
                    ))}
                  </div>
                  <button className="btn-main" onClick={goNext}>
                    {step===STEPS.length-2 ? "Voir mon CV →" : "Continuer →"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer global */}
          <div style={{ padding:"10px 44px", borderTop:"1px solid var(--border)",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            background:"var(--cream2)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <svg width="18" height="20" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="26" height="33" rx="4" fill="rgba(0,0,0,0.05)"/>
                <rect x="3" y="2" width="26" height="33" rx="4" fill="#fff" stroke="#d4c9b5" strokeWidth="1.5"/>
                <path d="M22 2 L29 9 L22 9 Z" fill="#e8dfc8"/>
                <rect x="8" y="14" width="10" height="2.5" rx="1.2" fill="#b85c38"/>
                <rect x="8" y="20" width="16" height="1.5" rx="0.7" fill="#d4c9b5"/>
                <circle cx="28" cy="33" r="6" fill="#2a7a2a"/>
                <path d="M25 33 L27.2 35.2 L31 31" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:12,
                fontStyle:"italic", color:"var(--ink4)" }}>lawalitoe</span>
            </div>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5,
              color:"var(--ink4)", letterSpacing:"1.5px", textTransform:"uppercase" }}>
              CVtools · {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
