window.validateApplyForm = (form) => {
    const required = ['firstName','lastName','email','phone','studentId','faculty','major','academic_year','gpa','position','motivation'];
    for (const id of required) {
        const el = form.querySelector(`#${id}`);
        if (!el || !el.value.trim()) throw new Error(`${id.replace(/([A-Z])/g,' $1')} is required.`);
    }

    const email = form.querySelector('#email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        throw new Error('Invalid email address.');
    }

    const file = form.querySelector('#resume')?.files?.[0];
    if (!file) throw new Error('Please select a resume file.');
    if (file.type !== 'application/pdf') throw new Error('Only PDF files are allowed.');
    if (file.size > 5 * 1024 * 1024) throw new Error('File must be under 5MB.');
};
