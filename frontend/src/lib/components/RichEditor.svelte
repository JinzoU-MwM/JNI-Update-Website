<script lang="ts">
  import { tick } from 'svelte';

  interface Props {
    value: string;
    placeholder?: string;
    onchange: (value: string) => void;
  }

  let { value = $bindable(), placeholder = '', onchange }: Props = $props();

  let editorRef: HTMLDivElement | undefined = $state();
  let showPreview = $state(false);
  let activeFormats = $state({ bold: false, italic: false, h2: false, h3: false });

  const wordCount = $derived(value.trim() ? value.trim().split(/\s+/).length : 0);
  const charCount = $derived(value.length);

  function execCommand(command: string, value?: string) {
    document.execCommand(command, false, value);
    updateValue();
    checkActiveFormats();
  }

  function insertHeading(tag: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (editorRef) {
      document.execCommand('formatBlock', false, tag);
      updateValue();
      checkActiveFormats();
    }
  }

  function insertLink() {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      updateValue();
    }
  }

  function insertList(ordered: boolean) {
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList', false);
    updateValue();
  }

  function insertBlockquote() {
    document.execCommand('formatBlock', false, 'blockquote');
    updateValue();
  }

  function updateValue() {
    if (editorRef) {
      onchange(editorRef.innerHTML);
    }
  }

  function checkActiveFormats() {
    activeFormats = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      h2: document.queryCommandValue('formatBlock') === 'h2',
      h3: document.queryCommandValue('formatBlock') === 'h3'
    };
  }

  function handleInput() {
    updateValue();
    checkActiveFormats();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
    updateValue();
  }

  async function setupEditor() {
    await tick();
    if (editorRef && value) {
      editorRef.innerHTML = value;
    }
  }

  $effect(() => {
    setupEditor();
  });
</script>

