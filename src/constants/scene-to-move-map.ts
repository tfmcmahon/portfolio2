import {
  campTranslation,
  officeTranslation,
  schoolTranslation,
} from "./scene-translations";

export const sceneMoveMap: Record<
  number,
  Record<string, number | string | Element | null>
> = {
  1: {
    campX: campTranslation[1],
    backgroundClass: "background-scene-one",
    backgroundElement: document.querySelector(".background-scene-one"),
    contentClass: "content__one",
    contentElement: document.querySelector(".content__one"),
    emailLinkElement: document.querySelector(".email-link"),
    emailLinkClass: "email-link__scene-one",
    lightX: -5,
    lightY: 10,
    lightZ: 2,
    officeX: officeTranslation[1],
    schoolX: schoolTranslation[1],
  },
  2: {
    campX: campTranslation[2],
    backgroundClass: "background-scene-two",
    backgroundElement: document.querySelector(".background-scene-two"),
    contentClass: "content__two",
    contentElement: document.querySelector(".content__two"),
    emailLinkElement: document.querySelector(".email-link"),
    emailLinkClass: "email-link__scene-two",
    lightX: 7,
    lightY: 10,
    lightZ: -1,
    officeX: officeTranslation[2],
    schoolX: schoolTranslation[2],
  },
  3: {
    campX: campTranslation[3],
    backgroundClass: "background-scene-three",
    backgroundElement: document.querySelector(".background-scene-three"),
    contentClass: "content__three",
    contentElement: document.querySelector(".content__three"),
    emailLinkElement: document.querySelector(".email-link"),
    emailLinkClass: "email-link__scene-three",
    lightX: -7,
    lightY: 9,
    lightZ: 1,
    officeX: officeTranslation[3],
    schoolX: schoolTranslation[3],
  },
};
