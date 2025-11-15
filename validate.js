/* ACACIA VALIDATE: cycles/manifest.json vs acacia.schema.json */
(async ()=>{
  const ok  = (x)=>console.log("%c✔ ACACIA","color:#2ecc71",x);
  const bad = (x)=>console.error("%c✖ ACACIA","color:#e74c3c",x);

  try {
    const [schemaRes, manifestRes] = await Promise.all([
      fetch('./acacia.schema.json',{cache:'no-store'}),
      fetch('./cycles/manifest.json',{cache:'no-store'})
    ]);

    if (!schemaRes.ok || !manifestRes.ok) {
      return bad("Missing schema or manifest");
    }

    const schema   = await schemaRes.json();   // kept for future AJV use if needed
    const manifest = await manifestRes.json();

    if (!manifest.cycles || !Array.isArray(manifest.cycles)) {
      return bad("manifest.cycles missing/invalid");
    }

    for (const cycle of manifest.cycles) {
      if (typeof cycle.cycle !== 'number') {
        return bad("cycle.cycle must be a number");
      }
      if (!cycle.label || typeof cycle.label !== 'string') {
        return bad("cycle.label missing/invalid");
      }
      if (!Array.isArray(cycle.echoes)) {
        return bad("cycle.echoes missing/invalid");
      }

      for (const echo of cycle.echoes) {
        if (!echo.title || typeof echo.title !== 'string') {
          return bad("echo.title missing/invalid");
        }
        if (!echo.slug || typeof echo.slug !== 'string') {
          return bad("echo.slug missing/invalid");
        }
        if (!echo.file || typeof echo.file !== 'string') {
          return bad("echo.file missing/invalid");
        }
        if (!/\.(md|html)$/.test(echo.file)) {
          return bad("echo.file extension not md/html");
        }
      }
    }

    ok("cycles/manifest.json structure looks valid");
    if (manifest.checksum) ok("checksum present: " + manifest.checksum);
    if (window.ACACIA?.call) ok("beacon present: " + window.ACACIA.call);
  } catch (e) {
    bad(e.message);
  }
})();
