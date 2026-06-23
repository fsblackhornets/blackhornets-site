<style>
.page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
.page-header h1 { font-family:'Michroma',sans-serif; color:#FFD700; font-size:1.3rem; margin:0; letter-spacing:1px; }
.back-btn { display:inline-flex; align-items:center; gap:8px; padding:8px 18px; background:transparent; color:#FFD700; border:1px solid rgba(255,215,0,0.3); border-radius:8px; text-decoration:none; font-size:0.88rem; font-family:'Rajdhani',sans-serif; transition:all 0.3s; }
.back-btn:hover { background:rgba(255,215,0,0.08); border-color:#FFD700; }
.alert { padding:12px 18px; border-radius:10px; margin-bottom:1.5rem; display:flex; align-items:center; gap:10px; font-size:0.9rem; font-family:'Rajdhani',sans-serif; }
.alert-info    { background:rgba(33,150,243,0.08); border:1px solid rgba(33,150,243,0.25); color:#64b5f6; }
.alert-success { background:rgba(40,167,69,0.1);  border:1px solid rgba(40,167,69,0.3);  color:#5cb85c; }
.alert-error   { background:rgba(220,53,69,0.1);  border:1px solid rgba(220,53,69,0.3);  color:#e74c3c; }
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
.form-section { background:#111; padding:24px; border-radius:12px; border:1px solid rgba(255,215,0,0.1); margin-bottom:1.5rem; }
.form-section h3 { font-family:'Michroma',sans-serif; color:#FFD700; font-size:0.9rem; letter-spacing:1px; text-transform:uppercase; margin-bottom:1.2rem; padding-bottom:10px; border-bottom:1px solid rgba(255,215,0,0.1); }
.form-group { margin-bottom:1rem; }
.form-group label { display:block; color:#888; font-size:0.88rem; font-weight:500; margin-bottom:5px; font-family:'Rajdhani',sans-serif; }
.form-group input, .form-group select, .form-group textarea { width:100%; padding:9px 13px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#e0e0e0; font-size:0.9rem; font-family:'Rajdhani',sans-serif; box-sizing:border-box; outline:none; transition:border-color 0.2s; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color:rgba(255,215,0,0.5); box-shadow:0 0 0 3px rgba(255,215,0,0.06); }
.form-group select option { background:#1a1a1a; }
.form-actions { display:flex; gap:1rem; justify-content:center; margin-top:1.5rem; }
.btn-submit { display:inline-flex; align-items:center; gap:8px; padding:11px 28px; background:linear-gradient(135deg,#FFB300,#FFD700); color:#000; border:none; border-radius:8px; font-size:0.95rem; font-weight:700; cursor:pointer; transition:all 0.3s; font-family:'Michroma',sans-serif; letter-spacing:1px; }
.btn-submit:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(255,215,0,0.3); }
.btn-submit:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
.btn-cancel { display:inline-flex; align-items:center; gap:8px; padding:11px 28px; background:transparent; color:#888; border:1px solid rgba(255,255,255,0.12); border-radius:8px; font-size:0.95rem; text-decoration:none; transition:all 0.3s; font-family:'Rajdhani',sans-serif; }
.btn-cancel:hover { border-color:#e74c3c; color:#e74c3c; }
@media(max-width:768px) { .form-grid{grid-template-columns:1fr;} .page-header{flex-direction:column;gap:1rem;align-items:flex-start;} }
</style>
