import { useState, useEffect, useCallback, useRef } from "react";

const ODI_SECTIONS = [
  { id: "pain", title: "Section 1 — ความรุนแรงของอาการปวด", titleTH: "ความรุนแรงของอาการปวด", options: [
    { score: 0, textTH: "อาการปวดของฉันพอทนได้โดยไม่ต้องใช้ยา" },{ score: 1, textTH: "อาการปวดของฉันแย่มาก แต่ฉันก็จัดการได้โดยไม่ต้องใช้ยา" },{ score: 2, textTH: "ยาแก้ปวดช่วยลดอาการปวดได้ทั้งหมด" },{ score: 3, textTH: "ยาแก้ปวดช่วยลดอาการปวดได้บางส่วน (ประมาณครึ่งหนึ่ง)" },{ score: 4, textTH: "ยาแก้ปวดช่วยลดอาการปวดได้เล็กน้อย" },{ score: 5, textTH: "ยาแก้ปวดไม่ช่วยลดอาการปวดและฉันไม่ได้ใช้ยาแก้ปวดนั้น" }] },
  { id: "personal_care", title: "Section 2 — การดูแลตัวเอง", titleTH: "การดูแลตัวเองในชีวิตประจำวัน (อาบน้ำ แต่งตัว เป็นต้น)", options: [
    { score: 0, textTH: "ฉันสามารถอาบน้ำ, แต่งตัว ได้เหมือนปกติโดยไม่ทำให้อาการปวดมากขึ้น" },{ score: 1, textTH: "ฉันสามารถอาบน้ำ, แต่งตัว ได้เหมือนปกติแต่ทำให้มีอาการปวดเกิดขึ้น" },{ score: 2, textTH: "ฉันสามารถอาบน้ำ, แต่งตัว ได้แต่ต้องเป็นไปอย่างช้า ๆ และระมัดระวัง เพราะทำให้มีอาการปวด" },{ score: 3, textTH: "ฉันสามารถอาบน้ำ, แต่งตัว ได้แต่ต้องมีผู้ช่วยเหลือบ้างบางส่วน" },{ score: 4, textTH: "ฉันสามารถอาบน้ำ, แต่งตัว ได้แต่ต้องมีผู้ช่วยเหลือเกือบทั้งหมด" },{ score: 5, textTH: "ฉันสามารถอาบน้ำ, แต่งตัว ได้เอง และต้องอยู่แต่บนเตียง" }] },
  { id: "lifting", title: "Section 3 — การยกของ", titleTH: "การยกของ", options: [
    { score: 0, textTH: "ฉันสามารถยกของหนักได้โดยไม่มีอาการปวดมากขึ้น" },{ score: 1, textTH: "ฉันสามารถยกของหนักได้แต่ทำให้เกิดอาการปวดมากขึ้น" },{ score: 2, textTH: "ฉันไม่สามารถยกของหนักจากพื้นได้ แต่ถ้าของหนักอยู่สูงระดับโต๊ะฉันจะสามารถยกของหนักนั้นได้" },{ score: 3, textTH: "ฉันไม่สามารถยกของหนักจากพื้นได้ แต่ถ้าของหนักอยู่สูงระดับโต๊ะ ฉันจะสามารถยกของได้แต่น้ำหนักของต้องไม่มากนัก" },{ score: 4, textTH: "ฉันสามารถยกได้แต่ของน้ำหนักเบา ๆ" },{ score: 5, textTH: "ฉันไม่สามารถยกของได้เลย" }] },
  { id: "walking", title: "Section 4 — การเดิน", titleTH: "การเดิน", options: [
    { score: 0, textTH: "ฉันสามารถเดินได้ระยะทางเหมือนปกติโดยไม่มีอาการปวด" },{ score: 1, textTH: "อาการปวดทำให้ฉันสามารถเดินได้ระยะทางไม่เกิน 1.6 กิโลเมตร (ประมาณ 5 ป้ายรถเมล์)" },{ score: 2, textTH: "อาการปวดทำให้ฉันสามารถเดินได้ระยะทางไม่เกิน 800 เมตร (ประมาณ 2 ป้ายรถเมล์)" },{ score: 3, textTH: "อาการปวดทำให้ฉันสามารถเดินได้ระยะทางไม่เกิน 400 เมตร (ประมาณ 1 ป้ายรถเมล์)" },{ score: 4, textTH: "ฉันสามารถเดินได้แต่ต้องใช้เครื่องช่วยเดิน เช่น ไม้เท้า, ไม้ค้ำพยุง" },{ score: 5, textTH: "ฉันต้องอยู่แต่บนเตียง แต่ต้องคลานเวลาจะไปห้องน้ำ" }] },
  { id: "sitting", title: "Section 5 — การนั่ง", titleTH: "การนั่ง", options: [
    { score: 0, textTH: "ฉันสามารถนั่งได้นานเหมือนปกติโดยไม่มีอาการปวด" },{ score: 1, textTH: "ฉันสามารถนั่งได้นานเหมือนปกติโดยไม่มีอาการปวดเฉพาะเก้าอี้ที่ฉันนั่งเป็นประจำและสบายเท่านั้น" },{ score: 2, textTH: "อาการปวดทำให้ฉันสามารถนั่งได้ไม่เกิน 1 ชั่วโมง" },{ score: 3, textTH: "อาการปวดทำให้ฉันสามารถนั่งได้ไม่เกิน 30 นาที" },{ score: 4, textTH: "อาการปวดทำให้ฉันสามารถนั่งได้ไม่เกิน 10 นาที" },{ score: 5, textTH: "อาการปวดทำให้ฉันไม่สามารถนั่งได้เลย" }] },
  { id: "standing", title: "Section 6 — การยืน", titleTH: "การยืน", options: [
    { score: 0, textTH: "ฉันสามารถยืนได้นานเหมือนปกติ โดยไม่มีอาการปวดมากขึ้น" },{ score: 1, textTH: "ฉันสามารถยืนได้นานเหมือนปกติแต่จะทำให้ฉันปวดมากขึ้น" },{ score: 2, textTH: "อาการปวดทำให้ฉันสามารถยืนได้ไม่เกิน 1 ชั่วโมง" },{ score: 3, textTH: "อาการปวดทำให้ฉันสามารถยืนได้ไม่เกิน 30 นาที" },{ score: 4, textTH: "อาการปวดทำให้ฉันสามารถยืนได้ไม่เกิน 10 นาที" },{ score: 5, textTH: "อาการปวดทำให้ฉันไม่สามารถยืนได้เลย" }] },
  { id: "sleeping", title: "Section 7 — การนอน", titleTH: "การนอน", options: [
    { score: 0, textTH: "ฉันสามารถหลับได้เหมือนปกติ โดยไม่มีอาการปวด" },{ score: 1, textTH: "ฉันสามารถหลับได้เหมือนปกติแต่ต้องใช้ยา" },{ score: 2, textTH: "ถึงแม้จะใช้ยาแล้วก็ตามฉันสามารถหลับได้น้อยกว่า 6 ชั่วโมง" },{ score: 3, textTH: "ถึงแม้จะใช้ยาแล้วก็ตามฉันสามารถหลับได้น้อยกว่า 4 ชั่วโมง" },{ score: 4, textTH: "ถึงแม้จะใช้ยาแล้วก็ตามฉันสามารถหลับได้น้อยกว่า 2 ชั่วโมง" },{ score: 5, textTH: "อาการปวดทำให้ฉันไม่สามารถหลับได้เลย" }] },
  { id: "sex_life", title: "Section 8 — การมีเพศสัมพันธ์", titleTH: "การมีเพศสัมพันธ์", options: [
    { score: 0, textTH: "ฉันสามารถมีเพศสัมพันธ์ได้เหมือนปกติโดยไม่มีอาการปวดมากขึ้น" },{ score: 1, textTH: "ฉันสามารถมีเพศสัมพันธ์ได้เหมือนปกติแต่จะทำให้ฉันปวดมากขึ้น" },{ score: 2, textTH: "ฉันสามารถมีเพศสัมพันธ์ได้เกือบเหมือนปกติ แต่มีอาการปวดมาก" },{ score: 3, textTH: "ฉันมีเพศสัมพันธ์ได้น้อยมากเพราะอาการปวด" },{ score: 4, textTH: "ฉันปวดมากจนแทบจะไม่สามารถมีเพศสัมพันธ์ได้" },{ score: 5, textTH: "ฉันปวดมากจนไม่สามารถมีเพศสัมพันธ์ได้เลย" }] },
  { id: "social_life", title: "Section 9 — การเข้าสังคม", titleTH: "การเข้าสังคม เช่น การไปตลาด ดูหนัง ไปห้างสรรพสินค้า", options: [
    { score: 0, textTH: "ฉันสามารถเข้าสังคมได้เหมือนปกติโดยไม่มีอาการปวดมากขึ้น" },{ score: 1, textTH: "ฉันสามารถเข้าสังคมได้เหมือนปกติโดยมีอาการปวดมากขึ้น" },{ score: 2, textTH: "อาการปวดไม่ได้มีผลต่อการเข้าสังคมของฉันมากนัก ยกเว้นมีกิจกรรมที่ต้องเคลื่อนไหวมาก เช่น การเต้นรำ เล่นกีฬา เป็นต้น" },{ score: 3, textTH: "อาการปวดทำให้ฉันไม่สามารถเข้าสังคมนอกบ้านได้บ่อย ๆ" },{ score: 4, textTH: "อาการปวดทำให้ฉันไม่สามารถเข้าสังคมนอกบ้านได้แต่สามารถมีการเข้าสังคมที่จัดในบ้านได้" },{ score: 5, textTH: "อาการปวดทำให้ฉันไม่สามารถเข้าสังคมได้เลย" }] },
  { id: "travelling", title: "Section 10 — การเดินทาง", titleTH: "การเดินทาง", options: [
    { score: 0, textTH: "ฉันสามารถเดินทางไปที่ต่าง ๆ ได้โดยไม่มีอาการปวดมากขึ้น" },{ score: 1, textTH: "ฉันสามารถเดินทางไปที่ต่าง ๆ ได้แต่มีอาการปวดมากขึ้น" },{ score: 2, textTH: "อาการปวดของฉันแย่มาก แต่ฉันก็สามารถจัดการได้ และเดินทางได้มากกว่า 1 ชั่วโมง" },{ score: 3, textTH: "อาการปวดทำให้ฉันสามารถเดินทางไปที่ต่าง ๆ ได้น้อยกว่า 1 ชั่วโมง" },{ score: 4, textTH: "อาการปวดทำให้ฉันสามารถเดินทางไปที่ใกล้ ๆ ได้ที่ใช้เวลาน้อยกว่า 30 นาที" },{ score: 5, textTH: "ฉันไม่สามารถเดินทางไปที่ต่าง ๆ ได้ ยกเว้นไปพบแพทย์ หรือ ไปโรงพยาบาล" }] },
];

