"use strict";

namespace Twisty {

export class Player {
  private readonly viewContainer: HTMLElement;
  private anim: Anim.Model;
  constructor(public element: Element) {
    this.viewContainer = document.createElement("twisty-view-container");
    this.anim = new Anim.Model(this.draw.bind(this), new Anim.SimpleBreakPoints([0, 1000, 1500, 2500]));

    this.element.appendChild(this.viewContainer);
    this.element.appendChild((new Twisty.Widget.Scrubber(this.anim)).element);
    this.element.appendChild((new Twisty.Widget.ControlBar(this.anim, this.element)).element);

    this.draw(0);
  }

  draw(duration: Anim.Duration) {
    this.viewContainer.textContent = String(Math.floor(duration));
  }

  // Initialize a Twisty for the given Element unless the element's
  // `initialization` attribute is set to `custom`.
  private static autoInitialize(elem: Element) {
    const ini = elem.getAttribute("initialization");
    if (ini !== "custom") {
      new Twisty.Player(elem);
    }
  }

  static autoInitializePage() {
    const elems = document.querySelectorAll("twisty");
    console.log(`Found ${elems.length} twisty elem${elems.length === 1 ? "" : "s"} on page.`)

    for (let i = 0; i < elems.length; i++) {
      Twisty.Player.autoInitialize(elems[i]);
    }
  }
}

window.addEventListener("load", Twisty.Player.autoInitializePage);

}