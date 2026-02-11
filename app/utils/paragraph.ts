export function splitPlainTextIntoParagraphs(text: string): string[] {

    return text
        .trim()
        .split(/\r?\n\s*\r?\n/g)
        .map((p) => p.trim())
        .filter(Boolean);
}

export function splitHtmlIntoParagraphs(html: string): string[] {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const ps = Array.from(doc.querySelectorAll("p"));
    if (ps.length) {
        return ps.map((p) => p.innerHTML.trim()).filter(Boolean);
    }

    const body = doc.body.innerHTML.trim();
    return body ? [body] : [];
}

export function htmlToText(html: string): string {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent?.trim() || "";
}
