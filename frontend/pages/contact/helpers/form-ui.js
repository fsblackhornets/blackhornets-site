window.setupFormInputAnimations = () => {
	document
		.querySelectorAll(".form-group input, .form-group textarea")
		.forEach((input) => {
			input.addEventListener("focus", () =>
				input.parentElement.classList.add("focused"),
			);
			input.addEventListener("blur", () => {
				if (!input.value) input.parentElement.classList.remove("focused");
			});
		});
};

window.showFormMessage = (html) => {
	const div = document.getElementById("formMessage");
	if (div) {
		div.innerHTML = html;
		div.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}
};
