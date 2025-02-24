document.querySelectorAll(".navigation a").forEach(anchor => {
	anchor.addEventListener('click', function(e) {
		e.preventDefault();
		const target = this.getAttribute('href').substring(1);
		const targetElement = document.getElementById(target);

		if (targetElement) {
			targetElement.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
	});
});