const FONT = "'Sarabun', 'Segoe UI', sans-serif";
const BG = "linear-gradient(160deg, #f0f4f8 0%, #e2e8f0 50%, #dbeafe 100%)";
const IS = { width: "100%", padding: "12px 14px", border: "2px solid #e2e8f0", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" };
const fi = e => e.target.style.borderColor = "#2563eb";
const fo = e => e.target.style.borderColor = "#e2e8f0";
function gDL(p) { if(p<=20) return {level:"Minimal Disability",levelTH:"ความพิการน้อยมาก",color:"#22c55e",bg:"#f0fdf4"}; if(p<=40) return {level:"Moderate Disability",levelTH:"ความพิการปานกลาง",color:"#eab308",bg:"#fefce8"}; if(p<=60) return {level:"Severe Disability",levelTH:"ความพิการรุนแรง",color:"#f97316",bg:"#fff7ed"}; if(p<=80) return {level:"Crippling Disability",levelTH:"พิการมาก",color:"#ef4444",bg:"#fef2f2"}; return {level:"Bed-bound or Exaggerated Disability",levelTH:"ติดเตียง",color:"#991b1b",bg:"#fef2f2"}; }
function gRec(p) { if(p<=20) return {icon:"✅",summary:"คุณสามารถทำกิจวัตรประจำวันได้ตามปกติ อาการปวดของคุณยังอยู่ในระดับที่ควบคุมได้",advice:["ควรดูแลร่างกายให้แข็งแรงด้วยการออกกำลังกายเบา ๆ เช่น โยคะ, พิลาทิส, ว่ายน้ำ หรือเดิน","หลีกเลี่ยงท่าทางที่อาจกระตุ้นอาการปวดหลัง เช่น การยกของหนักในท่าที่ไม่ถูกต้อง","หากอาการปวดเพิ่มขึ้นหรือไม่ดีขึ้นภายใน 2-4 สัปดาห์ ควรพบแพทย์เพื่อตรวจเพิ่มเติม"]}; if(p<=40) return {icon:"⚠️",summary:"คุณอาจเริ่มมีข้อจำกัดในบางกิจกรรม อาการปวดอาจรบกวนการใช้ชีวิตประจำวัน",advice:["ควรพบแพทย์ เพื่อประเมินเพิ่มเติม และรับคำแนะนำด้านการรักษา","หลีกเลี่ยงกิจกรรมที่ทำให้เกิดอาการปวดมากขึ้น","อาจต้องมีการเอกซเรย์ (X-ray) หรือ MRI เพื่อหาความผิดปกติของกระดูกสันหลัง"]}; if(p<=60) return {icon:"🔴",summary:"คุณมีข้อจำกัดในการใช้ชีวิตประจำวันและอาการปวดอาจรุนแรงมากขึ้น",advice:["รีบพบแพทย์ผู้เชี่ยวชาญด้านกระดูกและข้อ (Orthopedic หรือ Spine Specialist)","อาจต้องมีการเอกซเรย์ (X-ray) หรือ MRI เพื่อหาความผิดปกติของกระดูกสันหลัง"]}; if(p<=80) return {icon:"🚨",summary:"อาการปวดมีผลกระทบมากต่อการดำเนินชีวิตประจำวัน อาจต้องพึ่งพาผู้อื่นช่วยเหลือ",advice:["รีบพบแพทย์ผู้เชี่ยวชาญด้านกระดูกและข้อ (Spine Specialist) เพื่อทำการวินิจฉัย","อาจต้องมีการตรวจ MRI หรือ CT Scan เพื่อประเมินความเสียหายของกระดูกสันหลัง"]}; return {icon:"🏥",summary:"คุณอาจมีอาการปวดรุนแรงมากจนเคลื่อนไหวได้น้อย",advice:["พบแพทย์โดยด่วน เพื่อประเมินการรักษาและตรวจกระดูกสันหลัง","อาจต้องมีการรักษาด้วยการผ่าตัดหรือวิธีเฉพาะทาง","ควรปรึกษาผู้เชี่ยวชาญ"]}; }
function cAge(bd) { if(!bd) return null; const t=new Date(),b=new Date(bd); let a=t.getFullYear()-b.getFullYear(); if(t.getMonth()-b.getMonth()<0||(t.getMonth()===b.getMonth()&&t.getDate()<b.getDate())) a--; return a; }
function fD(iso) { return new Date(iso).toLocaleDateString("th-TH",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); }
import { supabase } from './supabase.js'

async function ldR() {
  try {
    const { data, error } = await supabase.from('odi_records').select('*').order('submitted_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(r => ({
      id: r.id, patient: r.patient, answers: r.answers,
      skippedSections: r.skipped_sections || [],
      totalScore: r.total_score, maxScore: r.max_score,
      percentage: r.percentage, level: r.level, levelTH: r.level_th,
      submittedAt: r.submitted_at
    }));
  } catch(e) { console.error('ldR error:', e); return []; }
}

// Records are managed via addRecord/delRecord/clearAllRecords

async function addRecord(rec) {
  try {
    const { error } = await supabase.from('odi_records').insert({
      id: rec.id, patient: rec.patient, answers: rec.answers,
      skipped_sections: rec.skippedSections,
      total_score: rec.totalScore, max_score: rec.maxScore,
      percentage: rec.percentage, level: rec.level, level_th: rec.levelTH,
      submitted_at: rec.submittedAt
    });
    if (error) throw error;
    console.log('✅ Record saved:', rec.id);
  } catch(e) { console.error('addRecord error:', e); }
}

async function delRecord(id) {
  try {
    const { error } = await supabase.from('odi_records').delete().eq('id', id);
    if (error) throw error;
  } catch(e) { console.error('delRecord error:', e); }
}

async function clearAllRecords() {
  try {
    const { error } = await supabase.from('odi_records').delete().neq('id', '');
    if (error) throw error;
  } catch(e) { console.error('clearAll error:', e); }
}

async function ldU() {
  try {
    const { data, error } = await supabase.from('odi_users').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(u => ({
      id: u.id, username: u.username, password: u.password,
      displayName: u.display_name, role: u.role, createdAt: u.created_at
    }));
  } catch(e) {
    console.error('ldU error:', e);
    return [{ id:"admin", username:"admin", password:"1234", displayName:"ผู้ดูแลระบบ", role:"admin", createdAt:new Date().toISOString() }];
  }
}

