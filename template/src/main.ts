function render(element: HTMLElement, content: string) {
  element.innerHTML = content;
}

const root = document.getElementById("root")!;
render(root, "<h1>Welcome to Arfa</h1>");
