export const customElement = (
  name: string,
  constructor?: (elem: HTMLElement) => void
) => {
  class CustomElementClass extends HTMLElement {
    constructor() {
      super();
      constructor?.(this);
    }
  }
  customElements.define(name, CustomElementClass);
};
