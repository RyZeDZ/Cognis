function toggleDropdown(id) {
	let dropdown = document.getElementById(id);
	let isOpen = dropdown.style.maxHeight && dropdown.style.maxHeight !== "0px";

	document.querySelectorAll('.dropdown').forEach(el => {
		el.style.maxHeight = "0px";
		el.style.opacity = "0";
	});

	if (!isOpen) {
		dropdown.style.maxHeight = dropdown.scrollHeight + "px";
		dropdown.style.opacity = "1";
	}
}
