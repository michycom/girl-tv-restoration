import { GuitarTab } from './guitarTab.js';
import { addEventListeners } from './events.js';

const initGuitarTab = () => {
    const guitarTab = new GuitarTab();
    guitarTab.drawFretboard();
    addEventListeners(guitarTab);
};

export { initGuitarTab };