async function addUser(u) {
  try {
    const { error } = await supabase.from('odi_users').insert({
      id: u.id, username: u.username, password: u.password,
      display_name: u.displayName, role: u.role, created_at: u.createdAt
    });
    if (error) throw error;
  } catch(e) { console.error('addUser error:', e); }
}

async function updateUser(id, updates) {
  try {
    const obj = {};
    if (updates.displayName) obj.display_name = updates.displayName;
    if (updates.password) obj.password = updates.password;
    if (updates.role) obj.role = updates.role;
    const { error } = await supabase.from('odi_users').update(obj).eq('id', id);
    if (error) throw error;
  } catch(e) { console.error('updateUser error:', e); }
}

async function deleteUser(id) {
  try {
    const { error } = await supabase.from('odi_users').delete().eq('id', id);
    if (error) throw error;
  } catch(e) { console.error('deleteUser error:', e); }
}

function PatientInfoForm({onStart,onAdmin}) {
  const [n,sN]=useState("");const [bd,sBd]=useState("");const [g,sG]=useState("");const [hn,sHn]=useState("");
  const age=cAge(bd); const ok=n&&bd&&g;
  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:FONT}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div style={{background:"#fff",borderRadius:20,boxShadow:"0 8px 32px rgba(30,58,92,0.10)",overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg, #1e3a5c 0%, #2563eb 100%)",padding:"32px 32px 28px",color:"#fff"}}>
            <div style={{fontSize:13,fontWeight:600,letterSpacing:2,textTransform:"uppercase",opacity:0.8,marginBottom:8}}>Oswestry Disability Index</div>
            <div style={{fontSize:22,fontWeight:700}}>แบบสอบถามอาการปวดหลังส่วนล่าง</div>
            <div style={{fontSize:14,marginTop:8,opacity:0.85}}>กรุณากรอกข้อมูลเบื้องต้นก่อนเริ่มทำแบบสอบถาม</div>
          </div>
          <div style={{padding:"28px 32px 36px"}}>
            <div style={{marginBottom:18}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6}}>ชื่อ-นามสกุล *</label><input value={n} onChange={e=>sN(e.target.value)} placeholder="กรอกชื่อ-นามสกุล" style={IS} onFocus={fi} onBlur={fo}/></div>
            <div style={{marginBottom:18}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6}}>วันเดือนปีเกิด *</label><div style={{display:"flex",alignItems:"center",gap:10}}><input value={bd} onChange={e=>sBd(e.target.value)} type="date" max={new Date().toISOString().split("T")[0]} style={{...IS,flex:1,color:bd?"#1e293b":"#94a3b8"}} onFocus={fi} onBlur={fo}/>{age!==null&&age>=0&&<div style={{padding:"10px 16px",background:"#eff6ff",borderRadius:10,fontSize:14,fontWeight:700,color:"#2563eb",whiteSpace:"nowrap"}}>อายุ {age} ปี</div>}</div></div>
            <div style={{marginBottom:18}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6}}>เพศ *</label><select value={g} onChange={e=>sG(e.target.value)} style={{...IS,background:"#fff",color:g?"#1e293b":"#94a3b8"}} onFocus={fi} onBlur={fo}><option value="" disabled>เลือกเพศ</option><option value="ชาย">ชาย</option><option value="หญิง">หญิง</option><option value="อื่นๆ">อื่นๆ</option></select></div>
            <div style={{marginBottom:24}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6}}>เบอร์โทรศัพท์ <span style={{fontWeight:400,color:"#94a3b8"}}>— ไม่บังคับ</span></label><input value={hn} onChange={e=>sHn(e.target.value)} placeholder="เช่น 0812345678" type="tel" style={IS} onFocus={fi} onBlur={fo}/></div>
            <button disabled={!ok} onClick={()=>onStart({name:n,hn,birthdate:bd,age,gender:g})} style={{width:"100%",padding:"14px",background:!ok?"#cbd5e1":"linear-gradient(135deg, #2563eb, #1e40af)",color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:!ok?"not-allowed":"pointer",boxShadow:!ok?"none":"0 4px 14px rgba(37,99,235,0.3)"}}>เริ่มทำแบบสอบถาม →</button>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:20}}>
          <button onClick={onAdmin} style={{background:"none",border:"none",color:"#94a3b8",fontSize:13,cursor:"pointer",padding:"8px 16px",borderRadius:8}} onMouseEnter={e=>e.target.style.color="#2563eb"} onMouseLeave={e=>e.target.style.color="#94a3b8"}>🔒 เข้าสู่ระบบสำหรับเจ้าหน้าที่</button>
        </div>
      </div>
    </div>
  );
}