<div class="editor-container">
  <div class="toolbar">
    <button
      type="button"
      class="tool-btn"
      class:active={activeFormats.bold}
      onclick={() => execCommand('bold')}
      title="Bold (Ctrl+B)"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
    </button>
    <button
      type="button"
      class="tool-btn"
      class:active={activeFormats.italic}
      onclick={() => execCommand('italic')}
      title="Italic (Ctrl+I)"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
    </button>
    <button
      type="button"
      class="tool-btn"
      onclick={() => execCommand('underline')}
      title="Underline (Ctrl+U)"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
    </button>

    <div class="divider"></div>

    <button
      type="button"
      class="tool-btn"
      class:active={activeFormats.h2}
      onclick={() => insertHeading('h2')}
      title="Heading 2"
    >H2</button>
    <button
      type="button"
      class="tool-btn"
      class:active={activeFormats.h3}
      onclick={() => insertHeading('h3')}
      title="Heading 3"
    >H3</button>

    <div class="divider"></div>

    <button
      type="button"
      class="tool-btn"
      onclick={() => insertList(false)}
      title="Bullet List"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
    </button>
    <button
      type="button"
      class="tool-btn"
      onclick={() => insertList(true)}
      title="Numbered List"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="3" y="8" font-size="8" fill="currentColor">1</text><text x="3" y="14" font-size="8" fill="currentColor">2</text><text x="3" y="20" font-size="8" fill="currentColor">3</text></svg>
    </button>

    <div class="divider"></div>

    <button
      type="button"
      class="tool-btn"
      onclick={insertLink}
      title="Insert Link"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    </button>
    <button
      type="button"
      class="tool-btn"
      onclick={insertBlockquote}
      title="Quote"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
    </button>

    <div class="spacer"></div>

    <button
      type="button"
      class="tool-btn preview-toggle"
      class:active={showPreview}
      onclick={() => showPreview = !showPreview}
      title="Toggle Preview"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      <span>Preview</span>
    </button>
  </div>

  <div class="editor-body" class:with-preview={showPreview}>
    {#if showPreview}
      <div class="editor-pane">
        <div class="pane-label">Edit</div>
        <div
          bind:this={editorRef}
          class="editor-content"
          contenteditable="true"
          role="textbox"
          oninput={handleInput}
          onkeydown={handleKeydown}
          onpaste={handlePaste}
          onmouseup={checkActiveFormats}
          onkeyup={checkActiveFormats}
        ></div>
      </div>
      <div class="preview-pane">
        <div class="pane-label">Preview</div>
        <div class="preview-content">
          {#if value}
            {@html value}
          {:else}
            <span class="empty-hint">Start writing to see preview...</span>
          {/if}
        </div>
      </div>
    {:else}
      <div
        bind:this={editorRef}
        class="editor-content full"
        contenteditable="true"
        role="textbox"
        oninput={handleInput}
        onkeydown={handleKeydown}
        onpaste={handlePaste}
        onmouseup={checkActiveFormats}
        onkeyup={checkActiveFormats}
      ></div>
    {/if}
  </div>

  <div class="editor-footer">
    <span class="hint">Tip: Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline</span>
    <span class="count">{wordCount} words · {charCount} characters</span>
  </div>
</div>

<style>
  .editor-container {
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    background: #f8faf8;
    transition: all 0.2s ease;
  }

  .editor-container:focus-within {
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px rgba(56, 124, 68, 0.1);
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 12px;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    flex-wrap: wrap;
  }

  .tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text);
    transition: all 0.15s ease;
    font-size: 12px;
    font-weight: 700;
  }

  .tool-btn:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  .tool-btn.active {
    background: var(--primary);
    color: white;
  }

  .tool-btn.preview-toggle {
    width: auto;
    padding: 0 10px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .divider {
    width: 1px;
    height: 20px;
    background: rgba(0, 0, 0, 0.1);
    margin: 0 4px;
  }

  .spacer {
    flex: 1;
  }

  .editor-body {
    min-height: 400px;
    display: flex;
  }

  .editor-body.with-preview {
    min-height: 500px;
  }

  .editor-pane, .preview-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .pane-label {
    padding: 8px 16px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-light);
    background: rgba(0, 0, 0, 0.02);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  .editor-pane {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }

  .editor-content {
    flex: 1;
    padding: 20px;
    font-size: 0.95rem;
    line-height: 1.7;
    outline: none;
    overflow-y: auto;
    min-height: 300px;
  }

  .editor-content.full {
    min-height: 400px;
  }

  .editor-content:empty::before {
    content: attr(data-placeholder);
    color: var(--text-light);
    pointer-events: none;
  }

  .editor-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 1.5em 0 0.5em;
    color: var(--text-dark);
  }

  .editor-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1.25em 0 0.5em;
    color: var(--text-dark);
  }

  .editor-content :global(p) {
    margin: 0 0 1em;
  }

  .editor-content :global(ul), .editor-content :global(ol) {
    margin: 0 0 1em;
    padding-left: 1.5em;
  }

  .editor-content :global(li) {
    margin: 0.25em 0;
  }

  .editor-content :global(blockquote) {
    margin: 1em 0;
    padding: 0.75em 1em;
    border-left: 3px solid var(--primary);
    background: rgba(56, 124, 68, 0.05);
    font-style: italic;
    color: var(--text);
  }

  .editor-content :global(a) {
    color: var(--primary);
    text-decoration: underline;
  }

  .editor-content :global(strong) {
    font-weight: 700;
  }

  .editor-content :global(em) {
    font-style: italic;
  }

  .preview-pane {
    background: white;
  }

  .preview-content {
    flex: 1;
    padding: 20px;
    font-size: 0.95rem;
    line-height: 1.7;
    overflow-y: auto;
    min-height: 300px;
  }

  .preview-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 1.5em 0 0.5em;
    color: var(--text-dark);
  }

  .preview-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1.25em 0 0.5em;
    color: var(--text-dark);
  }

  .preview-content :global(p) {
    margin: 0 0 1em;
  }

  .preview-content :global(ul), .preview-content :global(ol) {
    margin: 0 0 1em;
    padding-left: 1.5em;
  }

  .preview-content :global(li) {
    margin: 0.25em 0;
  }

  .preview-content :global(blockquote) {
    margin: 1em 0;
    padding: 0.75em 1em;
    border-left: 3px solid var(--primary);
    background: rgba(56, 124, 68, 0.05);
    font-style: italic;
    color: var(--text);
  }

  .preview-content :global(a) {
    color: var(--primary);
    text-decoration: underline;
  }

  .empty-hint {
    color: var(--text-light);
    font-style: italic;
  }

  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: rgba(0, 0, 0, 0.02);
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    font-size: 0.75rem;
  }

  .hint {
    color: var(--text-light);
  }

  .count {
    color: var(--text-light);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .editor-body.with-preview {
      flex-direction: column;
    }

    .editor-pane {
      border-right: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
  }
</style>
