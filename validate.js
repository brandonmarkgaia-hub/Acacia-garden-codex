/* ACACIA VALIDATE: cycles/manifest.json vs acacia.schema.json */
(async ()=>{
  const ok = (x)=>console.log("%c✔ ACACIA","color:#2ecc71",x);
  const bad=(x)=>console.error("%c✖ ACACIA","color:#e74c3c",x);

  try{
    const [schemaRes, manifestRes] = await Promise.all([
      fetch('./acacia.schema.json',{cache:'no-store'}),
      fetch('./cycles/manifest.json',{cache:'no-store'})
    ]);
    if(!schemaRes.ok||!manifestRes.ok) return bad("Missing schema or manifest");

    const schema = await schemaRes.json();
    const manifest = await manifestRes.json();

    // tiny structural checks (no external AJV)
    if(!manifest.cycles || !Array.isArray(manifest.cycles)) return bad("manifest.cycles missing/invalid");
    for(const c of manifest.cycles){
      if(!c.title || !c.file) return bad("cycle missing title/file");
      if(!/\.(md|html)$/.test(c.file)) return bad("file extension not md/html");
    }
    ok("manifest structure looks valid");
    if(manifest.checksum) ok("checksum present: "+manifest.checksum);
    if(window.ACACIA?.call) ok("beacon present: "+window.ACACIA.call);
  }catch(e){ bad(e.message); }
})();
