/* global SillyTavern */
import katex from 'katex';
import asciiMathToLatex from 'asciimath-to-latex';

const {
    eventSource,
    event_types,
} = SillyTavern.getContext();

const events = [
    event_types.CHARACTER_MESSAGE_RENDERED,
    event_types.USER_MESSAGE_RENDERED,
    event_types.CHAT_CHANGED,
    event_types.MESSAGE_SWIPED,
    event_types.MESSAGE_UPDATED,
];

// Set event listeners for chat events.
for (const event of events) {
    eventSource.on(event, renderMath);
}

async function renderMath() {
    const blocks = Array.from(document.querySelectorAll('#chat pre code'));

    if (blocks.length === 0) {
        return;
    }

    const nodes = [];
    for (const block of blocks) {
        const isLatex = block.classList.contains('custom-language-latex');
        const isAsciiMath = block.classList.contains('custom-language-asciimath');

        if (!isLatex && !isAsciiMath) {
            continue;
        }

        if (isAsciiMath) {
            const asciiMath = block.textContent;
            const latex = asciiMathToLatex(asciiMath);
            block.textContent = latex;
        }

        const parent = block.parentElement;
        parent.querySelector('.code-copy')?.remove();
        nodes.push(parent);
    }

    if (nodes.length === 0) {
        return;
    }

    for (const node of nodes) {
        katex.render(node.innerText, node, {
            throwOnError: false,
            output: 'mathml',
        });
    }

    // Wait for the chat to update.
    await new Promise((resolve) => setTimeout(resolve, 0));
}
