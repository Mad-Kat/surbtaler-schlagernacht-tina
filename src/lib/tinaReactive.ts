import { sharedData } from "./store";

export function initTinaReactive() {
	const tinaRoot = document.getElementById("tina-root");
	if (!tinaRoot) return;

	const template = tinaRoot.innerHTML;

	function extractPath(fieldValue: string | null) {
		return fieldValue?.split("---")[1];
	}

	function getValueByPath(obj: any, path: string | undefined) {
		return path?.split(".").reduce((acc, part) => acc && acc[part], obj);
	}

	function updateDOMWithNewData(newData: any) {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = template;

		updateElementRecursively(tempDiv, newData);

		tinaRoot.innerHTML = tempDiv.innerHTML;
	}

	function updateElementRecursively(element: Element, data: any) {
		const tinaField = element.getAttribute("data-tina-field");
		if (tinaField) {
			const path = extractPath(tinaField);
			const value = getValueByPath(data, path);
			if (typeof value !== "object") {
				element.textContent = value?.toString() || "";
			}
		}

		element.childNodes.forEach((child) => {
			if (child.nodeType === Node.ELEMENT_NODE) {
				updateElementRecursively(child as Element, data);
			}
		});
	}

	sharedData.subscribe((value) => {
		if (value) {
			updateDOMWithNewData(value);
		}
	});
}