function QuestionnaireStep({section,index,total,answer,onAnswer,onNext,onPrev,onSkip}) {
  const noAns = answer===undefined && section.id!=="sex_life";
  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"24px",fontFamily:FONT}}>
      <div style={{width:"100%",maxWidth:640,paddingTop:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#2563eb",minWidth:48}}>{index+1}/{total}</div>
          <div style={{flex:1,height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}><div style={{width:`${((index+1)/total)*100}%`,height:"100%",background:"linear-gradient(90deg, #2563eb, #3b82f6)",borderRadius:3,transition:"width 0.4s ease"}}/></div>
        </div>
        <div style={{background:"#fff",borderRadius:20,boxShadow:"0 8px 32px rgba(30,58,92,0.10)",overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg, #1e3a5c 0%, #2563eb 100%)",padding:"24px 28px",color:"#fff"}}><div style={{fontSize:14,opacity:0.8,marginBottom:4}}>{section.title}</div><div style={{fontSize:20,fontWeight:700}}>{section.titleTH}</div></div>
          <div style={{padding:"20px 28px 28px"}}>
            <p style={{fontSize:14,color:"#64748b",margin:"0 0 16px"}}>กรุณาทำเครื่องหมายเพียงช่องเดียวที่สามารถอธิบายอาการได้ใกล้เคียงกับอาการของท่านมากที่สุด</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {section.options.map((o,i)=>{const s=answer===o.score;return(<button key={i} onClick={()=>onAnswer(o.score)} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",border:s?"2px solid #2563eb":"2px solid #e2e8f0",borderRadius:12,background:s?"#eff6ff":"#fff",cursor:"pointer",textAlign:"left",fontSize:14,lineHeight:1.5,color:"#1e293b"}}><div style={{width:22,height:22,borderRadius:"50%",border:s?"2px solid #2563eb":"2px solid #cbd5e1",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,background:s?"#2563eb":"transparent"}}>{s&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}</div><div style={{fontWeight:s?600:400}}>{o.textTH}</div></button>);})}
            </div>
            {section.id==="sex_life"&&<button onClick={onSkip} style={{marginTop:12,padding:"10px 20px",background:"#f1f5f9",border:"none",borderRadius:8,fontSize:13,color:"#64748b",cursor:"pointer",fontWeight:600}}>ข้ามข้อนี้ (ไม่ต้องการตอบ)</button>}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>
              <button onClick={onPrev} disabled={index===0} style={{padding:"12px 24px",background:index===0?"#f1f5f9":"#fff",border:"2px solid #e2e8f0",borderRadius:10,fontSize:14,fontWeight:600,color:index===0?"#cbd5e1":"#475569",cursor:index===0?"not-allowed":"pointer"}}>← ย้อนกลับ</button>
              <button onClick={onNext} disabled={noAns} style={{padding:"12px 28px",background:noAns?"#cbd5e1":"linear-gradient(135deg, #2563eb, #1e40af)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:noAns?"not-allowed":"pointer",boxShadow:noAns?"none":"0 4px 14px rgba(37,99,235,0.3)"}}>{index===total-1?"ดูผลลัพธ์":"ถัดไป →"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultPage({patient,answers,skippedSections,onNewPatient}) {
  const ans=ODI_SECTIONS.filter(s=>!skippedSections.includes(s.id));
  const ts=ans.reduce((s,sec)=>s+(answers[sec.id]||0),0), ms=ans.length*5, pct=Math.round((ts/ms)*100);
  const res=gDL(pct), rec=gRec(pct), ref=useRef(null);
  const [cap,sCap]=useState(false);
  const savedRef=useRef(false);
  useEffect(()=>{
    if(savedRef.current) return;
    savedRef.current=true;
    const record={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),patient,answers,skippedSections,totalScore:ts,maxScore:ms,percentage:pct,level:res.level,levelTH:res.levelTH,submittedAt:new Date().toISOString()};
    (async()=>{
      try{await addRecord(record);console.log("✅ ODI record saved:",record.id);}catch(e){console.error("❌ Save failed:",e);}
    })();
  },[]);
  const shot=async()=>{if(!ref.current||cap)return;sCap(true);try{if(!window.html2canvas){await new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";s.onload=r;s.onerror=j;document.head.appendChild(s);});}const c=await window.html2canvas(ref.current,{scale:2,backgroundColor:"#f0f4f8",useCORS:true,logging:false});const l=document.createElement("a");l.download=`ODI_${patient.name.replace(/\s+/g,"_")}_${new Date().toISOString().slice(0,10)}.png`;l.href=c.toDataURL("image/png");l.click();}catch{alert("ไม่สามารถบันทึกภาพได้");}sCap(false);};
  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"24px",fontFamily:FONT}}>
      <div style={{width:"100%",maxWidth:600,paddingTop:20}} ref={ref}>
        <div style={{background:"#fff",borderRadius:20,boxShadow:"0 8px 32px rgba(30,58,92,0.10)",overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg, #1e3a5c 0%, #2563eb 100%)",padding:"28px 32px",color:"#fff",textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:600,letterSpacing:2,textTransform:"uppercase",opacity:0.8,marginBottom:6}}>ผลการประเมิน ODI</div>
            <div style={{fontSize:22,fontWeight:700}}>{patient.name}</div>
            {patient.hn&&<div style={{fontSize:13,opacity:0.7,marginTop:4}}>Tel: {patient.hn}</div>}
          </div>
          <div style={{padding:"32px",textAlign:"center"}}>
            <div style={{position:"relative",width:160,height:160,margin:"0 auto 24px"}}><svg viewBox="0 0 160 160" style={{transform:"rotate(-90deg)"}}><circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="12"/><circle cx="80" cy="80" r="70" fill="none" stroke={res.color} strokeWidth="12" strokeDasharray={`${(pct/100)*440} 440`} strokeLinecap="round" style={{transition:"stroke-dasharray 1s ease"}}/></svg><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}><div style={{fontSize:40,fontWeight:800,color:res.color}}>{pct}%</div></div></div>
            <div style={{display:"inline-block",padding:"8px 24px",borderRadius:20,background:res.bg,color:res.color,fontWeight:700,fontSize:16,marginBottom:8}}>{res.levelTH}</div>
            <div style={{fontSize:14,color:"#64748b",marginBottom:24}}>{res.level}</div>
            <div style={{background:"#f8fafc",borderRadius:12,padding:"16px",marginBottom:24,textAlign:"left"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:14}}><div><span style={{color:"#94a3b8"}}>คะแนนรวม:</span> <strong>{ts}/{ms}</strong></div><div><span style={{color:"#94a3b8"}}>จำนวนข้อที่ตอบ:</span> <strong>{ans.length}/10</strong></div><div><span style={{color:"#94a3b8"}}>วันเกิด:</span> <strong>{new Date(patient.birthdate).toLocaleDateString("th-TH",{year:"numeric",month:"short",day:"numeric"})} ({patient.age} ปี)</strong></div><div><span style={{color:"#94a3b8"}}>เพศ:</span> <strong>{patient.gender}</strong></div></div></div>
            <div style={{textAlign:"left",marginBottom:24,background:res.bg,border:`2px solid ${res.color}20`,borderRadius:14,padding:"20px",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:res.color}}/><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:22}}>{rec.icon}</span><div style={{fontSize:15,fontWeight:700,color:res.color}}>คำแนะนำสำหรับผู้ป่วย</div></div><div style={{fontSize:14,color:"#1e293b",lineHeight:1.7,marginBottom:14,fontWeight:500}}>{rec.summary}</div><div style={{fontSize:13,color:"#475569",lineHeight:1.8}}>{rec.advice.map((a,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:8}}><span style={{color:res.color,fontWeight:700,flexShrink:0}}>•</span><span>{a}</span></div>)}</div></div>
            <div style={{textAlign:"left",marginBottom:24}}><div style={{fontSize:14,fontWeight:700,color:"#1e293b",marginBottom:12}}>คะแนนรายหมวด</div>{ODI_SECTIONS.map(s=>{const sk=skippedSections.includes(s.id),sc=answers[s.id]||0;return(<div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}><div style={{flex:1,fontSize:13,color:sk?"#cbd5e1":"#475569"}}>{s.titleTH}</div>{sk?<span style={{fontSize:12,color:"#cbd5e1"}}>ข้าม</span>:(<><div style={{width:80,height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}><div style={{width:`${(sc/5)*100}%`,height:"100%",background:gDL((sc/5)*100).color,borderRadius:3}}/></div><span style={{fontSize:13,fontWeight:600,color:"#475569",minWidth:24,textAlign:"right"}}>{sc}/5</span></>)}</div>);})}</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={shot} disabled={cap} style={{flex:1,padding:"14px",background:cap?"#94a3b8":"linear-gradient(135deg, #2563eb, #1e40af)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:cap?"wait":"pointer",boxShadow:cap?"none":"0 4px 14px rgba(37,99,235,0.3)"}}>{cap?"⏳ กำลังบันทึก...":"💾 บันทึกผล"}</button>
              <button onClick={onNewPatient} style={{flex:1,padding:"14px",background:"#f1f5f9",color:"#475569",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>🔄 เริ่มทำแบบประเมินใหม่</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({onLogin,onBack}) {
  const [mode,sMode]=useState("login"); // login | reset | resetDone
  const [u,sU]=useState("");const [p,sP]=useState("");const [err,sE]=useState("");const [ld,sL]=useState(false);
  // Reset password states
  const [rUser,sRU]=useState("");const [rName,sRN]=useState("");const [rNewPw,sRNP]=useState("");const [rConfPw,sRCP]=useState("");const [rErr,sRE]=useState("");const [rSuccess,sRS]=useState("");

  const go=async()=>{sE("");sL(true);const us=await ldU();const f=us.find(x=>x.username===u&&x.password===p);sL(false);if(f)onLogin(f);else sE("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");};

  const resetPw=async()=>{
    sRE("");sRS("");
    if(!rUser||!rName||!rNewPw||!rConfPw){sRE("กรุณากรอกข้อมูลให้ครบทุกช่อง");return;}
    if(rNewPw!==rConfPw){sRE("รหัสผ่านใหม่ไม่ตรงกัน");return;}
    if(rNewPw.length<4){sRE("รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร");return;}
    const users=await ldU();
    const found=users.find(x=>x.username===rUser&&x.displayName===rName);
    if(!found){sRE("ไม่พบผู้ใช้ที่ตรงกับข้อมูล กรุณาตรวจสอบชื่อผู้ใช้และชื่อแสดงผล");return;}
    await updateUser(found.id, { password: rNewPw });
    sMode("resetDone");
  };

  const darkInput={width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,255,255,0.15)",borderRadius:12,fontSize:15,color:"#fff",outline:"none",boxSizing:"border-box"};
  const dFi=e=>e.target.style.borderColor="#3b82f6";
  const dFo=e=>e.target.style.borderColor="rgba(255,255,255,0.15)";

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg, #0f172a 0%, #1e3a5c 60%, #1e40af 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:FONT}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:64,height:64,background:"rgba(255,255,255,0.1)",borderRadius:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16,border:"1px solid rgba(255,255,255,0.15)"}}>{mode==="login"?"🔐":"🔑"}</div>
          <div style={{color:"#fff",fontSize:22,fontWeight:700}}>{mode==="login"?"ระบบหลังบ้าน ODI":mode==="reset"?"รีเซ็ตรหัสผ่าน":"สำเร็จ!"}</div>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:14,marginTop:6}}>{mode==="login"?"เข้าสู่ระบบสำหรับเจ้าหน้าที่":mode==="reset"?"ยืนยันตัวตนเพื่อตั้งรหัสผ่านใหม่":"รหัสผ่านถูกเปลี่ยนแล้ว"}</div>
        </div>

        <div style={{background:"rgba(255,255,255,0.05)",borderRadius:20,padding:"32px",border:"1px solid rgba(255,255,255,0.1)"}}>

          {/* ── Login Mode ── */}
          {mode==="login"&&(<>
            {err&&<div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:"12px 16px",marginBottom:20,color:"#fca5a5",fontSize:14}}>{err}</div>}
            <div style={{marginBottom:18}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)",marginBottom:8}}>ชื่อผู้ใช้</label><input value={u} onChange={e=>sU(e.target.value)} placeholder="username" onKeyDown={e=>e.key==="Enter"&&go()} style={darkInput} onFocus={dFi} onBlur={dFo}/></div>
            <div style={{marginBottom:16}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)",marginBottom:8}}>รหัสผ่าน</label><input value={p} onChange={e=>sP(e.target.value)} type="password" placeholder="••••••" onKeyDown={e=>e.key==="Enter"&&go()} style={darkInput} onFocus={dFi} onBlur={dFo}/></div>
            <div style={{textAlign:"right",marginBottom:20}}><button onClick={()=>{sMode("reset");sRE("");sRS("");sRU("");sRN("");sRNP("");sRCP("");}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",textDecoration:"underline"}} onMouseEnter={e=>e.target.style.color="#93c5fd"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.5)"}>ลืมรหัสผ่าน?</button></div>
            <button onClick={go} disabled={!u||!p||ld} style={{width:"100%",padding:"14px",background:(!u||!p)?"rgba(255,255,255,0.1)":"linear-gradient(135deg, #2563eb, #1d4ed8)",color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:(!u||!p)?"not-allowed":"pointer",boxShadow:(!u||!p)?"none":"0 4px 20px rgba(37,99,235,0.4)"}}>{ld?"กำลังเข้าสู่ระบบ...":"เข้าสู่ระบบ"}</button>
          </>)}

          {/* ── Reset Password Mode ── */}
          {mode==="reset"&&(<>
            {rErr&&<div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:"12px 16px",marginBottom:20,color:"#fca5a5",fontSize:14}}>{rErr}</div>}
            <div style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:10,padding:"12px 16px",marginBottom:20,color:"#93c5fd",fontSize:13,lineHeight:1.6}}>กรอก <strong>ชื่อผู้ใช้</strong> และ <strong>ชื่อแสดงผล</strong> ให้ตรงกับข้อมูลในระบบ เพื่อยืนยันตัวตน</div>
            <div style={{marginBottom:16}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)",marginBottom:8}}>ชื่อผู้ใช้ (Username)</label><input value={rUser} onChange={e=>sRU(e.target.value)} placeholder="username" style={darkInput} onFocus={dFi} onBlur={dFo}/></div>
            <div style={{marginBottom:16}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)",marginBottom:8}}>ชื่อแสดงผล (ยืนยันตัวตน)</label><input value={rName} onChange={e=>sRN(e.target.value)} placeholder="เช่น ผู้ดูแลระบบ" style={darkInput} onFocus={dFi} onBlur={dFo}/></div>
            <div style={{height:1,background:"rgba(255,255,255,0.1)",margin:"20px 0"}}/>
            <div style={{marginBottom:16}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)",marginBottom:8}}>รหัสผ่านใหม่</label><input value={rNewPw} onChange={e=>sRNP(e.target.value)} type="password" placeholder="อย่างน้อย 4 ตัวอักษร" style={darkInput} onFocus={dFi} onBlur={dFo}/></div>
            <div style={{marginBottom:24}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)",marginBottom:8}}>ยืนยันรหัสผ่านใหม่</label><input value={rConfPw} onChange={e=>sRCP(e.target.value)} type="password" placeholder="กรอกรหัสผ่านอีกครั้ง" onKeyDown={e=>e.key==="Enter"&&resetPw()} style={darkInput} onFocus={dFi} onBlur={dFo}/></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={resetPw} style={{flex:1,padding:"14px",background:"linear-gradient(135deg, #f59e0b, #d97706)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(245,158,11,0.3)"}}>🔑 ตั้งรหัสผ่านใหม่</button>
              <button onClick={()=>sMode("login")} style={{padding:"14px 20px",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>ยกเลิก</button>
            </div>
          </>)}

          {/* ── Reset Done ── */}
          {mode==="resetDone"&&(<>
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:48,marginBottom:16}}>✅</div>
              <div style={{color:"#4ade80",fontSize:18,fontWeight:700,marginBottom:8}}>เปลี่ยนรหัสผ่านสำเร็จ!</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:14,marginBottom:24}}>สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว</div>
              <button onClick={()=>{sMode("login");sU("");sP("");sE("");}} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg, #2563eb, #1d4ed8)",color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(37,99,235,0.4)"}}>ไปหน้าเข้าสู่ระบบ</button>
            </div>
          </>)}
        </div>

        <div style={{textAlign:"center",marginTop:20}}><button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,cursor:"pointer"}}>← กลับหน้าแบบสอบถาม</button></div>
      </div>
    </div>
  );
}

function AdminPanel({currentUser,onLogout}) {
  const [tab,sTab]=useState("dashboard");
  const [records,sRec]=useState([]);const [users,sUs]=useState([]);const [loading,sLd]=useState(true);
  const [sel,sSel]=useState(null);const [search,sSch]=useState("");const [fl,sFl]=useState("all");
  const [dateFrom,sDF]=useState("");const [dateTo,sDT]=useState("");
  const [showUF,sSUF]=useState(false);const [editU,sEU]=useState(null);
  const [uf,sUF]=useState({username:"",password:"",displayName:"",role:"user"});
  const [expandCard,sEC]=useState(null);
  const [exporting,sExp]=useState(false);
  const [lastUpdate,sLU]=useState(null);

  // Load data function - reusable
  const refreshData=useCallback(async()=>{
    try{
      const [r,u]=await Promise.all([ldR(),ldU()]);
      sRec(r);sUs(u);sLU(new Date());sLd(false);
    }catch(e){console.error(e);sLd(false);}
  },[]);

  // Initial load
  useEffect(()=>{refreshData();},[refreshData]);

  // Auto-poll every 5 seconds for new data
  useEffect(()=>{
    const interval=setInterval(()=>{refreshData();},5000);
    return ()=>clearInterval(interval);
  },[refreshData]);

  // Listen for realtime changes from Supabase
  useEffect(()=>{
    const channel = supabase.channel('odi-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'odi_records' }, () => { refreshData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'odi_users' }, () => { refreshData(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },[refreshData]);
  const filt=records.filter(r=>{
    const ms=r.patient.name.toLowerCase().includes(search.toLowerCase())||(r.patient.hn||"").toLowerCase().includes(search.toLowerCase());
    const ml=fl==="all"||r.level===fl;
    const rd=r.submittedAt?r.submittedAt.slice(0,10):"";
    const md=(!dateFrom||rd>=dateFrom)&&(!dateTo||rd<=dateTo);
    return ms&&ml&&md;
  });
  const st={total:filt.length,minimal:filt.filter(r=>r.percentage<=20).length,moderate:filt.filter(r=>r.percentage>20&&r.percentage<=40).length,severe:filt.filter(r=>r.percentage>40&&r.percentage<=60).length,crippled:filt.filter(r=>r.percentage>60&&r.percentage<=80).length,bedbound:filt.filter(r=>r.percentage>80).length,avg:filt.length?Math.round(filt.reduce((s,r)=>s+r.percentage,0)/filt.length):0};

  // Age range helpers
  const AGE_RANGES = [{label:"< 20 ปี",min:0,max:19},{label:"20-29 ปี",min:20,max:29},{label:"30-39 ปี",min:30,max:39},{label:"40-49 ปี",min:40,max:49},{label:"50-59 ปี",min:50,max:59},{label:"60-69 ปี",min:60,max:69},{label:"70+ ปี",min:70,max:200}];
  const getAgeRange = (r) => { const a = cAge(r.patient.birthdate); return AGE_RANGES.find(ar => a >= ar.min && a <= ar.max) || AGE_RANGES[6]; };
  const ageStats = AGE_RANGES.map(ar => { const recs = filt.filter(r => { const a = cAge(r.patient.birthdate); return a >= ar.min && a <= ar.max; }); return { ...ar, count: recs.length, pct: filt.length ? Math.round((recs.length / filt.length) * 100) : 0, avgODI: recs.length ? Math.round(recs.reduce((s,r) => s + r.percentage, 0) / recs.length) : 0 }; });
  const genderStats = ["ชาย","หญิง","อื่นๆ"].map(g => { const recs = filt.filter(r => r.patient.gender === g); return { label: g, count: recs.length, pct: filt.length ? Math.round((recs.length / filt.length) * 100) : 0, avgODI: recs.length ? Math.round(recs.reduce((s,r) => s + r.percentage, 0) / recs.length) : 0 }; }).filter(g => g.count > 0);

  // Breakdown by age for a specific level filter
  const getCardAgeBreakdown = (filterFn) => {
    const subset = filt.filter(filterFn);
    return AGE_RANGES.map(ar => { const recs = subset.filter(r => { const a = cAge(r.patient.birthdate); return a >= ar.min && a <= ar.max; }); return { ...ar, count: recs.length, pct: subset.length ? Math.round((recs.length / subset.length) * 100) : 0 }; }).filter(x => x.count > 0);
  };

  const LEVEL_CARDS = [
    { key: "all", l: "ทั้งหมด", v: st.total, c: "#2563eb", fn: () => true },
    { key: "minimal", l: "น้อยมาก (0-20%)", v: st.minimal, c: "#22c55e", fn: r => r.percentage <= 20 },
    { key: "moderate", l: "ปานกลาง (21-40%)", v: st.moderate, c: "#eab308", fn: r => r.percentage > 20 && r.percentage <= 40 },
    { key: "severe", l: "รุนแรง (41-60%)", v: st.severe, c: "#f97316", fn: r => r.percentage > 40 && r.percentage <= 60 },
    { key: "crippled", l: "พิการมาก (61-80%)", v: st.crippled, c: "#ef4444", fn: r => r.percentage > 60 && r.percentage <= 80 },
    { key: "bedbound", l: "ติดเตียง (81-100%)", v: st.bedbound, c: "#991b1b", fn: r => r.percentage > 80 },
  ];

  // Excel export
  const exportExcel = async () => {
    sExp(true);
    try {
      const header = ["ลำดับ","ชื่อ-สกุล","เบอร์โทรศัพท์","วันเกิด","อายุ","เพศ","ODI Score (%)","คะแนนรวม","คะแนนเต็ม","ระดับ","ระดับ (EN)","วันที่ประเมิน",...ODI_SECTIONS.map(s=>s.titleTH)];
      const rows = filt.map((r,i) => [i+1, r.patient.name, r.patient.hn||"-", r.patient.birthdate, cAge(r.patient.birthdate), r.patient.gender, r.percentage, r.totalScore, r.maxScore, r.levelTH, r.level, new Date(r.submittedAt).toLocaleString("th-TH"), ...ODI_SECTIONS.map(s => (r.skippedSections||[]).includes(s.id) ? "ข้าม" : (r.answers?.[s.id] ?? "-"))]);
      // Build CSV with BOM for Excel Thai support
      const BOM = "\uFEFF";
      const csvContent = BOM + [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `ODI_Export_${new Date().toISOString().slice(0,10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch(e) { console.error(e); alert("ไม่สามารถ Export ได้"); }
    sExp(false);
  };

  const delRec=async(id)=>{if(!confirm("ต้องการลบข้อมูลนี้?"))return;await delRecord(id);sRec(records.filter(r=>r.id!==id));if(sel?.id===id)sSel(null);};
  const clrAll=async()=>{if(!confirm("ต้องการลบข้อมูลทั้งหมด?"))return;await clearAllRecords();sRec([]);sSel(null);};
  const saveUser=async()=>{if(!uf.username||!uf.displayName||(!editU&&!uf.password))return;if(editU){const updates={displayName:uf.displayName,role:uf.role};if(uf.password)updates.password=uf.password;await updateUser(editU.id,updates);sUs(users.map(u=>u.id===editU.id?{...u,...uf,password:uf.password||u.password}:u));}else{if(users.find(u=>u.username===uf.username)){alert("ชื่อผู้ใช้นี้มีอยู่แล้ว");return;}const newU={id:Date.now().toString(36),...uf,createdAt:new Date().toISOString()};await addUser(newU);sUs([...users,newU]);}sSUF(false);sEU(null);sUF({username:"",password:"",displayName:"",role:"user"});};
  const delUserFn=async(id)=>{if(id==="admin"){alert("ไม่สามารถลบผู้ดูแลระบบหลักได้");return;}if(!confirm("ต้องการลบผู้ใช้นี้?"))return;await deleteUser(id);sUs(users.filter(x=>x.id!==id));};
  if(loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,color:"#64748b",background:"#f1f5f9"}}>กำลังโหลด...</div>;

  // Mini bar component
  const MiniBar = ({pct, color, height=8}) => (<div style={{flex:1,height,background:"#e2e8f0",borderRadius:height/2,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:height/2,transition:"width 0.4s ease"}}/></div>);

  return (
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:FONT,display:"flex"}}>
      {/* Sidebar */}
      <div style={{width:240,background:"linear-gradient(180deg, #0f172a, #1e3a5c)",color:"#fff",display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh"}}>
        <div style={{padding:"24px 20px 20px"}}><div style={{fontSize:11,fontWeight:600,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:6}}>ODI System</div><div style={{fontSize:17,fontWeight:700}}>ระบบหลังบ้าน</div></div>
        <div style={{flex:1,padding:"8px 12px"}}>
          {[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"users",icon:"👥",label:"จัดการผู้ใช้"}].map(it=><button key={it.id} onClick={()=>{sTab(it.id);sSel(null);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 14px",marginBottom:4,borderRadius:10,border:"none",background:tab===it.id?"rgba(255,255,255,0.15)":"transparent",color:tab===it.id?"#fff":"rgba(255,255,255,0.6)",fontSize:14,fontWeight:tab===it.id?600:400,cursor:"pointer",textAlign:"left"}}><span style={{fontSize:18}}>{it.icon}</span>{it.label}</button>)}
        </div>
        <div style={{padding:"16px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:4}}>👤 {currentUser.displayName}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:12}}>{currentUser.role==="admin"?"ผู้ดูแลระบบ":"เจ้าหน้าที่"}</div>
          <button onClick={onLogout} style={{width:"100%",padding:"8px",background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,color:"#fca5a5",fontSize:13,cursor:"pointer",fontWeight:600}}>ออกจากระบบ</button>
        </div>
      </div>
      {/* Main */}
      <div style={{flex:1,overflow:"auto"}}>
        <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"16px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:5,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:20,fontWeight:700,color:"#1e293b"}}>{tab==="dashboard"?"📊 Dashboard":"👥 จัดการผู้ใช้งาน"}</div>
            {tab==="dashboard"&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",background:"#f0fdf4",borderRadius:20,border:"1px solid #bbf7d0"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:11,color:"#16a34a",fontWeight:600}}>Live</span>
              {lastUpdate&&<span style={{fontSize:11,color:"#86efac"}}>({lastUpdate.toLocaleTimeString("th-TH")})</span>}
            </div>}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            {tab==="dashboard"&&<button onClick={refreshData} style={{padding:"8px 14px",background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:8,color:"#475569",fontSize:13,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>🔄 รีเฟรช</button>}
            {tab==="dashboard"&&filt.length>0&&<button onClick={exportExcel} disabled={exporting} style={{padding:"8px 18px",background:"linear-gradient(135deg, #059669, #047857)",border:"none",borderRadius:8,color:"#fff",fontSize:13,cursor:"pointer",fontWeight:600,boxShadow:"0 2px 8px rgba(5,150,105,0.3)"}}>{exporting?"⏳ กำลัง Export...":"📥 Export Excel"}</button>}
            {tab==="dashboard"&&records.length>0&&currentUser.role==="admin"&&<button onClick={clrAll} style={{padding:"8px 16px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,color:"#ef4444",fontSize:12,cursor:"pointer",fontWeight:600}}>🗑️ ล้างข้อมูลทั้งหมด</button>}
            {tab==="users"&&currentUser.role==="admin"&&<button onClick={()=>{sEU(null);sUF({username:"",password:"",displayName:"",role:"user"});sSUF(true);}} style={{padding:"8px 18px",background:"linear-gradient(135deg, #2563eb, #1e40af)",border:"none",borderRadius:8,color:"#fff",fontSize:13,cursor:"pointer",fontWeight:600}}>+ เพิ่มผู้ใช้ใหม่</button>}
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        <div style={{padding:"24px 28px"}}>
          {tab==="dashboard"&&(<>
            {/* Date Filter Bar - applies to entire dashboard */}
            <div style={{background:"#fff",borderRadius:14,padding:"16px 20px",marginBottom:20,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <span style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>📅 ช่วงเวลา</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="date" value={dateFrom} onChange={e=>sDF(e.target.value)} style={{padding:"8px 14px",border:"2px solid #e2e8f0",borderRadius:10,fontSize:13,outline:"none",background:"#fff",color:dateFrom?"#1e293b":"#94a3b8"}}/>
                <span style={{fontSize:13,color:"#64748b",fontWeight:600}}>ถึง</span>
                <input type="date" value={dateTo} onChange={e=>sDT(e.target.value)} style={{padding:"8px 14px",border:"2px solid #e2e8f0",borderRadius:10,fontSize:13,outline:"none",background:"#fff",color:dateTo?"#1e293b":"#94a3b8"}}/>
              </div>
              {(dateFrom||dateTo)&&<button onClick={()=>{sDF("");sDT("");}} style={{padding:"6px 14px",background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,color:"#64748b",cursor:"pointer",fontWeight:600}}>✕ ล้างวันที่</button>}
              {(dateFrom||dateTo)&&<span style={{fontSize:12,color:"#2563eb",fontWeight:600,background:"#eff6ff",padding:"4px 10px",borderRadius:8}}>แสดงข้อมูล {filt.length} จาก {records.length} รายการ</span>}
            </div>

            {/* 1. Age & Gender analysis row */}
            {filt.length > 0 && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
                {/* Age distribution */}
                <div style={{background:"#fff",borderRadius:14,padding:"20px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e293b",marginBottom:16}}>📅 การกระจายตามช่วงอายุ</div>
                  {ageStats.filter(a=>a.count>0).map(a=>(
                    <div key={a.label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <span style={{minWidth:60,fontSize:13,fontWeight:600,color:"#475569"}}>{a.label}</span>
                      <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
                        <MiniBar pct={a.pct} color="#3b82f6"/>
                        <span style={{minWidth:30,fontSize:13,fontWeight:700,color:"#1e293b",textAlign:"right"}}>{a.count}</span>
                        <span style={{minWidth:36,fontSize:11,color:"#94a3b8"}}>({a.pct}%)</span>
                      </div>
                      <div style={{padding:"2px 8px",borderRadius:8,background:gDL(a.avgODI).bg,color:gDL(a.avgODI).color,fontSize:11,fontWeight:700}}>avg {a.avgODI}%</div>
                    </div>
                  ))}
                  {ageStats.filter(a=>a.count>0).length===0 && <div style={{color:"#94a3b8",fontSize:13}}>ยังไม่มีข้อมูล</div>}
                </div>
                {/* Gender distribution */}
                <div style={{background:"#fff",borderRadius:14,padding:"20px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e293b",marginBottom:16}}>👤 การกระจายตามเพศ</div>
                  {genderStats.map(g=>{
                    const gc = g.label==="ชาย"?"#3b82f6":g.label==="หญิง"?"#ec4899":"#8b5cf6";
                    const gi = g.label==="ชาย"?"♂️":g.label==="หญิง"?"♀️":"⚧";
                    return (
                      <div key={g.label} style={{background:"#f8fafc",borderRadius:12,padding:"16px",marginBottom:10}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:20}}>{gi}</span>
                            <span style={{fontSize:15,fontWeight:700,color:"#1e293b"}}>{g.label}</span>
                          </div>
                          <div style={{fontSize:24,fontWeight:800,color:gc}}>{g.count} <span style={{fontSize:13,fontWeight:600,color:"#94a3b8"}}>({g.pct}%)</span></div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <MiniBar pct={g.pct} color={gc} height={10}/>
                        </div>
                        <div style={{marginTop:8,fontSize:12,color:"#64748b"}}>ค่าเฉลี่ย ODI: <span style={{fontWeight:700,color:gDL(g.avgODI).color}}>{g.avgODI}%</span> ({gDL(g.avgODI).levelTH})</div>
                      </div>
                    );
                  })}
                  {genderStats.length===0 && <div style={{color:"#94a3b8",fontSize:13}}>ยังไม่มีข้อมูล</div>}
                </div>
              </div>
            )}

            {/* 2. Level stat cards - clickable to expand age breakdown */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(170px, 1fr))",gap:14,marginBottom:24}}>
              {LEVEL_CARDS.map(card=>{
                const isOpen = expandCard===card.key;
                const ageBD = isOpen ? getCardAgeBreakdown(card.fn) : [];
                return (
                  <div key={card.key} onClick={()=>sEC(isOpen?null:card.key)} style={{background:"#fff",borderRadius:14,padding:"18px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",borderLeft:`4px solid ${card.c}`,cursor:"pointer",transition:"all 0.2s",outline:isOpen?`2px solid ${card.c}`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><div style={{fontSize:28,fontWeight:800,color:card.c}}>{card.v}</div><div style={{fontSize:12,color:"#64748b",marginTop:4}}>{card.l}</div></div>
                      <div style={{fontSize:10,color:"#94a3b8",marginTop:4}}>{isOpen?"▲":"▼"}</div>
                    </div>
                    {isOpen && ageBD.length>0 && (
                      <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid #f1f5f9"}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:8}}>แยกตามช่วงอายุ</div>
                        {ageBD.map(ab=>(
                          <div key={ab.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,fontSize:12}}>
                            <span style={{minWidth:55,color:"#475569",fontWeight:500}}>{ab.label}</span>
                            <MiniBar pct={ab.pct} color={card.c} height={6}/>
                            <span style={{minWidth:24,textAlign:"right",fontWeight:700,color:card.c}}>{ab.count}</span>
                            <span style={{color:"#94a3b8",fontSize:11}}>({ab.pct}%)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 3. Average ODI */}
            {filt.length>0&&<div style={{background:"#fff",borderRadius:14,padding:"18px 20px",marginBottom:24,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}><div style={{fontSize:13,color:"#94a3b8",marginBottom:6}}>ค่าเฉลี่ย ODI Score</div><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{fontSize:32,fontWeight:800,color:gDL(st.avg).color}}>{st.avg}%</div><div style={{flex:1,height:10,background:"#e2e8f0",borderRadius:5,overflow:"hidden"}}><div style={{width:`${st.avg}%`,height:"100%",background:"linear-gradient(90deg, #22c55e, #eab308, #ef4444)",borderRadius:5}}/></div><div style={{fontSize:14,fontWeight:600,color:gDL(st.avg).color}}>{gDL(st.avg).levelTH}</div></div></div>}

            {/* Search */}
            {/* Search & Filter */}
            <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
              <input value={search} onChange={e=>sSch(e.target.value)} placeholder="🔍 ค้นหาชื่อหรือเบอร์โทร..." style={{flex:1,minWidth:180,padding:"10px 14px",border:"2px solid #e2e8f0",borderRadius:10,fontSize:14,outline:"none",background:"#fff"}}/>
              <select value={fl} onChange={e=>sFl(e.target.value)} style={{padding:"10px 14px",border:"2px solid #e2e8f0",borderRadius:10,fontSize:14,background:"#fff",outline:"none"}}><option value="all">ทุกระดับ</option><option value="Minimal Disability">Minimal (0-20%)</option><option value="Moderate Disability">Moderate (21-40%)</option><option value="Severe Disability">Severe (41-60%)</option><option value="Crippling Disability">Crippling (61-80%)</option><option value="Bed-bound or Exaggerated Disability">Bed-bound (81-100%)</option></select>
              {(search||fl!=="all")&&<button onClick={()=>{sSch("");sFl("all");}} style={{padding:"8px 14px",background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:10,fontSize:13,color:"#64748b",cursor:"pointer",fontWeight:600}}>✕ ล้าง</button>}
            </div>
            {filt.length===0?(<div style={{background:"#fff",borderRadius:14,padding:"60px 24px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}><div style={{fontSize:48,marginBottom:12}}>📋</div><div style={{fontSize:16,color:"#64748b",fontWeight:600}}>{records.length===0?"ยังไม่มีข้อมูลผู้ป่วย":"ไม่พบผลลัพธ์ที่ค้นหา"}</div></div>):(<div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}><thead><tr style={{background:"#f8fafc"}}>{["ชื่อ-สกุล","เบอร์โทรศัพท์","อายุ/เพศ","ODI Score","ระดับ","วันที่","จัดการ"].map((h,i)=><th key={i} style={{padding:"12px 16px",textAlign:i<2?"left":"center",color:"#64748b",fontWeight:600,borderBottom:"2px solid #e2e8f0"}}>{h}</th>)}</tr></thead><tbody>{filt.map(r=>{const lv=gDL(r.percentage);return(<tr key={r.id} style={{borderBottom:"1px solid #f1f5f9"}} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"12px 16px",fontWeight:600,color:"#1e293b"}}>{r.patient.name}</td><td style={{padding:"12px 16px",color:"#64748b"}}>{r.patient.hn||"-"}</td><td style={{padding:"12px 16px",textAlign:"center",color:"#64748b"}}>{cAge(r.patient.birthdate)} ปี / {r.patient.gender}</td><td style={{padding:"12px 16px",textAlign:"center"}}><span style={{fontWeight:800,fontSize:16,color:lv.color}}>{r.percentage}%</span><span style={{color:"#94a3b8",fontSize:12,marginLeft:4}}>({r.totalScore}/{r.maxScore})</span></td><td style={{padding:"12px 16px",textAlign:"center"}}><span style={{display:"inline-block",padding:"4px 12px",borderRadius:12,background:lv.bg,color:lv.color,fontWeight:600,fontSize:12}}>{r.levelTH}</span></td><td style={{padding:"12px 16px",textAlign:"center",color:"#64748b",fontSize:12}}>{fD(r.submittedAt)}</td><td style={{padding:"12px 16px",textAlign:"center"}}><button onClick={()=>sSel(sel?.id===r.id?null:r)} style={{padding:"6px 12px",background:"#eff6ff",border:"none",borderRadius:6,color:"#2563eb",fontSize:12,cursor:"pointer",fontWeight:600,marginRight:4}}>ดูรายละเอียด</button>{currentUser.role==="admin"&&<button onClick={()=>delRec(r.id)} style={{padding:"6px 10px",background:"#fef2f2",border:"none",borderRadius:6,color:"#ef4444",fontSize:12,cursor:"pointer",fontWeight:600}}>ลบ</button>}</td></tr>);})}</tbody></table></div></div>)}
            {sel&&(<div style={{background:"#fff",borderRadius:14,padding:"24px",marginTop:20,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div><div style={{fontSize:18,fontWeight:700,color:"#1e293b"}}>{sel.patient.name}</div><div style={{fontSize:13,color:"#64748b"}}>โทร: {sel.patient.hn||"-"} | เกิด {new Date(sel.patient.birthdate).toLocaleDateString("th-TH",{year:"numeric",month:"short",day:"numeric"})} ({cAge(sel.patient.birthdate)} ปี) | {sel.patient.gender} | ประเมินเมื่อ {fD(sel.submittedAt)}</div></div><button onClick={()=>sSel(null)} style={{padding:"6px 14px",background:"#f1f5f9",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,color:"#64748b"}}>✕ ปิด</button></div><div style={{display:"flex",alignItems:"center",gap:16,padding:"16px",background:gDL(sel.percentage).bg,borderRadius:12,marginBottom:16}}><div style={{fontSize:36,fontWeight:800,color:gDL(sel.percentage).color}}>{sel.percentage}%</div><div><div style={{fontSize:16,fontWeight:700,color:gDL(sel.percentage).color}}>{sel.levelTH}</div><div style={{fontSize:13,color:"#64748b"}}>{sel.level} — คะแนน {sel.totalScore}/{sel.maxScore}</div></div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:12}}>{ODI_SECTIONS.map(s=>{const sk=(sel.skippedSections||[]).includes(s.id),sc=sel.answers?.[s.id]??0,opt=s.options.find(o=>o.score===sc);return(<div key={s.id} style={{background:sk?"#f8fafc":"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:13,fontWeight:700,color:sk?"#cbd5e1":"#1e293b"}}>{s.titleTH}</div>{sk?<span style={{fontSize:11,color:"#cbd5e1",fontWeight:600}}>ข้าม</span>:<span style={{fontSize:13,fontWeight:800,color:gDL((sc/5)*100).color}}>{sc}/5</span>}</div>{!sk&&opt&&<div style={{fontSize:12,color:"#64748b",lineHeight:1.4}}>{opt.textTH}</div>}</div>);})}</div></div>)}
          </>)}
          {tab==="users"&&(<>
            {showUF&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24}}><div style={{background:"#fff",borderRadius:20,padding:"32px",width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}><div style={{fontSize:18,fontWeight:700,color:"#1e293b",marginBottom:24}}>{editU?"แก้ไขผู้ใช้":"เพิ่มผู้ใช้ใหม่"}</div><div style={{marginBottom:16}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6}}>ชื่อแสดงผล *</label><input value={uf.displayName} onChange={e=>sUF({...uf,displayName:e.target.value})} placeholder="เช่น พยาบาลสมศรี" style={IS}/></div><div style={{marginBottom:16}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6}}>Username *</label><input value={uf.username} onChange={e=>sUF({...uf,username:e.target.value})} placeholder="username" disabled={!!editU} style={{...IS,background:editU?"#f1f5f9":"#fff"}}/></div><div style={{marginBottom:16}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6}}>รหัสผ่าน {editU?"(เว้นว่างถ้าไม่เปลี่ยน)":"*"}</label><input value={uf.password} onChange={e=>sUF({...uf,password:e.target.value})} type="password" placeholder="••••••" style={IS}/></div><div style={{marginBottom:24}}><label style={{display:"block",fontSize:13,fontWeight:600,color:"#475569",marginBottom:6}}>บทบาท</label><select value={uf.role} onChange={e=>sUF({...uf,role:e.target.value})} style={{...IS,background:"#fff"}}><option value="user">เจ้าหน้าที่ (User)</option><option value="admin">ผู้ดูแลระบบ (Admin)</option></select></div><div style={{display:"flex",gap:10}}><button onClick={saveUser} style={{flex:1,padding:"12px",background:"linear-gradient(135deg, #2563eb, #1e40af)",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer"}}>💾 บันทึก</button><button onClick={()=>{sSUF(false);sEU(null);}} style={{flex:1,padding:"12px",background:"#f1f5f9",color:"#475569",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer"}}>ยกเลิก</button></div></div></div>)}
            <div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}><thead><tr style={{background:"#f8fafc"}}>{["ชื่อแสดงผล","Username","บทบาท","วันที่สร้าง","จัดการ"].map((h,i)=><th key={i} style={{padding:"12px 16px",textAlign:i<2?"left":"center",color:"#64748b",fontWeight:600,borderBottom:"2px solid #e2e8f0"}}>{h}</th>)}</tr></thead><tbody>{users.map(u=><tr key={u.id} style={{borderBottom:"1px solid #f1f5f9"}}><td style={{padding:"12px 16px",fontWeight:600,color:"#1e293b"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:"50%",background:u.role==="admin"?"linear-gradient(135deg, #f59e0b, #d97706)":"linear-gradient(135deg, #2563eb, #1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14}}>{u.displayName.charAt(0)}</div>{u.displayName}</div></td><td style={{padding:"12px 16px",color:"#64748b"}}>{u.username}</td><td style={{padding:"12px 16px",textAlign:"center"}}><span style={{display:"inline-block",padding:"4px 12px",borderRadius:12,background:u.role==="admin"?"#fefce8":"#eff6ff",color:u.role==="admin"?"#ca8a04":"#2563eb",fontWeight:600,fontSize:12}}>{u.role==="admin"?"Admin":"User"}</span></td><td style={{padding:"12px 16px",textAlign:"center",color:"#64748b",fontSize:12}}>{fD(u.createdAt)}</td><td style={{padding:"12px 16px",textAlign:"center"}}>{currentUser.role==="admin"&&<><button onClick={()=>{sEU(u);sUF({username:u.username,password:"",displayName:u.displayName,role:u.role});sSUF(true);}} style={{padding:"6px 12px",background:"#eff6ff",border:"none",borderRadius:6,color:"#2563eb",fontSize:12,cursor:"pointer",fontWeight:600,marginRight:4}}>แก้ไข</button>{u.id!=="admin"&&<button onClick={()=>delUserFn(u.id)} style={{padding:"6px 10px",background:"#fef2f2",border:"none",borderRadius:6,color:"#ef4444",fontSize:12,cursor:"pointer",fontWeight:600}}>ลบ</button>}</>}</td></tr>)}</tbody></table></div></div>
          </>)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view,sV]=useState("info");const [patient,sP]=useState(null);const [step,sSt]=useState(0);
  const [answers,sA]=useState({});const [skipped,sSk]=useState([]);const [admin,sAd]=useState(null);
  const start=(info)=>{sP(info);sV("quiz");sSt(0);sA({});sSk([]);};
  const ans=(sc)=>{sA({...answers,[ODI_SECTIONS[step].id]:sc});};
  const skip=()=>{const sid=ODI_SECTIONS[step].id;sSk([...skipped,sid]);const a={...answers};delete a[sid];sA(a);if(step<ODI_SECTIONS.length-1)sSt(step+1);else sV("result");};
  const next=()=>{if(step<ODI_SECTIONS.length-1)sSt(step+1);else sV("result");};
  const prev=()=>{if(step>0)sSt(step-1);};
  const reset=()=>{sV("info");sP(null);sA({});sSk([]);sSt(0);};
  if(view==="admin"&&admin) return <AdminPanel currentUser={admin} onLogout={()=>{sAd(null);sV("info");}}/>;
  if(view==="login") return <AdminLogin onLogin={(u)=>{sAd(u);sV("admin");}} onBack={()=>sV("info")}/>;
  if(view==="result") return <ResultPage patient={patient} answers={answers} skippedSections={skipped} onNewPatient={reset}/>;
  if(view==="quiz") return <QuestionnaireStep section={ODI_SECTIONS[step]} index={step} total={ODI_SECTIONS.length} answer={answers[ODI_SECTIONS[step].id]} onAnswer={ans} onNext={next} onPrev={prev} onSkip={skip}/>;
  return <PatientInfoForm onStart={start} onAdmin={()=>sV("login")}/>;
}
