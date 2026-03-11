import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { test as base } from "@playwright/test";
import { config } from "../config/env.config";

type AuthFixture = {
    authenticatedPage: Page;
};

