window.API.requests = {
    getAll:  (status, type) => window._apiGet(`requests?status=${status||'all'}&type=${type||'all'}`),
    create:  (data)         => window._apiPost('requests', data),
    review:  (id, action, notes) => window._apiPost(`requests/${id}/review`, { id, action, notes }),
};
