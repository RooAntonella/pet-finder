import { renderEditPetPage, setupEditPetPage } from "../pages/editPetPage";
import {
  renderLoginPage,
  renderRegisterPage,
  setupLoginPage,
  setupRegisterPage,
} from "../pages/authPage";

import { renderHomePage, setupHomePage } from "../pages/homePage";

import { isLoggedIn } from "../state/session";

import { renderProfilePage, setupProfilePage } from "../pages/profilePage";

import {
  renderPersonalDataPage,
  setupPersonalDataPage,
} from "../pages/personalDataPage";

import { renderPasswordPage, setupPasswordPage } from "../pages/passwordPage";
import { renderMyPetsPage, setupMyPetsPage } from "../pages/myPetsPage";
import {
  renderReportPetPage,
  setupReportPetPage,
} from "../pages/reportPetPage";

export function router() {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error("No se encontró #app");
  }

  const route = location.hash || "#/";

  if (route === "#/login") {
    app.innerHTML = renderLoginPage();

    setupLoginPage();

    const registerButton =
      document.querySelector<HTMLButtonElement>("#go-register");

    registerButton?.addEventListener("click", () => {
      location.hash = "#/register";
    });

    return;
  }

  if (route === "#/register") {
    app.innerHTML = renderRegisterPage();

    setupRegisterPage();

    const loginButton = document.querySelector<HTMLButtonElement>("#go-login");

    loginButton?.addEventListener("click", () => {
      location.hash = "#/login";
    });

    return;
  }

  if (route === "#/profile") {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    app.innerHTML = renderProfilePage();

    setupProfilePage();

    return;
  }

  if (route === "#/profile/data") {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    app.innerHTML = renderPersonalDataPage();

    setupPersonalDataPage();

    return;
  }

  if (route === "#/profile/password") {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    app.innerHTML = renderPasswordPage();

    setupPasswordPage();

    return;
  }
  if (route === "#/my-pets") {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    app.innerHTML = renderMyPetsPage();

    setupMyPetsPage();

    return;
  }

  const editPetMatch = route.match(/^#\/pets\/(\d+)\/edit$/);

  if (editPetMatch) {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    const petId = Number(editPetMatch[1]);

    app.innerHTML = renderEditPetPage();

    setupEditPetPage(petId);

    return;
  }

  if (route === "#/report-pet") {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    app.innerHTML = renderReportPetPage();

    setupReportPetPage();

    return;
  }
  app.innerHTML = renderHomePage();

  setupHomePage();
}
