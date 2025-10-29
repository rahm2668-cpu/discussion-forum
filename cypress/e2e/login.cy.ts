// <reference types="cypress" />

describe("Login E2E Tests", () => {
  beforeEach(() => {
    // Mock API endpoints
    cy.intercept("POST", "https://forum-api.dicoding.dev/v1/login", (req) => {
      const { email, password } = req.body;
      if (email === "user@example.com" && password === "correctpassword") {
        req.reply({
          statusCode: 200,
          body: {
            status: "success",
            message: "Login successful",
            data: { token: "token123" },
          },
        });
      } else {
        req.reply({
          statusCode: 401,
          body: {
            status: "fail",
            message: "Login failed",
          },
        });
      }
    });
    cy.intercept("GET", "https://forum-api.dicoding.dev/v1/users/me", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          status: "success",
          message: "Profile fetched",
          data: {
            user: {
              id: "1",
              name: "Test User",
              email: "user@example.com",
              avatar: "avatar.png",
            },
          },
        },
      });
    });

    // kunjungi halaman login sebelum setiap test
    cy.visit("/login");
  });

  it("should display login page correctly", () => {
    // cek apakah input email dan password serta tombol login muncul
    cy.get('[data-testid="email-input"]').should("exist");
    cy.get('[data-testid="password-input"]').should("exist");
    cy.get('button[type="submit"]').contains("Log In");
  });

  it("should display alert when email is empty", () => {
    // hanya isi password lalu submit
    cy.get('[data-testid="password-input"]').type("password123");
    cy.get('button[type="submit"]').click();

    // cek apakah toast error muncul
    cy.get(".toaster").should("contain", "Please fill in all fields");
  });

  it("should display alert when password is empty", () => {
    // hanya isi email lalu submit
    cy.get('[data-testid="email-input"]').type("user@example.com");
    cy.get('button[type="submit"]').click();

    // cek apakah toast error muncul
    cy.get(".toaster").should("contain", "Please fill in all fields");
  });

  it("should display alert when email or password is incorrect", () => {
    cy.get('[data-testid="email-input"]').type("wrong@example.com");
    cy.get('[data-testid="password-input"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // cek toast error muncul (asumsi error dari server)
    cy.get(".toaster").should("contain", "Login failed");
  });

  it("should display homepage after successful login", () => {
    cy.get('[data-testid="email-input"]').type("user@example.com");
    cy.get('[data-testid="password-input"]').type("correctpassword");
    cy.get('button[type="submit"]').click();

    // cek redirect ke homepage
    cy.url().should("eq", "http://localhost:3000/");
    cy.contains("Welcome Back").should("not.exist"); // halaman login hilang
  });
});
