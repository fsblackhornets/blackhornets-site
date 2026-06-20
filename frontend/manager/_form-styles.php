<style>
.page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
.page-header h1 { color:var(--primary-color); font-size:1.6rem; margin:0; }
.back-btn { display:inline-flex; align-items:center; gap:8px; padding:8px 18px; background:var(--secondary-color); color:var(--primary-color); border:1px solid var(--primary-color); border-radius:8px; text-decoration:none; font-size:0.9rem; transition:all 0.3s; }
.back-btn:hover { background:var(--primary-color); color:var(--dark-bg); }
.alert { padding:12px 18px; border-radius:10px; margin-bottom:1.5rem; display:flex; align-items:center; gap:10px; font-size:0.9rem; }
.alert-info { background:rgba(33,150,243,0.1); border:1px solid rgba(33,150,243,0.3); color:#64b5f6; }
.alert-success { background:rgba(40,167,69,0.15); border:1px solid #28a745; color:#5cb85c; }
.alert-error { background:rgba(220,53,69,0.15); border:1px solid #dc3545; color:#e74c3c; }
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
.form-section { background:var(--secondary-color); padding:24px; border-radius:12px; border:1px solid rgba(255,215,0,0.08); margin-bottom:1.5rem; }
.form-section h3 { color:var(--primary-color); font-size:1.1rem; margin-bottom:1.2rem; padding-bottom:10px; border-bottom:1px solid rgba(255,215,0,0.1); }
.form-group { margin-bottom:1rem; }
.form-group label { display:block; color:var(--text-gray); font-size:0.88rem; font-weight:500; margin-bottom:5px; }
.form-group input, .form-group select, .form-group textarea { width:100%; padding:9px 13px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--text-light); font-size:0.9rem; font-family:'Poppins',sans-serif; box-sizing:border-box; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline:none; border-color:var(--primary-color); box-shadow:0 0 0 3px rgba(255,215,0,0.08); }
.form-group select option { background:#2d2d2d; }
.form-actions { display:flex; gap:1rem; justify-content:center; margin-top:1.5rem; }
.btn-submit { display:inline-flex; align-items:center; gap:8px; padding:11px 28px; background:var(--primary-color); color:var(--dark-bg); border:none; border-radius:8px; font-size:0.95rem; font-weight:600; cursor:pointer; transition:all 0.3s; font-family:'Poppins',sans-serif; }
.btn-submit:hover { background:var(--primary-hover); transform:translateY(-2px); }
.btn-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
.btn-cancel { display:inline-flex; align-items:center; gap:8px; padding:11px 28px; background:transparent; color:var(--text-gray); border:1px solid rgba(255,255,255,0.15); border-radius:8px; font-size:0.95rem; text-decoration:none; transition:all 0.3s; }
.btn-cancel:hover { border-color:#dc3545; color:#dc3545; }
@media(max-width:768px) { .form-grid{grid-template-columns:1fr;} .page-header{flex-direction:column;gap:1rem;align-items:flex-start;} }
</style>
